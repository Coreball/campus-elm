import React, { useEffect, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { onAuthStateChanged, signInAnonymously, User } from 'firebase/auth'
import { auth } from './firebase'
import { MapView } from './MapView'

const theme = createTheme({
  palette: {
    primary: {
      main: '#fff',
    },
  },
})

const App = () => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    signInAnonymously(auth).then(user => console.log('anon', user))
  }, [])
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      setUser(user)
      console.log('auth change', user)
    })
  }, [])

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <MapView user={user} />
      </ThemeProvider>
    </div>
  )
}

export default App
