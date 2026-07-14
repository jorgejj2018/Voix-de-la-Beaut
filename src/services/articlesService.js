import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'
import { slugify } from '../utils/slugify'
import { calculateReadTime } from '../utils/readTime'

const COLLECTION = 'articles'

export function getPublishedArticlesQuery() {
  return query(
    collection(db, COLLECTION),
    where('status', '==', 'published')
  )
}

export function getArticlesByAuthorQuery(authorId) {
  return query(
    collection(db, COLLECTION),
    where('authorId', '==', authorId)
  )
}

export function getAllArticlesQuery() {
  return query(collection(db, COLLECTION), orderBy('createdAt', 'desc'))
}

export async function getArticleById(id) {
  const snap = await getDoc(doc(db, COLLECTION, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function getArticleBySlug(slug) {
  const q = query(collection(db, COLLECTION), where('slug', '==', slug))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() }
}

export async function createArticle(data, authorProfile) {
  const slug = slugify(data.title)
  const readTime = calculateReadTime(data.content)

  return addDoc(collection(db, COLLECTION), {
    ...data,
    slug,
    readTime,
    status: 'draft',
    authorId: authorProfile.uid,
    authorName: authorProfile.displayName,
    authorPhotoURL: authorProfile.photoURL ?? null,
    featured: false,
    coverImage: null,
    publishedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateArticle(id, data) {
  const updates = { ...data, updatedAt: serverTimestamp() }
  if (data.title) updates.slug = slugify(data.title)
  if (data.content) updates.readTime = calculateReadTime(data.content)
  return updateDoc(doc(db, COLLECTION, id), updates)
}

export async function updateArticleStatus(id, status) {
  return updateDoc(doc(db, COLLECTION, id), {
    status,
    publishedAt: status === 'published' ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteArticle(id) {
  return deleteDoc(doc(db, COLLECTION, id))
}
