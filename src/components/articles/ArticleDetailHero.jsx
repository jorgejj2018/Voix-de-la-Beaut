import { formatDate } from '../../utils/formatDate'
import Avatar from '../ui/Avatar'

export default function ArticleDetailHero({ article }) {
  const { title, category, coverImage, authorName, authorPhotoURL, publishedAt, readTime } =
    article

  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-widest text-[#D4AF37]">
          {category}
        </span>
        <span className="text-neutral-300">·</span>
        <span className="text-xs text-neutral-500">{readTime} min de lectura</span>
      </div>

      <h1 className="font-display text-4xl font-bold leading-tight text-[#1A1A1B] md:text-5xl">
        {title}
      </h1>

      <div className="mt-6 flex items-center gap-3">
        <Avatar src={authorPhotoURL} alt={authorName} size="sm" />
        <div>
          <p className="text-sm font-medium text-[#1A1A1B]">{authorName}</p>
          <p className="text-xs text-neutral-400">{formatDate(publishedAt)}</p>
        </div>
      </div>

      {coverImage && (
        <div className="mt-8 overflow-hidden rounded-lg">
          <img
            src={coverImage}
            alt={title}
            className="h-auto w-full object-cover"
          />
        </div>
      )}
    </div>
  )
}
