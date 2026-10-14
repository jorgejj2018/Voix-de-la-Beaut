import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import ArticleCard from '../../components/articles/ArticleCard'
import CategoryFilter from '../../components/articles/CategoryFilter'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { useArticles } from '../../hooks/useArticles'
import { getPublishedArticlesQuery } from '../../services/articlesService'

const publishedQuery = getPublishedArticlesQuery()

export default function ExplorarPage() {
  const { articles, loading } = useArticles(publishedQuery)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchText, setSearchText] = useState('')

  const sorted = useMemo(
    () =>
      [...articles].sort((a, b) => {
        const aLikes = a.likedBy?.length ?? 0
        const bLikes = b.likedBy?.length ?? 0
        const aSaves = a.savedBy?.length ?? 0
        const bSaves = b.savedBy?.length ?? 0
        const aDate = a.publishedAt?.toDate?.() ?? new Date(0)
        const bDate = b.publishedAt?.toDate?.() ?? new Date(0)

        const aScore = aLikes * 3 + aSaves * 2
        const bScore = bLikes * 3 + bSaves * 2

        return bScore - aScore || bDate - aDate
      }),
    [articles]
  )

  const filtered = useMemo(() => {
    let result = sorted

    if (selectedCategory) {
      result = result.filter((article) => article.category === selectedCategory)
    }

    if (searchText.trim()) {
      const query = searchText.toLowerCase()
      result = result.filter((article) => {
        const haystack = [
          article.title,
          article.excerpt,
          article.authorName,
          article.category,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return haystack.includes(query)
      })
    }

    return result
  }, [sorted, selectedCategory, searchText])

  return (
    <AdminLayout>
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
          Descubre
        </p>
        <h1 className="font-display text-3xl font-bold text-[#1A1A1B] md:text-4xl">
          Explorar
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Encuentra contenido relevante, nuevo y recomendado para tu lectura.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-black/10 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Search size={18} className="text-neutral-400" />
          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Buscar artículos, autores o temas"
            className="w-full border-0 bg-transparent text-sm text-[#1A1A1B] placeholder:text-neutral-400 focus:outline-none"
          />
        </div>
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
          title="Sin resultados"
          description="Prueba otro término de búsqueda o cambia la categoría para seguir descubriendo contenido."
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
