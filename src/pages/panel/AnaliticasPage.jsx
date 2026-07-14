import { useMemo } from 'react'
import { Heart, Bookmark, FileText, BookOpen, TrendingUp } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import StatsCard from '../../components/admin/StatsCard'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { useArticles } from '../../hooks/useArticles'
import { useAuth } from '../../context/AuthContext'
import { getArticlesByAuthorQuery } from '../../services/articlesService'
import { formatDate } from '../../utils/formatDate'

export default function AnaliticasPage() {
  const { userProfile } = useAuth()
  const articlesQuery = useMemo(
    () => (userProfile?.uid ? getArticlesByAuthorQuery(userProfile.uid) : null),
    [userProfile?.uid]
  )
  const { articles, loading } = useArticles(articlesQuery)

  const totalLikes = useMemo(
    () => articles.reduce((sum, a) => sum + (a.likedBy?.length ?? 0), 0),
    [articles]
  )
  const totalSaves = useMemo(
    () => articles.reduce((sum, a) => sum + (a.savedBy?.length ?? 0), 0),
    [articles]
  )
  const published = articles.filter((a) => a.status === 'published').length

  const sorted = useMemo(
    () =>
      [...articles].sort(
        (a, b) =>
          (b.likedBy?.length ?? 0) + (b.savedBy?.length ?? 0) -
          ((a.likedBy?.length ?? 0) + (a.savedBy?.length ?? 0))
      ),
    [articles]
  )

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-[#1A1A1B]">Analíticas</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Rendimiento de tus publicaciones
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <>
          {/* Tarjetas resumen */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatsCard label="Publicaciones" value={articles.length} icon={FileText} color="black" />
            <StatsCard label="Publicadas" value={published} icon={BookOpen} color="green" />
            <StatsCard label="Total me gusta" value={totalLikes} icon={Heart} color="gold" />
            <StatsCard label="Total guardados" value={totalSaves} icon={Bookmark} color="black" />
          </div>

          {/* Tabla de rendimiento por artículo */}
          {sorted.length === 0 ? (
            <EmptyState
              title="Sin publicaciones aún"
              description="Crea tu primer artículo para ver las analíticas aquí."
            />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-black/10 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/10 bg-neutral-50 text-left">
                    <th className="px-4 py-3 font-medium text-neutral-600">Artículo</th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Estado</th>
                    <th className="px-4 py-3 text-center font-medium text-neutral-600">
                      <span className="flex items-center justify-center gap-1">
                        <Heart size={13} className="text-red-400" /> Me gusta
                      </span>
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-neutral-600">
                      <span className="flex items-center justify-center gap-1">
                        <Bookmark size={13} className="text-[#D4AF37]" /> Guardados
                      </span>
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-neutral-600">
                      <span className="flex items-center justify-center gap-1">
                        <TrendingUp size={13} /> Total
                      </span>
                    </th>
                    <th className="px-4 py-3 font-medium text-neutral-600">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((article) => {
                    const likes = article.likedBy?.length ?? 0
                    const saves = article.savedBy?.length ?? 0
                    return (
                      <tr key={article.id} className="border-b border-black/5 hover:bg-neutral-50">
                        <td className="px-4 py-3">
                          <p className="max-w-xs truncate font-medium text-[#1A1A1B]">
                            {article.title}
                          </p>
                          <p className="text-xs text-neutral-400">{article.category}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge value={article.status} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-semibold ${likes > 0 ? 'text-red-500' : 'text-neutral-300'}`}>
                            {likes}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-semibold ${saves > 0 ? 'text-[#D4AF37]' : 'text-neutral-300'}`}>
                            {saves}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-bold text-[#1A1A1B]">{likes + saves}</span>
                        </td>
                        <td className="px-4 py-3 text-neutral-400">
                          {formatDate(article.createdAt)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  )
}
