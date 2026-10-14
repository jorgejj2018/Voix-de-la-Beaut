export type ArticleStatus = 'draft' | 'published' | 'archived'

export interface Article {
  id?: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  category?: string | null
  readTime: number
  status: ArticleStatus
  authorId: string
  authorName: string
  authorPhotoURL: string | null
  featured: boolean
  coverImage: string | null
  likedBy?: string[]
  savedBy?: string[]
  publishedAt: unknown
  createdAt?: unknown
  updatedAt?: unknown
}

export interface CreateArticleInput {
  title: string
  content: string
  excerpt?: string
  category?: string
  coverImage?: string
}

export interface UpdateArticleInput {
  title?: string
  content?: string
  excerpt?: string
  category?: string
  coverImage?: string
}
