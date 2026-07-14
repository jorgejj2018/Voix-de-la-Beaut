import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getArticleById } from '../../services/articlesService'
import AdminLayout from '../../components/layout/AdminLayout'
import ArticleForm from '../../components/articles/ArticleForm'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

export default function EditArticlePage() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getArticleById(id)
      .then(setArticle)
      .finally(() => setLoading(false))
  }, [id])

  return (
    <AdminLayout>
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 font-display text-2xl font-bold text-[#1A1A1B]">Editar artículo</h1>
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : !article ? (
          <EmptyState title="Artículo no encontrado" />
        ) : (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <ArticleForm article={article} />
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
