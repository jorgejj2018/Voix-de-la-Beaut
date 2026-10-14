import { FieldValue } from 'firebase-admin/firestore'
import { db } from '../config/firebaseAdmin'
import { Role, User } from '../models/User'

export class UsersApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export async function listUsers(): Promise<User[]> {
  const snap = await db.collection('users').orderBy('createdAt', 'desc').get()
  return snap.docs.map((d) => ({ ...(d.data() as User), uid: d.id }))
}

export async function updateUserRole(uid: string, role: Role): Promise<void> {
  if (!Object.values(Role).includes(role)) {
    throw new UsersApiError(400, 'Rol inválido.')
  }

  const ref = db.collection('users').doc(uid)
  const snap = await ref.get()
  if (!snap.exists) throw new UsersApiError(404, 'Usuario no encontrado.')

  await ref.update({ role, updatedAt: FieldValue.serverTimestamp() })
}

const VALID_STATUSES = ['active', 'suspended', 'blocked']

export async function setUserStatus(uid: string, status: string, requester: User): Promise<void> {
  if (!VALID_STATUSES.includes(status)) {
    throw new UsersApiError(400, 'Estado inválido.')
  }

  const ref = db.collection('users').doc(uid)
  const snap = await ref.get()
  if (!snap.exists) throw new UsersApiError(404, 'Usuario no encontrado.')

  const target = snap.data() as User
  const isPrivileged = requester.role === Role.ADMIN || requester.role === Role.SUPERADMIN
  const isOwnCollaborator = requester.role === Role.EMPRESA && target.companyId === requester.uid

  if (!isPrivileged && !isOwnCollaborator) {
    throw new UsersApiError(403, 'No tienes permisos para modificar a este usuario.')
  }

  await ref.update({ status, updatedAt: FieldValue.serverTimestamp() })
}

async function archiveUserArticles(uid: string): Promise<void> {
  const snap = await db.collection('articles').where('authorId', '==', uid).get()
  if (snap.empty) return

  const batch = db.batch()
  snap.docs.forEach((articleDoc) => {
    batch.update(articleDoc.ref, { status: 'archived', updatedAt: FieldValue.serverTimestamp() })
  })
  await batch.commit()
}

export async function deleteUser(uid: string): Promise<void> {
  const ref = db.collection('users').doc(uid)
  const snap = await ref.get()
  if (!snap.exists) throw new UsersApiError(404, 'Usuario no encontrado.')

  await archiveUserArticles(uid)
  await ref.update({ deleted: true, updatedAt: FieldValue.serverTimestamp() })
}
