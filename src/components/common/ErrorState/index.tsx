import { AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/utils/helpers'
import Button from '../Button'

export interface ErrorStateProps {
  title?: string
  description?: string
  error?: Error | string | null
  onRetry?: () => void
  className?: string
}

export default function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  error,
  onRetry,
  className,
}: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : error

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-8 text-center',
        className,
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500">
        <AlertCircle className="h-8 w-8" />
      </div>

      <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-gray-500 dark:text-gray-400">{description}</p>

      {errorMessage && (
        <code className="mt-3 max-w-sm rounded-lg bg-red-50 dark:bg-red-900/20 px-3 py-2 text-xs text-red-700 dark:text-red-400 font-mono">
          {errorMessage}
        </code>
      )}

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          leftIcon={<RefreshCw className="h-4 w-4" />}
          onClick={onRetry}
          className="mt-6"
        >
          Try again
        </Button>
      )}
    </div>
  )
}
