import { useState } from 'react'
import { cn } from '@/utils/helpers'

export interface Tab {
  key: string
  label: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
  badge?: React.ReactNode
}

export interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  activeTab?: string
  onChange?: (key: string) => void
  variant?: 'line' | 'pill'
  className?: string
  children?: ((activeKey: string) => React.ReactNode) | React.ReactNode
}

export default function Tabs({
  tabs,
  defaultTab,
  activeTab: controlledActive,
  onChange,
  variant = 'line',
  className,
  children,
}: TabsProps) {
  const [internalActive, setInternalActive] = useState(defaultTab ?? tabs[0]?.key ?? '')
  const active = controlledActive ?? internalActive

  const handleSelect = (key: string) => {
    setInternalActive(key)
    onChange?.(key)
  }

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    const enabledTabs = tabs.filter((t) => !t.disabled)
    const currentIdx = enabledTabs.findIndex((t) => t.key === active)
    if (e.key === 'ArrowRight') {
      const next = enabledTabs[(currentIdx + 1) % enabledTabs.length]
      if (next) handleSelect(next.key)
    } else if (e.key === 'ArrowLeft') {
      const prev = enabledTabs[(currentIdx - 1 + enabledTabs.length) % enabledTabs.length]
      if (prev) handleSelect(prev.key)
    }
  }

  return (
    <div className={cn('w-full', className)}>
      <div
        role="tablist"
        className={cn(
          variant === 'line'
            ? 'flex border-b border-gray-200 dark:border-gray-700 gap-0'
            : 'inline-flex gap-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1',
        )}
      >
        {tabs.map((tab, idx) => {
          const isActive = tab.key === active
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              aria-disabled={tab.disabled}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && handleSelect(tab.key)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={cn(
                'inline-flex items-center gap-1.5 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset',
                'disabled:pointer-events-none disabled:opacity-50',
                variant === 'line'
                  ? cn(
                      'px-4 py-2.5 border-b-2 -mb-px',
                      isActive
                        ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
                    )
                  : cn(
                      'px-3.5 py-1.5 rounded-lg',
                      isActive
                        ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200',
                    ),
              )}
            >
              {tab.icon && <span aria-hidden="true">{tab.icon}</span>}
              {tab.label}
              {tab.badge && tab.badge}
            </button>
          )
        })}
      </div>

      {children && (
        <div role="tabpanel" className="mt-4">
          {typeof children === 'function' ? children(active) : children}
        </div>
      )}
    </div>
  )
}
