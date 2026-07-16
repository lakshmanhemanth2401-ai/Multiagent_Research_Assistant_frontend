import { cn } from '@/utils/helpers'

export type ProgressVariant = 'primary' | 'success' | 'warning' | 'danger'
export type ProgressSize = 'xs' | 'sm' | 'md' | 'lg'

export interface ProgressBarProps {
  value: number
  max?: number
  variant?: ProgressVariant
  size?: ProgressSize
  label?: string
  showValue?: boolean
  animated?: boolean
  className?: string
}

const variantStyles: Record<ProgressVariant, string> = {
  primary: 'bg-primary-600 dark:bg-primary-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger:  'bg-red-500',
}

const sizeStyles: Record<ProgressSize, string> = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

export default function ProgressBar({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  label,
  showValue,
  animated,
  className,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="mb-1 flex items-center justify-between">
          {label && (
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
          )}
          {showValue && (
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {Math.round(percent)}%
            </span>
          )}
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className={cn(
          'w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700',
          sizeStyles[size],
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            variantStyles[variant],
            animated && 'animate-pulse',
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
