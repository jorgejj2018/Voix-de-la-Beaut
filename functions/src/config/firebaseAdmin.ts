import { initializeApp, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const FIRESTORE_DATABASE_ID = 'voix'

const app = getApps().length ? getApps()[0] : initializeApp()

export const auth = getAuth(app)
export const db = getFirestore(app, FIRESTORE_DATABASE_ID)
