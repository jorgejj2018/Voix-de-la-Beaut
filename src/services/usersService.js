import { collection, query, orderBy } from 'firebase/firestore'
import { db } from './firebase'
import { apiFetch } from './apiClient'

const COLLECTION = 'users'

export function getAllUsersQuery() {
  return query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
}

export async function updateUserRole(uid, role) {
  return apiFetch(`/users/${uid}/role`, {
    method: 'PATCH',
    auth: true,
    body: { role },
  })
}

export async function setUserStatus(uid, status) {
  return apiFetch(`/users/${uid}/status`, {
    method: 'PATCH',
    auth: true,
    body: { status },
  })
}

export async function deleteUser(uid) {
  return apiFetch(`/users/${uid}`, {
    method: 'DELETE',
    auth: true,
  })
}
