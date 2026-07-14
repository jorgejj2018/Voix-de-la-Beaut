export default function ArticleContent({ content }) {
  if (!content) return null

  return (
    <div className="space-y-4">
      {content.split('\n').map((paragraph, index) =>
        paragraph.trim() ? (
          <p key={index} className="text-base leading-relaxed text-neutral-700">
            {paragraph}
          </p>
        ) : null
      )}
    </div>
  )
}
