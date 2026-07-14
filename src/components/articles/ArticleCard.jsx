import { Link } from 'react-router-dom'
import { Heart, Bookmark } from 'lucide-react'
import { formatDate } from '../../utils/formatDate'

export default function ArticleCard({ article }) {
  const { id, title, excerpt, coverImage, category, authorName, publishedAt, readTime, likedBy, savedBy } = article
  const likes = likedBy?.length ?? 0
  const saves = savedBy?.length ?? 0

  return (
    <Link
      to={'/articulo/' + id}
      className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      {coverImage && (
        <div className="aspect-video overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-xs font-medium uppercase tracking-widest text-[#D4AF37]">
          {category}
        </span>
        <h2 className="font-display text-lg font-semibold leading-snug text-[#1A1A1B] line-clamp-2 transition-colors group-hover:text-[#D4AF37]">
          {title}
        </h2>
        {excerpt && (
          <p className="text-sm text-neutral-500 line-clamp-2">{excerpt}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3 text-xs text-neutral-400">
          <span>{authorName}</span>
          <span>{readTime} min &middot; {formatDate(publishedAt)}</span>
        </div>
        {(likes > 0 || saves > 0) && (
          <div className="flex items-center gap-3 border-t border-black/5 pt-2.5 text-xs text-neutral-400">
            {likes > 0 && (
              <span className="flex items-center gap-1">
                <Heart size={12} className="text-red-400" />
                {likes}
              </span>
            )}
            {saves > 0 && (
              <span className="flex items-center gap-1">
                <Bookmark size={12} className="text-[#D4AF37]" />
                {saves}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}