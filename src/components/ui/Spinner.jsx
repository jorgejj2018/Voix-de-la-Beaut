const SIZES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-[3px]',
}

export default function Spinner({ size = 'md' }) {
  return (
    <div
      className={`${SIZES[size]} animate-spin rounded-full border-[#D4AF37] border-t-transparent`}
      role="status"
      aria-label="Cargando"
    />
  )
}
