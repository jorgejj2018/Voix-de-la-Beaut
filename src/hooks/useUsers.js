import { useEffect, useState } from 'react'
import { onSnapshot } from 'firebase/firestore'
import { getAllUsersQuery } from '../services/usersService'

export function useUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      getAllUsersQuery(),
      (snapshot) => {
        setUsers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    return unsubscribe
  }, [])

  return { users, loading, error }
}
