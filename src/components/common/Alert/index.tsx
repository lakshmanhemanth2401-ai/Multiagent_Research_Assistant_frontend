import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/utils/helpers'

export type AlertVariant = 'success' | 'error' | 'warning' | 'info'

export interface AlertProps {
  variant?: AlertVariant
  title?: string
  className?: string
  onClose?: () => void
  children: React.ReactNode
}

const config: Record<AlertVariant, { icon: React.ElementType; styles: string }> = {
  success: { icon: CheckCircle2, styles: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300' },
  error:   { icon: XCircle,      styles: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300' },
  warning: { icon: AlertTriangle, styles: 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300' },
  info:    { icon: Info,          styles: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300' },
}

export default function Alert({ variant = 'info', title, onClose, className, children }: AlertProps) {
  const { icon: Icon, styles } = config[variant]

  return (
    <div
      role="alert"
      className={cn('flex gap-3 rounded-xl border p-4', styles, className)}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />

      <div className="flex-1 min-w-0">
        {title && <p className="mb-1 text-sm font-semibold">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss alert"
          className="ml-auto -mt-0.5 shrink-0 rounded p-0.5 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
