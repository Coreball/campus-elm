import { Feature } from 'geojson'

export interface Location {
  id: string
  name: string
  geoJson: Feature
}
