import React from 'react'
import ReactMapboxGl from 'react-mapbox-gl'
import { createStyles, makeStyles, Theme } from '@material-ui/core'

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

  return (
    <div className={classes.root}>
      <Map
        className={classes.map}
        style="mapbox://styles/mapbox/streets-v11" // eslint-disable-line react/style-prop-object
        center={[-76.48, 42.45]}
        zoom={[14.5]}
      />
    </div>
  )
}
