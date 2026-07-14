import { useMemo } from 'react'
import { FileText, Users, BookOpen, Archive } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import StatsCard from '../../components/admin/StatsCard'
import { useArticles } from '../../hooks/useArticles'
import { useUsers } from '../../hooks/useUsers'
import { getAllArticlesQuery } from '../../services/articlesService'
import Spinner from '../../components/ui/Spinner'

const allArticlesQuery = getAllArticlesQuery()

export default function SuperAdminDashboardPage() {
  const { articles, loading: loadingArticles } = useArticles(allArticlesQuery)
  const { users, loading: loadingUsers } = useUsers()

  const stats = useMemo(() => ({
    totalUsers: users.length,
    totalArticles: articles.length,
    published: articles.filter((a) => a.status === 'published').length,
    archived: articles.filter((a) => a.status === 'archived').length,
  }), [articles, users])

  return (
    <AdminLayout>
      <h1 className="mb-8 font-display text-2xl font-bold text-[#1A1A1B]">
        Super Admin — Dashboard
      </h1>

      {loadingArticles || loadingUsers ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard label="Usuarios totales" value={stats.totalUsers} icon={Users} color="black" />
          <StatsCard label="Artículos totales" value={stats.totalArticles} icon={FileText} color="gold" />
          <StatsCard label="Publicados" value={stats.published} icon={BookOpen} color="green" />
          <StatsCard label="Archivados" value={stats.archived} icon={Archive} color="black" />
        </div>
      )}
    </AdminLayout>
  )
}
