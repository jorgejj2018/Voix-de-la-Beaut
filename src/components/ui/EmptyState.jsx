import { FileX } from 'lucide-react'

export default function EmptyState({ title = 'Sin resultados', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <FileX size={40} className="text-neutral-300" />
      <h3 className="font-display text-lg font-semibold text-neutral-600">{title}</h3>
      {description && <p className="max-w-sm text-sm text-neutral-400">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
