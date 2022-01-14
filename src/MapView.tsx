import React, { useEffect, useRef, useState } from 'react'
import ReactMapboxGl, { Layer, Source } from 'react-mapbox-gl'
import { styled } from '@mui/system'
import { Box, Typography } from '@mui/material'
import { User } from 'firebase/auth'
import { Location } from './Location'
import { getLocations } from './firebase'

const Map = styled(
  ReactMapboxGl({
    accessToken: process.env.REACT_APP_MAPBOX_TOKEN!,
    hash: true,
    attributionControl: false,
  })
)()

interface MapViewProps {
  user: User | null
}

export const MapView = ({ user }: MapViewProps) => {
  // Reference the same arrays to prevent re-centering on mapHandleClickRef update
  const [center] = useState<[number, number]>([-76.48, 42.45])
  const [zoom] = useState<[number]>([14.5])

  const campus = 'cornell'

  const [locations, setLocations] = useState<Location[]>([])
  useEffect(() => {
    getLocations(campus).then(locations => setLocations(locations))
  }, [campus])
  // const locations: Location[] = require('./sample-locations.json')

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  )

  const unvisitedCollection = {
    type: 'FeatureCollection',
    features: locations.map(location => ({
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

  const mapHandleClick = (map: mapboxgl.Map, event: any) =>
    setSelectedLocation(queryForLocation(map, event.point))
  const mapHandleClickRef = useRef(mapHandleClick)
  mapHandleClickRef.current = mapHandleClick // Update reference on every render

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        marginLeft: '1%',
      }}
    >
      <header>
        <Typography variant="h6" component="h1">
          Campus Mapper
        </Typography>
        <span>
          {user
            ? user.isAnonymous
              ? user.uid
              : user.displayName
            : 'LOGGED OUT'}
        </span>
      </header>
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Box sx={{ width: '22.5%' }}>
          {selectedLocation ? <p>{selectedLocation.id}</p> : <p>{campus}</p>}
        </Box>
        <Map
          sx={{ width: '77.5%' }}
          style="mapbox://styles/coreball/cks2mne9b30gp17mwigqj96c7" // eslint-disable-line react/style-prop-object
          center={center}
          zoom={zoom}
          onClick={(map, event: any) => mapHandleClickRef.current(map, event)}
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
        </Map>
      </Box>
    </Box>
  )
}
