import React, { useRef, useState } from 'react'
import ReactMapboxGl, { Layer, Source } from 'react-mapbox-gl'
import { styled, useTheme } from '@mui/system'
import {
  Box,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  linearProgressClasses,
  Typography,
} from '@mui/material'
import CountUp from 'react-countup'
import { User } from 'firebase/auth'
import { CampusInfo } from './CampusInfo'
import { Collection } from './Collection'
import { Location } from './Location'
import { Visited } from './Visited'
import { Navigation } from './Navigation'

const Map = styled(
  ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAPBOX_TOKEN!,
    attributionControl: false,
    antialias: true,
    doubleClickZoom: false,
  })
)()

interface MapViewProps {
  campus: string
  user: User | null
  totalScore: number
  campusInfo?: CampusInfo
  locations: Location[]
  collections: Collection[]
  visited: Visited[]
  collectionProgress: (collection: Collection) => number
  updateVisited: (id: string, checked: boolean) => void
}

export const MapView = ({
  campus,
  user,
  totalScore,
  campusInfo,
  locations,
  collections,
  visited,
  collectionProgress,
  updateVisited,
}: MapViewProps) => {
  const theme = useTheme()

  // Reference the same arrays to prevent re-centering on mapHandleClickRef update
  const [center] = useState<[number, number]>([-76.48, 42.45])
  const [zoom] = useState<[number]>([14.5])

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  )

  const isVisited = (id: string) => {
    return visited.some(visit => visit.id === id)
  }

  const timestampVisited = (id: string) => {
    return visited.find(visit => visit.id === id)!.timestamp
  }

  const labelVisited = (id: string) => {
    return isVisited(id)
      ? `Visited on ${timestampVisited(id).toLocaleDateString()}`
      : 'Mark Visited'
  }

  const unvisitedCollection = {
    type: 'FeatureCollection',
    features: locations
      .filter(location => !isVisited(location.id))
      .map(location => ({
        ...location.geoJson,
        properties: { id: location.id }, // To identify Location later
      })),
  }

  const visitedCollection = {
    type: 'FeatureCollection',
    features: locations
      .filter(location => isVisited(location.id))
      .map(location => ({
        ...location.geoJson,
        properties: { id: location.id }, // To identify Location later
      })),
  }

  const selectedCollection = {
    type: 'FeatureCollection',
    features: locations
      .filter(location => location === selectedLocation)
      .map(location => ({
        ...location.geoJson,
        properties: { id: location.id }, // To identify Location later
      })),
  }

  const queryForLocation = (map: mapboxgl.Map, point: mapboxgl.PointLike) => {
    // First 'id' property in array of selected features is the id of the Location
    const id: string | undefined = map
      .queryRenderedFeatures(point)
      .find(
        feature => feature.properties && feature.properties.id !== undefined
      )?.properties!.id
    return locations.find(location => location.id === id) ?? null
  }

  const handleMapClick = (map: mapboxgl.Map, event: any) =>
    setSelectedLocation(queryForLocation(map, event.point))
  const handleMapClickRef = useRef(handleMapClick)
  handleMapClickRef.current = handleMapClick // Update reference on every render

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: window.innerHeight,
      }}
    >
      <Navigation campus={campus} user={user} />
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          flexDirection: { xs: 'column-reverse', sm: 'row' },
        }}
      >
        <Box sx={{ width: 300, ml: 3, mr: 3 }}>
          <Typography component="h2">{campusInfo?.name}</Typography>
          <Typography>
            <strong>
              <CountUp
                end={totalScore}
                duration={0.2}
                preserveValue={true}
                useEasing={false}
              />
            </strong>{' '}
            Score
          </Typography>
          {selectedLocation ? (
            <>
              <Box sx={{ mt: 1 }}>
                <Typography>{selectedLocation.name}</Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isVisited(selectedLocation.id)}
                      onChange={(event, checked) =>
                        updateVisited(selectedLocation.id, checked)
                      }
                    />
                  }
                  label={labelVisited(selectedLocation.id)}
                />
              </Box>
              {selectedLocation.sublocations?.map(sublocation => (
                <Box>
                  <Typography>{sublocation.name}</Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isVisited(sublocation.id)}
                        onChange={(event, checked) =>
                          updateVisited(sublocation.id, checked)
                        }
                      />
                    }
                    label={labelVisited(sublocation.id)}
                  />
                </Box>
              ))}
            </>
          ) : (
            <>
              {[...collections]
                .sort((a, b) => collectionProgress(b) - collectionProgress(a))
                .map(collection => (
                  <Box sx={{ mt: 1 }}>
                    <Typography>
                      {collection.members.filter(id => isVisited(id)).length}/
                      {collection.members.length} {collection.name}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={collectionProgress(collection)}
                      sx={{
                        mt: 1,
                        borderRadius: '3px',
                        height: 6,
                        [`&.${linearProgressClasses.colorPrimary}`]: theme => ({
                          backgroundColor:
                            theme.palette.grey[
                              theme.palette.mode === 'light' ? 200 : 800
                            ],
                        }),
                        [`& .${linearProgressClasses.bar}`]: {
                          borderRadius: '3px',
                        },
                      }}
                    />
                  </Box>
                ))}
            </>
          )}
        </Box>
        <Map
          sx={{ flexGrow: 1 }}
          style="mapbox://styles/coreball/cks2mne9b30gp17mwigqj96c7" // eslint-disable-line react/style-prop-object
          center={center}
          zoom={zoom}
          onClick={(map, event: any) => handleMapClickRef.current(map, event)}
        >
          <Source
            id="unvisited"
            geoJsonSource={{ type: 'geojson', data: unvisitedCollection }}
          />
          <Layer
            id="unvisited-fill"
            type="fill"
            sourceId="unvisited"
            paint={{
              'fill-color': '#fff',
              'fill-opacity': 0.5,
            }}
          />
          <Source
            id="visited"
            geoJsonSource={{ type: 'geojson', data: visitedCollection }}
          />
          <Layer
            id="visited-fill"
            type="fill"
            sourceId="visited"
            paint={{
              'fill-color': '#000',
              'fill-opacity': 0.5,
            }}
          />
          <Source
            id="selected"
            geoJsonSource={{ type: 'geojson', data: selectedCollection }}
          />
          <Layer
            id="selected-fill"
            type="fill"
            sourceId="selected"
            paint={{
              'fill-color': theme.palette.primary.main,
              'fill-opacity': 0.75,
            }}
          />
        </Map>
      </Box>
    </Box>
  )
}
