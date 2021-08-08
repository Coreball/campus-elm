import React from 'react'
import ReactMapboxGl, { Layer, Source } from 'react-mapbox-gl'
import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core'
import { Location } from './Location'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      marginLeft: '1%',
    },
    main: {
      display: 'flex',
      flexGrow: 1,
    },
    map: {
      width: '77.5%',
    },
    sidebar: {
      width: '22.5%',
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
      <header>
        <Typography variant="h6" component="h1">
          Campus Mapper
        </Typography>
      </header>
      <div className={classes.main}>
        <div className={classes.sidebar}>
          <p>
            <Typography>
              Welcome to Campus Mapper! Explore campus to its full potential by
              using this website as a visual checklist for where you've been.{' '}
            </Typography>
          </p>
        </div>
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
    </div>
  )
}
