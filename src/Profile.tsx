import React from 'react'
import { Avatar, Box, Container, Typography } from '@mui/material'
import { User } from 'firebase/auth'
import { Navigation } from './Navigation'

interface ProfileProps {
  campus: string
  user: User | null
  totalScore: number
}

export const Profile = ({ campus, user, totalScore }: ProfileProps) => {
  return (
    <Box>
      <Navigation campus={campus} user={user} />
      <Container sx={{ display: 'flex', flexDirection: 'column', mt: 2 }}>
        {user ? (
          <>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                alignSelf: { xs: 'center', sm: 'auto' },
              }}
            >
              <Avatar
                alt={user.displayName ?? 'Unknown'}
                src={user.photoURL ?? undefined}
                sx={{ width: 96, height: 96 }}
              />
              <Box>
                <Typography variant="h6" component="h2">
                  {user.displayName ?? 'Unknown'}
                </Typography>
                <Typography>
                  <strong>{totalScore}</strong> Score
                </Typography>
                {user.metadata.creationTime && (
                  <Typography>
                    User since{' '}
                    {new Date(user.metadata.creationTime).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            </Box>
          </>
        ) : (
          <Typography>Sign in to access your profile.</Typography>
        )}
      </Container>
    </Box>
  )
}
