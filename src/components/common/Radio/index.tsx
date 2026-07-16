import { forwardRef } from 'react'
import { cn } from '@/utils/helpers'

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex gap-3">
        <input
          ref={ref}
          type="radio"
          id={inputId}
          className={cn(
            'mt-0.5 h-4 w-4 shrink-0 cursor-pointer border-gray-300 dark:border-gray-600',
            'text-primary-600 focus:ring-primary-500 focus:ring-offset-0',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'accent-primary-600',
            className,
          )}
          {...props}
        />

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
          </div>
        )}
      </div>
    )
  },
)

Radio.displayName = 'Radio'
export default Radio

export interface RadioGroupProps {
  name: string
  value?: string
  onChange?: (value: string) => void
  options: Array<{ value: string; label: string; description?: string; disabled?: boolean }>
  className?: string
}

export function RadioGroup({ name, value, onChange, options, className }: RadioGroupProps) {
  return (
    <div role="radiogroup" className={cn('space-y-3', className)}>
      {options.map((opt) => (
        <Radio
          key={opt.value}
          name={name}
          value={opt.value}
          label={opt.label}
          description={opt.description}
          disabled={opt.disabled}
          checked={value === opt.value}
          onChange={() => onChange?.(opt.value)}
        />
      ))}
    </div>
  )
}
