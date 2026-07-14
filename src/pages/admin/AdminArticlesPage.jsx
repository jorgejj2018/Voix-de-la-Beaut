import AdminLayout from '../../components/layout/AdminLayout'
import ArticleTable from '../../components/admin/ArticleTable'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'
import { useArticles } from '../../hooks/useArticles'
import { getAllArticlesQuery, updateArticleStatus } from '../../services/articlesService'

const allArticlesQuery = getAllArticlesQuery()

export default function AdminArticlesPage() {
  const { articles, loading } = useArticles(allArticlesQuery)

  async function handleStatusChange(id, status) {
    await updateArticleStatus(id, status)
  }

  return (
    <AdminLayout>
      <h1 className="mb-8 font-display text-2xl font-bold text-[#1A1A1B]">
        Gestión de artículos
      </h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : articles.length === 0 ? (
        <EmptyState
          title="No hay artículos"
          description="Aún no se han creado artículos en la plataforma."
        />
      ) : (
        <ArticleTable
          articles={articles}
          showAuthor
          showStatusActions
          onStatusChange={handleStatusChange}
        />
      )}
    </AdminLayout>
  )
}
