import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, Bookmark } from 'lucide-react'
import PageLayout from '../../components/layout/PageLayout'
import ArticleDetailHero from '../../components/articles/ArticleDetailHero'
import ArticleContent from '../../components/articles/ArticleContent'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { getArticleById } from '../../services/articlesService'
import { toggleLike, toggleFavorite } from '../../services/likesService'
import { useAuth } from '../../context/AuthContext'
import { useFavorites } from '../../hooks/useFavorites'

export default function ArticleDetailPage() {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const favoriteIds = useFavorites()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    getArticleById(id)
      .then(setArticle)
      .finally(() => setLoading(false))
  }, [id])

  const isLiked = article?.likedBy?.includes(currentUser?.uid) ?? false
  const isFavorited = favoriteIds.includes(id)
  const likeCount = article?.likedBy?.length ?? 0

  async function handleLike() {
    if (!currentUser || !article || actionLoading) return
    setActionLoading(true)
    try {
      await toggleLike(article.id, currentUser.uid, isLiked)
      setArticle((prev) => ({
        ...prev,
        likedBy: isLiked
          ? (prev.likedBy ?? []).filter((u) => u !== currentUser.uid)
          : [...(prev.likedBy ?? []), currentUser.uid],
      }))
    } finally {
      setActionLoading(false)
    }
  }

  async function handleFavorite() {
    if (!currentUser || actionLoading) return
    setActionLoading(true)
    try {
      await toggleFavorite(currentUser.uid, id, isFavorited)
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-3xl px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : !article ? (
          <EmptyState
            title="Artículo no encontrado"
            description="El artículo que buscas no existe o ha sido eliminado."
            action={
              <Link to="/" className="text-sm font-medium text-[#1A1A1B] underline underline-offset-2">
                Volver al inicio
              </Link>
            }
          />
        ) : (
          <>
            <ArticleDetailHero article={article} />
            <ArticleContent content={article.content} />

            {/* Acciones: Like y Favorito */}
            <div className="mt-10 flex items-center gap-6 border-t border-black/10 pt-6">
              <button
                onClick={handleLike}
                disabled={!currentUser || actionLoading}
                title={currentUser ? (isLiked ? 'Quitar like' : 'Me gusta') : 'Inicia sesión para dar like'}
                className={`flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-40 ${
                  isLiked ? 'text-red-500' : 'text-neutral-400 hover:text-red-400'
                }`}
              >
                <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                <span>{likeCount} {likeCount === 1 ? 'me gusta' : 'me gusta'}</span>
              </button>

              <button
                onClick={handleFavorite}
                disabled={!currentUser || actionLoading}
                title={currentUser ? (isFavorited ? 'Quitar de favoritos' : 'Guardar en favoritos') : 'Inicia sesión para guardar'}
                className={`flex items-center gap-2 text-sm font-medium transition-colors disabled:opacity-40 ${
                  isFavorited ? 'text-[#D4AF37]' : 'text-neutral-400 hover:text-[#D4AF37]'
                }`}
              >
                <Bookmark size={18} fill={isFavorited ? 'currentColor' : 'none'} />
                <span>{isFavorited ? 'Guardado' : 'Guardar'}</span>
              </button>

              {!currentUser && (
                <Link to="/login" className="ml-auto text-xs text-neutral-400 underline hover:text-[#1A1A1B]">
                  Inicia sesión para interactuar
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  )
}
