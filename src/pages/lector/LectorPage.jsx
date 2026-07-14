import { useState, useMemo } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import ArticleCard from '../../components/articles/ArticleCard'
import CategoryFilter from '../../components/articles/CategoryFilter'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { useArticles } from '../../hooks/useArticles'
import { getPublishedArticlesQuery } from '../../services/articlesService'

const publishedQuery = getPublishedArticlesQuery()

export default function LectorPage() {
  const { articles, loading } = useArticles(publishedQuery)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const sorted = useMemo(
    () =>
      [...articles].sort((a, b) => {
        const aDate = a.publishedAt?.toDate?.() ?? new Date(0)
        const bDate = b.publishedAt?.toDate?.() ?? new Date(0)
        return bDate - aDate
      }),
    [articles]
  )

  const filtered = useMemo(
    () => (selectedCategory ? sorted.filter((a) => a.category === selectedCategory) : sorted),
    [sorted, selectedCategory]
  )

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-[#1A1A1B]">Mi feed</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Últimas publicaciones de la comunidad
        </p>
      </div>

      <div className="mb-6">
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Sin publicaciones"
          description="No hay artículos disponibles en esta categoría."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
