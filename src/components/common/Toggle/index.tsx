import { cn } from '@/utils/helpers'

export interface ToggleProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  label?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  id?: string
}

const sizeMap = {
  sm: { track: 'h-4 w-7',  thumb: 'h-3 w-3',   translate: 'translate-x-3' },
  md: { track: 'h-5 w-9',  thumb: 'h-4 w-4',   translate: 'translate-x-4' },
  lg: { track: 'h-6 w-11', thumb: 'h-5 w-5',   translate: 'translate-x-5' },
}

export default function Toggle({
  checked = false,
  onChange,
  disabled,
  label,
  description,
  size = 'md',
  id,
}: ToggleProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  const s = sizeMap[size]

  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        id={inputId}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          'relative mt-0.5 inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
          'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          'dark:focus-visible:ring-offset-gray-900',
          'disabled:cursor-not-allowed disabled:opacity-50',
          s.track,
          checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700',
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block rounded-full bg-white shadow-sm ring-0 transition-transform',
            s.thumb,
            checked ? s.translate : 'translate-x-0',
          )}
        />
      </button>

      {(label || description) && (
        <label
          htmlFor={inputId}
          className={cn(
            'flex flex-col cursor-pointer',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
          )}
          {description && (
            <span className="text-xs text-gray-500 dark:text-gray-400">{description}</span>
          )}
        </label>
      )}
    </div>
  )
}
