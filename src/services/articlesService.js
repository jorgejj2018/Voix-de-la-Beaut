import {
  collection,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import { apiFetch } from './apiClient'

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

export async function createArticle(data) {
  const { article } = await apiFetch('/articles', {
    method: 'POST',
    auth: true,
    body: data,
  })
  return article
}

export async function updateArticle(id, data) {
  return apiFetch(`/articles/${id}`, {
    method: 'PUT',
    auth: true,
    body: data,
  })
}

export async function updateArticleStatus(id, status) {
  return apiFetch(`/articles/${id}/status`, {
    method: 'PATCH',
    auth: true,
    body: { status },
  })
}

export async function deleteArticle(id) {
  return apiFetch(`/articles/${id}`, {
    method: 'DELETE',
    auth: true,
  })
}
