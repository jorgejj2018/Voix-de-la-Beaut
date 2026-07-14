import { useState, useMemo } from 'react'
import { Heart, Bookmark, EyeOff } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import ArticleCard from '../../components/articles/ArticleCard'
import EmptyState from '../../components/ui/EmptyState'
import Spinner from '../../components/ui/Spinner'
import { useArticles } from '../../hooks/useArticles'
import { useFavorites } from '../../hooks/useFavorites'
import { useAuth } from '../../context/AuthContext'
import { getPublishedArticlesQuery } from '../../services/articlesService'

const publishedQuery = getPublishedArticlesQuery()

const TABS = [
  { id: 'favoritos', label: 'Favoritos', icon: Bookmark },
  { id: 'megusta', label: 'Me gusta', icon: Heart },
]

function UnavailableCard() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
      <EyeOff size={22} className="mb-2 text-neutral-300" />
      <p className="text-sm font-medium text-neutral-400">Artículo no disponible</p>
      <p className="mt-1 text-xs text-neutral-300">El autor ha despublicado este contenido</p>
    </div>
  )
}

export default function EscritorioPage() {
  const { currentUser } = useAuth()
  const favoriteIds = useFavorites()
  const [activeTab, setActiveTab] = useState('favoritos')
  const { articles, loading } = useArticles(publishedQuery)

  const favorites = useMemo(
    () => articles.filter((a) => favoriteIds.includes(a.id)),
    [articles, favoriteIds]
  )

  const liked = useMemo(
    () => articles.filter((a) => a.likedBy?.includes(currentUser?.uid)),
    [articles, currentUser?.uid]
  )

  const displayed = activeTab === 'favoritos' ? favorites : liked

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-[#1A1A1B]">Escritorio</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Tus artículos guardados y los que te han gustado
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-black/10">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === id
                ? 'border-b-2 border-[#1A1A1B] text-[#1A1A1B]'
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <Icon size={15} />
            {label}
            <span className={`rounded-full px-1.5 py-0.5 text-xs ${
              activeTab === id
                ? 'bg-[#1A1A1B] text-white'
                : 'bg-neutral-100 text-neutral-500'
            }`}>
              {id === 'favoritos' ? favorites.length : liked.length}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : activeTab === 'favoritos' ? (
        favoriteIds.length === 0 ? (
          <EmptyState
            title="Sin favoritos aún"
            description="Guarda artículos con el ícono de marcador mientras lees."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteIds.map((favId) => {
              const article = articles.find((a) => a.id === favId)
              return article
                ? <ArticleCard key={favId} article={article} />
                : <UnavailableCard key={favId} />
            })}
          </div>
        )
      ) : liked.length === 0 ? (
        <EmptyState
          title="Sin me gusta aún"
          description="Dale me gusta a artículos que encuentres interesantes."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {liked.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
