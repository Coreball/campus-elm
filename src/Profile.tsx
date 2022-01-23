import React from 'react'
import { User } from 'firebase/auth'

interface ProfileProps {
  campus: string
  user: User | null
}

export const Profile = ({ campus, user }: ProfileProps) => {
  return <p>User name: {user?.displayName}</p>
}
