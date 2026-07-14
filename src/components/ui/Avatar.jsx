import { User } from 'lucide-react'

const SIZES = {
  sm: { wrapper: 'h-8 w-8', icon: 14 },
  md: { wrapper: 'h-10 w-10', icon: 18 },
  lg: { wrapper: 'h-16 w-16', icon: 24 },
}

export default function Avatar({ src, alt, size = 'md' }) {
  const { wrapper, icon } = SIZES[size]

  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? 'Avatar'}
        className={`${wrapper} rounded-full object-cover`}
      />
    )
  }

  return (
    <div className={`${wrapper} flex items-center justify-center rounded-full bg-neutral-200 text-neutral-500`}>
      <User size={icon} />
    </div>
  )
}
