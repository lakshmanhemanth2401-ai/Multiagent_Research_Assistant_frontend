import { forwardRef } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/utils/helpers'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
  error?: string
  indeterminate?: boolean
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, indeterminate, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex gap-3">
        <div className="relative mt-0.5 flex h-4 w-4 shrink-0">
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            aria-invalid={!!error}
            className={cn(
              'peer h-4 w-4 cursor-pointer appearance-none rounded border transition-colors',
              'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900',
              'checked:bg-primary-600 checked:border-primary-600',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500',
              className,
            )}
            {...props}
          />
          <Check
            className="pointer-events-none absolute inset-0 h-4 w-4 stroke-white opacity-0 peer-checked:opacity-100"
            strokeWidth={3}
            aria-hidden="true"
          />
        </div>

        {(label || description) && (
          <div className="flex flex-col gap-0.5">
            {label && (
              <label
                htmlFor={inputId}
                className={cn(
                  'cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300',
                  props.disabled && 'cursor-not-allowed opacity-50',
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
            )}
            {error && (
              <p role="alert" className="text-xs text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>
        )}
      </div>
    )
  },
)

Checkbox.displayName = 'Checkbox'
export default Checkbox
