import React from 'react'
import { User } from 'firebase/auth'

interface ProfileProps {
  user: User | null
}

export const Profile = ({ user }: ProfileProps) => {
  return <p>User name: {user?.displayName}</p>
}
