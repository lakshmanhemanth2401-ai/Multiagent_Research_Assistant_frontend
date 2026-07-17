import { cn } from '@/utils/helpers'
import { Loader2 } from 'lucide-react'

interface LoadingOverlayProps {
  message?: string
  className?: string
}

export default function LoadingOverlay({
  message = 'Loading…',
  className,
}: LoadingOverlayProps) {
  return (
    <div
      role='status'
      aria-live='polite'
      aria-label={message}
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center gap-4',
        'bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm',
        className,
      )}
    >
      <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/30'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
      <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>{message}</p>
    </div>
  )
}
