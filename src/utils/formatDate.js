export function formatDate(timestamp) {
  if (!timestamp) return ''
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
