import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, FileText, BookOpen, Archive, EyeOff, Bookmark } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import ArticleTable from '../../components/admin/ArticleTable'
import ArticleCard from '../../components/articles/ArticleCard'
import StatsCard from '../../components/admin/StatsCard'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { useArticles } from '../../hooks/useArticles'
import { useFavorites } from '../../hooks/useFavorites'
import { getArticlesByAuthorQuery, deleteArticle, updateArticleStatus, getPublishedArticlesQuery } from '../../services/articlesService'

const publishedArticlesQuery = getPublishedArticlesQuery()

function UnavailableCard() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
      <EyeOff size={22} className="mb-2 text-neutral-300" />
      <p className="text-sm font-medium text-neutral-400">Artículo no disponible</p>
      <p className="mt-1 text-xs text-neutral-300">El autor ha despublicado este contenido</p>
    </div>
  )
}

export default function PanelPage() {
  const { userProfile } = useAuth()
  const articlesQuery = useMemo(
    () => (userProfile?.uid ? getArticlesByAuthorQuery(userProfile.uid) : null),
    [userProfile?.uid]
  )
  const { articles, loading } = useArticles(articlesQuery)
  const favoriteIds = useFavorites()
  const { articles: allPublished, loading: loadingFavs } = useArticles(publishedArticlesQuery)
  const [articleToDelete, setArticleToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const stats = useMemo(() => ({
    total: articles.length,
    published: articles.filter((a) => a.status === 'published').length,
    drafts: articles.filter((a) => a.status === 'draft').length,
  }), [articles])

  async function handleStatusChange(id, status) {
    await updateArticleStatus(id, status)
  }

  async function handleConfirmDelete() {
    if (!articleToDelete) return
    setDeleting(true)
    try {
      await deleteArticle(articleToDelete.id)
    } finally {
      setDeleting(false)
      setArticleToDelete(null)
    }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-[#1A1A1B]">Mis artículos</h1>
        <Link to="/panel/nuevo">
          <Button size="sm">
            <Plus size={16} />
            Nuevo artículo
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <StatsCard label="Total" value={stats.total} icon={FileText} color="black" />
        <StatsCard label="Publicados" value={stats.published} icon={BookOpen} color="green" />
        <StatsCard label="Borradores" value={stats.drafts} icon={Archive} color="gold" />
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : articles.length === 0 ? (
          <EmptyState
            title="Aún no has escrito nada"
            description="Crea tu primer artículo y comparte tu visión editorial."
            action={
              <Link to="/panel/nuevo">
                <Button size="sm">Comenzar a escribir</Button>
              </Link>
            }
          />
        ) : (
          <ArticleTable
            articles={articles}
            onDelete={setArticleToDelete}
            showStatusActions
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      {articleToDelete && (
        <Modal
          title="Eliminar artículo"
          description={`¿Estás seguro de que quieres eliminar "${articleToDelete.title}"? Esta acción no se puede deshacer.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setArticleToDelete(null)}
          loading={deleting}
        />
      )}

      {/* Guardados */}
      <div className="mt-12 border-t border-black/8 pt-10">
        <div className="mb-5 flex items-center gap-2">
          <Bookmark size={18} className="text-[#D4AF37]" />
          <h2 className="font-display text-xl font-semibold text-[#1A1A1B]">
            Mis guardados
          </h2>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
            {favoriteIds.length}
          </span>
        </div>

        {loadingFavs ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : favoriteIds.length === 0 ? (
          <EmptyState
            title="Aún no has guardado artículos"
            description="Usa el ícono de marcador en cualquier artículo para guardarlo aquí."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteIds.map((favId) => {
              const article = allPublished.find((a) => a.id === favId)
              return article
                ? <ArticleCard key={favId} article={article} />
                : <UnavailableCard key={favId} />
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
