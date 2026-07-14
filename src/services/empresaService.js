import { initializeApp, getApps } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import { ROLES } from '../constants/roles'

const SECONDARY_APP_NAME = 'empresa-creator'

function getSecondaryAuth() {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }
  const existing = getApps().find((a) => a.name === SECONDARY_APP_NAME)
  const app = existing ?? initializeApp(config, SECONDARY_APP_NAME)
  return getAuth(app)
}

export async function createColaborador({ displayName, email, password, companyId, role = ROLES.LECTOR }) {
  const secondaryAuth = getSecondaryAuth()

  const { user } = await createUserWithEmailAndPassword(secondaryAuth, email, password)

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    displayName: displayName?.trim() || email.split('@')[0],
    email,
    photoURL: null,
    role,
    companyId,
    companyName: null,
    status: 'active',
    bio: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  await signOut(secondaryAuth)
  return user
}
