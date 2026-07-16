import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/utils/helpers'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  content: React.ReactNode
  placement?: TooltipPlacement
  delay?: number
  className?: string
  children: React.ReactElement
}

export default function Tooltip({
  content,
  placement = 'top',
  delay = 300,
  className,
  children,
}: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => {
      if (!triggerRef.current) return
      const rect = triggerRef.current.getBoundingClientRect()
      const scroll = { x: window.scrollX, y: window.scrollY }
      const gap = 8
      let top = 0; let left = 0

      switch (placement) {
        case 'top':
          top  = rect.top  + scroll.y - gap
          left = rect.left + scroll.x + rect.width / 2
          break
        case 'bottom':
          top  = rect.bottom + scroll.y + gap
          left = rect.left   + scroll.x + rect.width / 2
          break
        case 'left':
          top  = rect.top  + scroll.y + rect.height / 2
          left = rect.left + scroll.x - gap
          break
        case 'right':
          top  = rect.top   + scroll.y + rect.height / 2
          left = rect.right + scroll.x + gap
          break
      }
      setCoords({ top, left })
      setVisible(true)
    }, delay)
  }, [placement, delay])

  const hide = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setVisible(false)
  }, [])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const placementClass: Record<TooltipPlacement, string> = {
    top:    '-translate-x-1/2 -translate-y-full',
    bottom: '-translate-x-1/2',
    left:   '-translate-x-full -translate-y-1/2',
    right:  '-translate-y-1/2',
  }

  const child = children as React.ReactElement<{
    ref?: React.Ref<HTMLElement>
    onMouseEnter?: () => void
    onMouseLeave?: () => void
    onFocus?: () => void
    onBlur?: () => void
  }>

  return (
    <>
      {React.cloneElement(child, {
        ref: triggerRef,
        onMouseEnter: show,
        onMouseLeave: hide,
        onFocus: show,
        onBlur: hide,
      })}

      {createPortal(
        <AnimatePresence>
          {visible && content && (
            <motion.div
              role="tooltip"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              style={{ top: coords.top, left: coords.left, position: 'absolute' }}
              className={cn(
                'z-[9999] max-w-xs rounded-lg bg-gray-900 dark:bg-gray-700 px-3 py-1.5',
                'text-xs text-white shadow-lg pointer-events-none',
                placementClass[placement],
                className,
              )}
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}

import React from 'react'
