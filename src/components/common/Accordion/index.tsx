import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/utils/helpers'

export interface AccordionItem {
  key: string
  title: React.ReactNode
  content: React.ReactNode
  disabled?: boolean
}

export interface AccordionProps {
  items: AccordionItem[]
  multiple?: boolean
  defaultOpen?: string[]
  className?: string
  variant?: 'default' | 'bordered' | 'flush'
}

export default function Accordion({
  items,
  multiple = false,
  defaultOpen = [],
  className,
  variant = 'default',
}: AccordionProps) {
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set(defaultOpen))

  const toggle = (key: string) => {
    setOpenKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        if (!multiple) next.clear()
        next.add(key)
      }
      return next
    })
  }

  return (
    <div
      className={cn(
        variant === 'bordered' && 'rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden',
        className,
      )}
    >
      {items.map((item, idx) => {
        const isOpen = openKeys.has(item.key)
        const isFirst = idx === 0
        const isLast = idx === items.length - 1

        return (
          <div
            key={item.key}
            className={cn(
              variant === 'default' &&
                'rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-2 last:mb-0',
              variant === 'bordered' && !isFirst && 'border-t border-gray-200 dark:border-gray-700',
              variant === 'flush' && !isFirst && 'border-t border-gray-200 dark:border-gray-700',
            )}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              disabled={item.disabled}
              onClick={() => !item.disabled && toggle(item.key)}
              className={cn(
                'flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-medium',
                'text-gray-900 dark:text-white transition-colors',
                'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              <span>{item.title}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200',
                  isOpen && 'rotate-180',
                )}
                aria-hidden="true"
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
