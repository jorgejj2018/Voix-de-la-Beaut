import { auth } from './firebase'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export async function apiFetch(path, { method = 'GET', body, auth: requireAuth = false } = {}) {
  if (!API_BASE_URL) {
    throw new ApiError(0, 'VITE_API_BASE_URL no está configurada.')
  }

  const headers = { 'Content-Type': 'application/json' }

  if (requireAuth) {
    const token = await auth.currentUser?.getIdToken()
    if (!token) throw new ApiError(401, 'No hay sesión activa.')
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new ApiError(response.status, data?.error ?? 'Error al comunicarse con la API.')
  }

  return data
}
