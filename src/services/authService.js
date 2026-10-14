import {
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'
import { ROLES } from '../constants/roles'
import { apiFetch } from './apiClient'

const googleProvider = new GoogleAuthProvider()

const SUPERADMIN_EMAIL = 'alejandrojj2018@gmail.com'

function resolveRole(email) {
  return email?.toLowerCase() === SUPERADMIN_EMAIL ? ROLES.SUPERADMIN : ROLES.LECTOR
}

export async function register(displayName, email, password, accountType = 'independiente', companyName = null) {
  await apiFetch('/auth/register', {
    method: 'POST',
    body: { displayName, email, password, accountType, companyName },
  })

  await setPersistence(auth, browserLocalPersistence)
  return signInWithEmailAndPassword(auth, email, password)
}

export async function login(email, password) {
  await apiFetch('/auth/login', {
    method: 'POST',
    body: { email, password },
  })

  await setPersistence(auth, browserLocalPersistence)
  return signInWithEmailAndPassword(auth, email, password)
}

export async function logout() {
  return signOut(auth)
}

export async function loginWithGoogle() {
  await setPersistence(auth, browserLocalPersistence)
  const { user } = await signInWithPopup(auth, googleProvider)

  const userDocRef = doc(db, 'users', user.uid)
  const userSnap = await getDoc(userDocRef)

  if (!userSnap.exists()) {
    await setDoc(userDocRef, {
      uid: user.uid,
      displayName: user.displayName ?? 'Usuario',
      email: user.email,
      photoURL: user.photoURL ?? null,
      role: resolveRole(user.email),
      companyName: null,
      companyId: null,
      status: 'active',
      bio: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }
}

export async function updateUserProfile(uid, data) {
  return updateDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}
