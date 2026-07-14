import { useEffect, useState } from 'react'
import { onSnapshot } from 'firebase/firestore'

const FIRESTORE_TIMEOUT_MS = 8000

/**
 * Subscribes to a Firestore query with real-time updates.
 * The `query` argument must be a stable reference (module-level constant or useMemo).
 */
export function useArticles(query) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(!!query)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query) {
      setArticles([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const timeout = setTimeout(() => {
      setLoading(false)
      setError(
        'No se pudo conectar con Firestore. Verifica que la base de datos esté creada en Firebase Console y que las reglas permitan la lectura.'
      )
    }, FIRESTORE_TIMEOUT_MS)

    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        clearTimeout(timeout)
        setArticles(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => {
        clearTimeout(timeout)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => {
      clearTimeout(timeout)
      unsubscribe()
    }
  }, [query])

  return { articles, loading, error }
}
