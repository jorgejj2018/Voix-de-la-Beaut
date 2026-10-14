import { FieldValue } from 'firebase-admin/firestore'
import { db } from '../config/firebaseAdmin'
import { Article, ArticleStatus, CreateArticleInput, UpdateArticleInput } from '../models/Article'
import { User } from '../models/User'
import { slugify } from '../utils/slugify'
import { calculateReadTime } from '../utils/readTime'

const COLLECTION = 'articles'

export class ArticlesApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export async function listArticles(status?: ArticleStatus): Promise<Article[]> {
  let query: FirebaseFirestore.Query = db.collection(COLLECTION)
  if (status) query = query.where('status', '==', status)

  const snap = await query.get()
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Article) }))
}

export async function getArticleById(id: string): Promise<Article | null> {
  const snap = await db.collection(COLLECTION).doc(id).get()
  if (!snap.exists) return null
  return { id: snap.id, ...(snap.data() as Article) }
}

export async function createArticle(input: CreateArticleInput, author: User): Promise<Article> {
  if (!input.title || !input.content) {
    throw new ArticlesApiError(400, 'title y content son obligatorios.')
  }

  const slug = slugify(input.title)
  const readTime = calculateReadTime(input.content)

  const data = {
    title: input.title,
    content: input.content,
    excerpt: input.excerpt ?? null,
    category: input.category ?? null,
    slug,
    readTime,
    status: 'draft' as ArticleStatus,
    authorId: author.uid,
    authorName: author.displayName,
    authorPhotoURL: author.photoURL ?? null,
    featured: false,
    coverImage: input.coverImage ?? null,
    publishedAt: null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  }

  const ref = await db.collection(COLLECTION).add(data)
  return { id: ref.id, ...data }
}

async function assertOwnerOrPrivileged(articleId: string, requester: User): Promise<Article> {
  const snap = await db.collection(COLLECTION).doc(articleId).get()
  if (!snap.exists) throw new ArticlesApiError(404, 'Artículo no encontrado.')

  const article = { id: snap.id, ...(snap.data() as Article) }
  const privileged = ['admin', 'superadmin'].includes(requester.role)

  if (!privileged && article.authorId !== requester.uid) {
    throw new ArticlesApiError(403, 'No puedes modificar artículos de otro autor.')
  }

  return article
}

export async function updateArticle(id: string, input: UpdateArticleInput, requester: User): Promise<void> {
  await assertOwnerOrPrivileged(id, requester)

  const updates: Record<string, unknown> = { ...input, updatedAt: FieldValue.serverTimestamp() }
  if (input.title) updates.slug = slugify(input.title)
  if (input.content) updates.readTime = calculateReadTime(input.content)

  await db.collection(COLLECTION).doc(id).update(updates)
}

export async function updateArticleStatus(id: string, status: ArticleStatus, requester: User): Promise<void> {
  await assertOwnerOrPrivileged(id, requester)

  await db.collection(COLLECTION).doc(id).update({
    status,
    publishedAt: status === 'published' ? FieldValue.serverTimestamp() : null,
    updatedAt: FieldValue.serverTimestamp(),
  })
}

export async function deleteArticle(id: string, requester: User): Promise<void> {
  await assertOwnerOrPrivileged(id, requester)
  await db.collection(COLLECTION).doc(id).delete()
}
