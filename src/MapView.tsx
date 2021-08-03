import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import { createStyles, makeStyles, Theme } from '@material-ui/core'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN!

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

export const MapView = () => {
  const classes = useStyles()
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const lng = -76.48
  const lat = 42.45
  const zoom = 14.5

  useEffect(() => {
    if (map.current || !mapContainer.current) return
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    })
  })

  return (
    <div className={classes.root}>
      <div ref={mapContainer} className={classes.map}></div>
    </div>
  )
}
