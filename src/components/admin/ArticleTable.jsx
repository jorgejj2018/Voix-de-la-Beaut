import { Link } from 'react-router-dom'
import { Pencil, Trash2, Eye } from 'lucide-react'
import Badge from '../ui/Badge'
import { formatDate } from '../../utils/formatDate'

export default function ArticleTable({
  articles,
  onDelete,
  onStatusChange,
  showAuthor = false,
  showStatusActions = false,
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-black/10 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-black/10 bg-neutral-50 text-left">
            <th className="px-4 py-3 font-medium text-neutral-600">Título</th>
            <th className="px-4 py-3 font-medium text-neutral-600">Categoría</th>
            {showAuthor && (
              <th className="px-4 py-3 font-medium text-neutral-600">Autor</th>
            )}
            <th className="px-4 py-3 font-medium text-neutral-600">Estado</th>
            <th className="px-4 py-3 font-medium text-neutral-600">Fecha</th>
            <th className="px-4 py-3 text-right font-medium text-neutral-600">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id} className="border-b border-black/5 hover:bg-neutral-50">
              <td className="px-4 py-3">
                <p className="max-w-xs truncate font-medium text-[#1A1A1B]">{article.title}</p>
              </td>
              <td className="px-4 py-3 text-neutral-500">{article.category}</td>
              {showAuthor && (
                <td className="px-4 py-3 text-neutral-500">{article.authorName}</td>
              )}
              <td className="px-4 py-3">
                <Badge value={article.status} />
              </td>
              <td className="px-4 py-3 text-neutral-400">{formatDate(article.createdAt)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  {article.status === 'published' && (
                    <Link
                      to={`/articulo/${article.id}`}
                      title="Ver artículo"
                      className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-[#1A1A1B]"
                    >
                      <Eye size={15} />
                    </Link>
                  )}
                  <Link
                    to={`/panel/editar/${article.id}`}
                    title="Editar"
                    className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-[#1A1A1B]"
                  >
                    <Pencil size={15} />
                  </Link>
                  {showStatusActions && article.status !== 'published' && (
                    <button
                      onClick={() => onStatusChange?.(article.id, 'published')}
                      className="rounded px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50"
                    >
                      Publicar
                    </button>
                  )}
                  {showStatusActions && article.status === 'published' && (
                    <button
                      onClick={() => onStatusChange?.(article.id, 'archived')}
                      className="rounded px-2 py-1 text-xs font-medium text-amber-600 hover:bg-amber-50"
                    >
                      Archivar
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(article)}
                      title="Eliminar"
                      className="rounded p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
