import AdminLayout from '../../components/layout/AdminLayout'
import ArticleForm from '../../components/articles/ArticleForm'

export default function NewArticlePage() {
  return (
    <AdminLayout>
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 font-display text-2xl font-bold text-[#1A1A1B]">Nuevo artículo</h1>
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <ArticleForm />
        </div>
      </div>
    </AdminLayout>
  )
}
