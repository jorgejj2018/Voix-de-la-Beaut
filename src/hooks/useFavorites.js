import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext'

export function useFavorites() {
  const { userProfile } = useAuth()
  return useMemo(() => userProfile?.favoriteIds ?? [], [userProfile?.favoriteIds])
}
