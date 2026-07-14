import { useEffect, useState, useMemo } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../services/firebase'

export function useColaboradores(companyId) {
  const [colaboradores, setColaboradores] = useState([])
  const [loading, setLoading] = useState(!!companyId)
  const [error, setError] = useState(null)

  const q = useMemo(
    () =>
      companyId
        ? query(collection(db, 'users'), where('companyId', '==', companyId))
        : null,
    [companyId]
  )

  useEffect(() => {
    if (!q) {
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setColaboradores(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )
    return unsubscribe
  }, [q])

  return { colaboradores, loading, error }
}
