import { X, CheckCircle, AlertCircle } from 'lucide-react'

const TYPES = {
  success: {
    icon: CheckCircle,
    className: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  },
  error: {
    icon: AlertCircle,
    className: 'bg-red-50 border-red-200 text-red-800',
  },
}

export default function Toast({ message, type = 'success', onClose }) {
  const { icon: Icon, className } = TYPES[type] ?? TYPES.success

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg ${className}`}
    >
      <Icon size={18} className="shrink-0" />
      <span className="text-sm font-medium">{message}</span>
      {onClose && (
        <button onClick={onClose} aria-label="Cerrar" className="ml-2 opacity-60 hover:opacity-100">
          <X size={16} />
        </button>
      )}
    </div>
  )
}
