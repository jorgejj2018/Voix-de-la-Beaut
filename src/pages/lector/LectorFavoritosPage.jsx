import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import ArticleCard from '../../components/articles/ArticleCard'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { useArticles } from '../../hooks/useArticles'
import { useFavorites } from '../../hooks/useFavorites'
import { getPublishedArticlesQuery } from '../../services/articlesService'

const publishedQuery = getPublishedArticlesQuery()

export default function LectorFavoritosPage() {
  const { articles, loading } = useArticles(publishedQuery)
  const favoriteIds = useFavorites()

  const favorites = useMemo(
    () => articles.filter((a) => favoriteIds.includes(a.id)),
    [articles, favoriteIds]
  )

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-[#1A1A1B]">Mis favoritos</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {favorites.length} {favorites.length === 1 ? 'artículo guardado' : 'artículos guardados'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : favorites.length === 0 ? (
        <EmptyState
          title="Sin favoritos aún"
          description="Explora artículos y guarda los que más te gusten con el ícono de marcador."
          action={
            <Link
              to="/lector"
              className="text-sm font-medium text-[#1A1A1B] underline underline-offset-2"
            >
              Explorar publicaciones
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
