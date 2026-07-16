import { forwardRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/utils/helpers'

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: (value: string) => void
  onClear?: () => void
  loading?: boolean
  fullWidth?: boolean
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, onSearch, onClear, loading, fullWidth, value, onChange, ...props }, ref) => {
    const [internal, setInternal] = useState('')
    const isControlled = value !== undefined
    const displayValue = isControlled ? String(value) : internal

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternal(e.target.value)
      onChange?.(e)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') onSearch?.(displayValue)
      if (e.key === 'Escape') handleClear()
    }

    const handleClear = () => {
      if (!isControlled) setInternal('')
      onClear?.()
    }

    return (
      <div className={cn('relative flex items-center', fullWidth && 'w-full')}>
        <Search
          className="pointer-events-none absolute left-3 h-4 w-4 shrink-0 text-gray-400"
          aria-hidden="true"
        />

        <input
          ref={ref}
          type="search"
          role="searchbox"
          value={displayValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={cn(
            'w-full rounded-xl border border-gray-300 dark:border-gray-600',
            'bg-white dark:bg-gray-900 pl-9 pr-9 py-2 text-sm text-gray-900 dark:text-white',
            'placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          {...props}
        />

        {displayValue && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3 rounded p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  },
)

SearchBar.displayName = 'SearchBar'
export default SearchBar
