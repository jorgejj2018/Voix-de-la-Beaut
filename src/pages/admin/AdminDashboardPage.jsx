import { useMemo } from 'react'
import { FileText, BookOpen, Archive } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import StatsCard from '../../components/admin/StatsCard'
import { useArticles } from '../../hooks/useArticles'
import { getAllArticlesQuery } from '../../services/articlesService'
import Spinner from '../../components/ui/Spinner'

const allArticlesQuery = getAllArticlesQuery()

export default function AdminDashboardPage() {
  const { articles, loading } = useArticles(allArticlesQuery)

  const stats = useMemo(() => ({
    total: articles.length,
    published: articles.filter((a) => a.status === 'published').length,
    drafts: articles.filter((a) => a.status === 'draft').length,
  }), [articles])

  return (
    <AdminLayout>
      <h1 className="mb-8 font-display text-2xl font-bold text-[#1A1A1B]">Dashboard</h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatsCard label="Total artículos" value={stats.total} icon={FileText} color="black" />
          <StatsCard label="Publicados" value={stats.published} icon={BookOpen} color="green" />
          <StatsCard label="Borradores" value={stats.drafts} icon={Archive} color="gold" />
        </div>
      )}
    </AdminLayout>
  )
}
