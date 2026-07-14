import { forwardRef } from 'react'

const Textarea = forwardRef(function Textarea(
  { label, error, id, rows = 6, className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#1A1A1B]">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={`
          w-full resize-y rounded border px-3 py-2.5 text-sm text-[#1A1A1B] outline-none
          placeholder:text-neutral-400 bg-white
          border-neutral-300
          focus:border-[#1A1A1B] focus:ring-1 focus:ring-[#1A1A1B]
          disabled:cursor-not-allowed disabled:bg-neutral-100
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
})

export default Textarea
