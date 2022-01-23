import React, { useEffect, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { colors } from '@mui/material'
import { onAuthStateChanged, User } from 'firebase/auth'
import { Route, Routes } from 'react-router-dom'
import {
  auth,
  getCampusInfo,
  getCollections,
  getUserVisited,
  setUserVisited,
} from './firebase'
import { MapView } from './MapView'
import { Profile } from './Profile'
import { CampusInfo } from './CampusInfo'
import { Collection } from './Collection'
import { Visited } from './Visited'

const theme = createTheme({
  palette: {
    primary: colors.red,
  },
})

const App = () => {
  const campus = 'cornell'

  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      setUser(user)
      console.log('auth change', user)
    })
  }, [])

  const [campusInfo, setCampusInfo] = useState<CampusInfo>()
  useEffect(() => {
    getCampusInfo(campus).then(campusInfo => setCampusInfo(campusInfo))
  }, [campus])

  const [collections, setCollections] = useState<Collection[]>([])
  useEffect(() => {
    getCollections(campus).then(collections => setCollections(collections))
  }, [campus])

  const [visited, setVisited] = useState<Visited[]>([])
  useEffect(() => {
    if (user) {
      getUserVisited(user.uid, campus).then(visited => setVisited(visited))
    } else {
      setVisited([])
    }
  }, [user, campus])

  const updateVisited = (id: string, checked: boolean) => {
    const newVisited = checked
      ? [...visited, { id, timestamp: new Date() }]
      : visited.filter(visit => visit.id !== id)
    setVisited(newVisited)
    if (user) {
      setUserVisited(user.uid, campus, newVisited)
    }
  }

  const collectionProgress = (collection: Collection) =>
    (collection.members.filter(id => visited.some(visit => visit.id === id))
      .length /
      collection.members.length) *
    100

  const locationScore = visited.length * 10
  const collectionScore = collections
    .filter(collection => collectionProgress(collection) === 100)
    .map(collection => collection.score)
    .reduce((a, b) => a + b, 0)
  const totalScore = locationScore + collectionScore

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Routes>
          <Route
            path="profile"
            element={
              <Profile campus={campus} user={user} totalScore={totalScore} />
            }
          />
          <Route
            path="/"
            element={
              <MapView
                campus={campus}
                user={user}
                totalScore={totalScore}
                campusInfo={campusInfo}
                collections={collections}
                visited={visited}
                collectionProgress={collectionProgress}
                updateVisited={updateVisited}
              />
            }
          />
        </Routes>
      </ThemeProvider>
    </div>
  )
}

export default App
