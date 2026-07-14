import { X } from 'lucide-react'
import Button from './Button'

export default function Modal({
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirmar',
  confirmVariant = 'danger',
  loading = false,
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    >
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="font-display text-lg font-semibold text-[#1A1A1B]">{title}</h2>
          <button
            onClick={onCancel}
            aria-label="Cerrar"
            className="shrink-0 text-neutral-400 hover:text-neutral-600"
          >
            <X size={18} />
          </button>
        </div>
        {description && (
          <p className="mb-6 text-sm leading-relaxed text-neutral-600">{description}</p>
        )}
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
