import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/utils/helpers'

export interface DropdownItem {
  key: string
  label: React.ReactNode
  icon?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  danger?: boolean
  divider?: boolean
}

export interface DropdownMenuProps {
  trigger: React.ReactElement
  items: DropdownItem[]
  align?: 'left' | 'right'
  className?: string
}

export default function DropdownMenu({ trigger, items, align = 'left', className }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0, right: 0 })
  const triggerRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const updateCoords = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setCoords({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
      right: window.innerWidth - rect.right + window.scrollX,
    })
  }, [])

  const toggle = () => {
    updateCoords()
    setOpen((v) => !v)
  }

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const child = trigger as React.ReactElement<{
    ref?: React.Ref<HTMLElement>
    onClick?: () => void
    'aria-expanded'?: boolean
    'aria-haspopup'?: boolean
  }>

  return (
    <>
      {React.cloneElement(child, {
        ref: triggerRef,
        onClick: toggle,
        'aria-expanded': open,
        'aria-haspopup': true,
      })}

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.96, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -4 }}
              transition={{ duration: 0.12 }}
              style={{
                position: 'absolute',
                top: coords.top,
                ...(align === 'right'
                  ? { right: coords.right }
                  : { left: coords.left }),
                zIndex: 9999,
              }}
              className={cn(
                'min-w-[10rem] rounded-xl border border-gray-200 dark:border-gray-700',
                'bg-white dark:bg-gray-800 shadow-xl py-1 overflow-hidden',
                className,
              )}
              role="menu"
            >
              {items.map((item, idx) =>
                item.divider ? (
                  <div key={`divider-${idx}`} className="my-1 border-t border-gray-100 dark:border-gray-700" />
                ) : (
                  <button
                    key={item.key}
                    role="menuitem"
                    disabled={item.disabled}
                    onClick={() => {
                      item.onClick?.()
                      setOpen(false)
                    }}
                    className={cn(
                      'flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors',
                      'focus-visible:outline-none focus-visible:bg-gray-50 dark:focus-visible:bg-gray-700',
                      item.danger
                        ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
                      item.disabled && 'pointer-events-none opacity-50',
                    )}
                  >
                    {item.icon && (
                      <span className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </button>
                ),
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}

import React from 'react'
