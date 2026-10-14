import { auth, db } from '../config/firebaseAdmin'
import { LoginInput, RegisterInput, Role, User } from '../models/User'
import { FieldValue } from 'firebase-admin/firestore'

const SUPERADMIN_EMAIL = 'alejandrojj2018@gmail.com'
const IDENTITY_TOOLKIT_URL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword'

export class AuthApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

function resolveRole(email: string, accountType?: string): Role {
  if (email.toLowerCase() === SUPERADMIN_EMAIL) return Role.SUPERADMIN
  if (accountType === 'empresa') return Role.EMPRESA
  return Role.LECTOR
}

export async function registerUser(input: RegisterInput): Promise<User> {
  const { displayName, email, password, accountType, companyName } = input

  if (!displayName || !email || !password) {
    throw new AuthApiError(400, 'displayName, email y password son obligatorios.')
  }
  if (password.length < 6) {
    throw new AuthApiError(400, 'La contraseña debe tener al menos 6 caracteres.')
  }

  let userRecord
  try {
    userRecord = await auth.createUser({ email, password, displayName })
  } catch (error: any) {
    if (error?.code === 'auth/email-already-exists') {
      throw new AuthApiError(409, 'Ya existe una cuenta con ese correo.')
    }
    throw new AuthApiError(400, error?.message ?? 'No se pudo crear el usuario.')
  }

  const role = resolveRole(email, accountType)

  const profile: User = {
    uid: userRecord.uid,
    displayName,
    email,
    photoURL: null,
    role,
    companyName: role === Role.EMPRESA ? companyName || displayName : null,
    companyId: null,
    status: 'active',
    bio: null,
  }

  await db.collection('users').doc(userRecord.uid).set({
    ...profile,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  })

  return profile
}

export async function loginUser(input: LoginInput, webApiKey: string) {
  const { email, password } = input

  if (!email || !password) {
    throw new AuthApiError(400, 'email y password son obligatorios.')
  }

  const response = await fetch(`${IDENTITY_TOOLKIT_URL}?key=${webApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  })

  const data: any = await response.json()

  if (!response.ok) {
    throw new AuthApiError(401, data?.error?.message ?? 'Credenciales inválidas.')
  }

  const snap = await db.collection('users').doc(data.localId).get()
  const profile = snap.exists ? (snap.data() as User) : null

  if (profile?.status === 'suspended') {
    throw new AuthApiError(403, 'Esta cuenta está suspendida.')
  }

  return {
    idToken: data.idToken,
    refreshToken: data.refreshToken,
    expiresIn: data.expiresIn,
    uid: data.localId,
    profile,
  }
}
