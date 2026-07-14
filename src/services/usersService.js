import {
  collection,
  doc,
  updateDoc,
  query,
  orderBy,
  where,
  getDocs,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

const COLLECTION = 'users'

export function getAllUsersQuery() {
  return query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
}

export async function updateUserRole(uid, role) {
  return updateDoc(doc(db, COLLECTION, uid), {
    role,
    updatedAt: serverTimestamp(),
  })
}

export async function setUserStatus(uid, status) {
  return updateDoc(doc(db, COLLECTION, uid), {
    status,
    updatedAt: serverTimestamp(),
  })
}

async function archiveUserArticles(uid) {
  const q = query(collection(db, 'articles'), where('authorId', '==', uid))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return

  const batch = writeBatch(db)
  snapshot.docs.forEach((articleDoc) => {
    batch.update(articleDoc.ref, { status: 'archived', updatedAt: serverTimestamp() })
  })
  return batch.commit()
}

export async function deleteUser(uid) {
  await archiveUserArticles(uid)
  return updateDoc(doc(db, COLLECTION, uid), {
    deleted: true,
    updatedAt: serverTimestamp(),
  })
}
