import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { useUIStore, type Toast, type ToastType } from '@/store/ui.store'
import { cn } from '@/utils/helpers'

const toastConfig: Record<ToastType, { icon: React.ElementType; styles: string }> = {
  success: { icon: CheckCircle2,  styles: 'bg-white dark:bg-gray-800 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300' },
  error:   { icon: XCircle,       styles: 'bg-white dark:bg-gray-800 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300' },
  warning: { icon: AlertTriangle, styles: 'bg-white dark:bg-gray-800 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300' },
  info:    { icon: Info,          styles: 'bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300' },
}

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useUIStore((s) => s.removeToast)
  const { icon: Icon, styles } = toastConfig[toast.type]

  useEffect(() => {
    const duration = toast.duration ?? 4000
    const timer = setTimeout(() => removeToast(toast.id), duration)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, removeToast])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      role="alert"
      aria-live="polite"
      className={cn(
        'flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg w-full max-w-sm',
        styles,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        aria-label="Dismiss"
        className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts)

  return createPortal(
    <div
      className="fixed bottom-4 right-4 z-[9999] flex flex-col-reverse gap-2 sm:bottom-6 sm:right-6"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  )
}

export function useToast() {
  const addToast = useUIStore((s) => s.addToast)

  return useCallback(
    (message: string, type: ToastType = 'info', duration?: number) => {
      addToast({ message, type, duration })
    },
    [addToast],
  )
}

export default ToastContainer
