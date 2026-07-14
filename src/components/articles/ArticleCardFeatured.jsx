import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/formatDate'

export default function ArticleCardFeatured({ article }) {
  const { id, title, excerpt, coverImage, category, authorName, publishedAt, readTime } = article

  return (
    <Link
      to={`/articulo/${id}`}
      className="group relative flex min-h-[420px] overflow-hidden rounded-lg bg-[#1A1A1B]"
    >
      {coverImage && (
        <img
          src={coverImage}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover opacity-60 transition-opacity duration-300 group-hover:opacity-50"
          loading="eager"
        />
      )}
      <div className="relative mt-auto flex flex-col justify-end p-8 md:p-10">
        <span className="mb-3 text-xs font-medium uppercase tracking-widest text-[#D4AF37]">
          {category}
        </span>
        <h1 className="font-display text-3xl font-bold leading-tight text-white md:text-4xl">
          {title}
        </h1>
        {excerpt && (
          <p className="mt-3 text-sm text-white/70 line-clamp-2 md:text-base">{excerpt}</p>
        )}
        <div className="mt-4 flex items-center gap-2 text-xs text-white/50">
          <span>{authorName}</span>
          <span>·</span>
          <span>{readTime} min</span>
          <span>·</span>
          <span>{formatDate(publishedAt)}</span>
        </div>
      </div>
    </Link>
  )
}
