import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { Location } from '../Location'

import firebaseConfig from './firebase.json'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

export const getLocations = async (campus: string): Promise<Location[]> => {
  const locationCollection = collection(db, 'campuses', campus, 'locations')
  const locationSnapshot = await getDocs(locationCollection)
  return locationSnapshot.docs
    .map(doc => doc.data())
    .map(location => ({
      ...location,
      geoJson: JSON.parse(location.geoJson),
    })) as Location[]
}
