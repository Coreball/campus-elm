import React from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { MapView } from './MapView'

const theme = createTheme({
  palette: {
    primary: {
      main: '#fff',
    },
  },
})

const App = () => {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <MapView />
      </ThemeProvider>
    </div>
  )
}

export default App
