import { Feature } from 'geojson'

export interface Sublocation {
  id: string
  name: string
}

export interface Location {
  id: string
  name: string
  category: string
  geoJson: Feature
  sublocations?: Sublocation[]
}
