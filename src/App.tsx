import React, { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import './App.css'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN!

const App = () => {
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
    <div className="App">
      <div ref={mapContainer} style={{ height: '100%' }}></div>
    </div>
  )
}

export default App
