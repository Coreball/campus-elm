import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  serverTimestamp,
  setDoc,
  getDoc,
} from 'firebase/firestore'
import { CampusInfo } from '../CampusInfo'
import { Location } from '../Location'
import { Visited } from '../Visited'

import firebaseConfig from './firebase.json'

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

export const getCampusInfo = async (campus: string): Promise<CampusInfo> => {
  const campusDoc = doc(db, 'campuses', campus)
  const campusSnapshot = await getDoc(campusDoc)
  return campusSnapshot.data() as CampusInfo
}

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

const googleProvider = new GoogleAuthProvider()
export const signInWithGooglePopup = async () =>
  signInWithPopup(auth, googleProvider).catch(error => console.error(error))

export const signOutUser = async () => signOut(auth)

export const getUserVisited = async (
  uid: string,
  campus: string
): Promise<Visited[]> => {
  const userDoc = doc(db, 'users', uid)
  const userSnapshot = await getDoc(userDoc)
  if (userSnapshot.exists()) {
    return userSnapshot.data().visited[campus].map((visited: any) => ({
      ...visited,
      timestamp: visited.timestamp.toDate(),
    }))
  } else {
    return []
  }
}

export const setUserVisited = async (
  uid: string,
  campus: string,
  visited: Visited[]
) => {
  const userDoc = doc(db, 'users', uid)
  return setDoc(
    userDoc,
    {
      visited: {
        [campus]: visited,
      },
      updated: serverTimestamp(),
    },
    { merge: true }
  )
}
