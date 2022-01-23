import React from 'react'
import { Box, Button, Toolbar, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { User } from 'firebase/auth'
import { signInWithGooglePopup, signOutUser } from './firebase'

interface NavigationProps {
  campus: string
  user: User | null
}

export const Navigation = ({ campus, user }: NavigationProps) => {
  return (
    <Toolbar>
      <Typography variant="h6" component="h1" sx={{ marginRight: 3 }}>
        Campus Elm
      </Typography>
      <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
        <Button component={Link} to="/">
          {campus}
        </Button>
        {user && (
          <Button component={Link} to="/profile">
            {user.displayName}
          </Button>
        )}
      </Box>
      {user ? (
        <Button onClick={signOutUser}>Sign Out</Button>
      ) : (
        <Button variant="outlined" onClick={signInWithGooglePopup}>
          Sign In
        </Button>
      )}
    </Toolbar>
  )
}
