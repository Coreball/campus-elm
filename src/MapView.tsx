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
  attributionControl: false,
})

export const MapView = () => {
  const classes = useStyles()
  const sampleLocations: Location[] = require('./sample-locations.json')

  return (
    <div className={classes.root}>
      <header>
        <Typography variant="h6" component="h1">
          Campus Mapper
        </Typography>
      </header>
      <div className={classes.main}>
        <div className={classes.sidebar}>
          <Typography>
            Welcome to Campus Mapper! Explore campus to its full potential by
            using this website as a visual checklist for where you've been.
          </Typography>
        </div>
        <Map
          className={classes.map}
          style="mapbox://styles/coreball/cks2mne9b30gp17mwigqj96c7" // eslint-disable-line react/style-prop-object
          center={[-76.48, 42.45]}
          zoom={[14.5]}
        >
          {sampleLocations.map(location => (
            <>
              <Source
                id={location.id}
                geoJsonSource={{ type: 'geojson', data: location.geoJson }}
              />
              <Layer
                id={`${location.id}-fill`}
                type="fill"
                sourceId={location.id}
                onClick={() => console.log(location.id)}
                paint={{
                  'fill-color': '#fff',
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
