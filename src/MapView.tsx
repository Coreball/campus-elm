import React from 'react'
import ReactMapboxGl, { Layer, Source } from 'react-mapbox-gl'
import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { Location } from './Location'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100vh',
    },
    map: {
      height: '100%',
    },
  })
)

const Map = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_TOKEN!,
  hash: true,
})

export const MapView = () => {
  const classes = useStyles()
  const sampleLocations: Location[] = require('./sample-locations.json')

  const toGeoJson = (location: Location) => ({
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: location.coordinates,
      },
    },
  })

  return (
    <div className={classes.root}>
      <Map
        className={classes.map}
        style="mapbox://styles/mapbox/streets-v11" // eslint-disable-line react/style-prop-object
        center={[-76.48, 42.45]}
        zoom={[14.5]}
      >
        {sampleLocations.map(location => (
          <>
            <Source id={location.id} geoJsonSource={toGeoJson(location)} />
            <Layer
              id={`${location.id}-fill`}
              type="fill"
              sourceId={location.id}
              onClick={() => console.log(location.id)}
              paint={{
                'fill-color': '#0080ff',
                'fill-opacity': 0.5,
              }}
            />
          </>
        ))}
      </Map>
    </div>
  )
}
