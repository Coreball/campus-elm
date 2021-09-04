import React, { useEffect, useState } from 'react'
import ReactMapboxGl, { Layer, Source } from 'react-mapbox-gl'
import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core'
import { Location } from './Location'
import { getLocations } from './firebase'

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
  const campus = 'cornell'

  const [locations, setLocations] = useState<Location[]>([])
  useEffect(() => {
    getLocations(campus).then(locations => setLocations(locations))
  }, [campus])
  // const locations: Location[] = require('./sample-locations.json')

  const unvisitedCollection = {
    type: 'FeatureCollection',
    features: locations.map(location => location.geoJson),
  }

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
      </div>
    </div>
  )
}
