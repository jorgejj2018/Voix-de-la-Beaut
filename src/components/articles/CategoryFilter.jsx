import { Check } from 'lucide-react'
import { CATEGORIES } from '../../constants/categories'

const ALL_OPTION = { value: null, label: 'Todos' }
const OPTIONS = [ALL_OPTION, ...CATEGORIES]

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map(({ value, label }) => {
        const isActive = selected === value
        return (
          <button
            key={label}
            onClick={() => onSelect(value)}
            className={`
              inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5
              text-xs font-medium tracking-wide transition-all duration-150
              ${
                isActive
                  ? 'border-[#1A1A1B] bg-[#1A1A1B] text-white'
                  : 'border-[#1A1A1B]/20 text-neutral-500 hover:border-[#1A1A1B]/60 hover:text-[#1A1A1B]'
              }
            `}
          >
            {isActive && <Check size={11} strokeWidth={3} />}
            {label}
          </button>
        )
      })}
    </div>
  )
}

