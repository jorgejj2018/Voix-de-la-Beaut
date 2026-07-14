import { forwardRef } from 'react'
import Spinner from './Spinner'

const variants = {
  primary: 'bg-[#1A1A1B] text-white hover:bg-[#2d2d2e] active:bg-[#111]',
  secondary: 'border border-[#1A1A1B] text-[#1A1A1B] hover:bg-[#1A1A1B] hover:text-white',
  ghost: 'text-[#1A1A1B] hover:bg-black/5',
  danger: 'bg-red-700 text-white hover:bg-red-800 active:bg-red-900',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
}

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, className = '', children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded font-medium
        transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
})

export default Button
