import React from 'react'
import { Avatar, Box, Container, Typography } from '@mui/material'
import { User } from 'firebase/auth'
import { Collection } from './Collection'
import { Location } from './Location'
import { Visited } from './Visited'
import { Navigation } from './Navigation'

interface HistoryElement {
  score: number
  description: string
  timestamp: Date
}

interface ProfileProps {
  campus: string
  user: User | null
  totalScore: number
  locations: Location[]
  collections: Collection[]
  visited: Visited[]
  collectionProgress: (collection: Collection) => number
}

export const Profile = ({
  campus,
  user,
  totalScore,
  locations,
  collections,
  visited,
  collectionProgress,
}: ProfileProps) => {
  const collectionHistory: HistoryElement[] = collections
    .filter(collection => collectionProgress(collection) === 100)
    .map(collection => {
      const latestVisitedTimestamp = collection.members
        .map(id => visited.find(visit => visit.id === id)!.timestamp)
        .reduce((a, b) => (a > b ? a : b))
      return {
        score: collection.score,
        description: `Completed ${collection.name}`,
        timestamp: latestVisitedTimestamp,
      }
    })

  const visitedHistory: HistoryElement[] = visited.map(visit => {
    const location =
      locations.find(location => location.id === visit.id) ??
      locations
        .flatMap(location => location.sublocations ?? [])
        .find(sublocation => sublocation.id === visit.id)
    return {
      score: 10,
      description: `Visited ${location?.name ?? 'Unknown location'}`,
      timestamp: visit.timestamp,
    }
  })

  const history = [...collectionHistory, ...visitedHistory].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  )

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
            {history.map(historyElement => (
              <Box>
                {historyElement.score} {historyElement.description}{' '}
                {historyElement.timestamp.toLocaleDateString()}
              </Box>
            ))}
          </>
        ) : (
          <Typography>Sign in to access your profile.</Typography>
        )}
      </Container>
    </Box>
  )
}
