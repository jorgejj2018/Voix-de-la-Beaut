const STATUS_CONFIG = {
  draft: { label: 'Borrador', className: 'bg-neutral-100 text-neutral-600' },
  published: { label: 'Publicado', className: 'bg-emerald-50 text-emerald-700' },
  archived: { label: 'Archivado', className: 'bg-amber-50 text-amber-700' },
}

const ROLE_CONFIG = {
  lector: { label: 'Lector', className: 'bg-sky-50 text-sky-700' },
  creador: { label: 'Creador', className: 'bg-blue-50 text-blue-700' },
  author: { label: 'Creador', className: 'bg-blue-50 text-blue-700' },
  empresa: { label: 'Empresa', className: 'bg-violet-50 text-violet-700' },
  admin: { label: 'Admin', className: 'bg-purple-50 text-purple-700' },
  superadmin: { label: 'Super Admin', className: 'bg-[#D4AF37]/10 text-[#b8960f]' },
}

export default function Badge({ value, type = 'status' }) {
  const config = type === 'role' ? ROLE_CONFIG[value] : STATUS_CONFIG[value]
  if (!config) return null

  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
