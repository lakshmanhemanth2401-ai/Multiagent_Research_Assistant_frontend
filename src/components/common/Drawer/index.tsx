import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/utils/helpers'

export type DrawerSide = 'left' | 'right' | 'bottom'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  side?: DrawerSide
  size?: string
  className?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

function getSlideVariants(side: DrawerSide) {
  if (side === 'left')   return { open: { x: 0 }, closed: { x: '-100%' } }
  if (side === 'right')  return { open: { x: 0 }, closed: { x: '100%' } }
  return { open: { y: 0 }, closed: { y: '100%' } }
}

const sideStyles: Record<DrawerSide, string> = {
  left:   'inset-y-0 left-0 w-80',
  right:  'inset-y-0 right-0 w-80',
  bottom: 'inset-x-0 bottom-0 w-full rounded-t-2xl max-h-[85vh]',
}

export default function Drawer({
  open,
  onClose,
  title,
  side = 'right',
  className,
  children,
  footer,
}: DrawerProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() },
    [onClose],
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, handleKey])

  const slideAnim = getSlideVariants(side)

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            variants={slideAnim}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              'absolute flex flex-col bg-white dark:bg-gray-900',
              'border-gray-200 dark:border-gray-700 shadow-2xl',
              side === 'left' && 'border-r',
              side === 'right' && 'border-l',
              side === 'bottom' && 'border-t',
              sideStyles[side],
              className,
            )}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-5 py-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
                <button
                  onClick={onClose}
                  aria-label="Close drawer"
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-5">{footer}</div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
