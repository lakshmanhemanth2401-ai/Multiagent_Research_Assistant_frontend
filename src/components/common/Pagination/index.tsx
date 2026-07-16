import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/utils/helpers'

export interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
  siblingCount?: number
  className?: string
  showFirstLast?: boolean
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

function getPages(page: number, total: number, sibling: number) {
  const totalNumbers = sibling * 2 + 5
  if (total <= totalNumbers) return range(1, total)

  const leftSib  = Math.max(page - sibling, 1)
  const rightSib = Math.min(page + sibling, total)

  const showLeft  = leftSib > 2
  const showRight = rightSib < total - 1

  if (!showLeft && showRight)  return [...range(1, 3 + sibling * 2), '...', total]
  if (showLeft && !showRight)  return [1, '...', ...range(total - (2 + sibling * 2), total)]
  return [1, '...', ...range(leftSib, rightSib), '...', total]
}

export default function Pagination({
  page,
  totalPages,
  onChange,
  siblingCount = 1,
  className,
  showFirstLast = true,
}: PaginationProps) {
  if (totalPages <= 1) return null
  const pages = getPages(page, totalPages, siblingCount)

  const btn = (
    label: React.ReactNode,
    targetPage: number,
    disabled: boolean,
    ariaLabel: string,
    active = false,
  ) => (
    <button
      key={ariaLabel}
      onClick={() => !disabled && onChange(targetPage)}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg px-2 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        'disabled:pointer-events-none disabled:opacity-40',
        active
          ? 'bg-primary-600 text-white'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800',
      )}
    >
      {label}
    </button>
  )

  return (
    <nav aria-label="Pagination" className={cn('flex items-center gap-1', className)}>
      {btn(<ChevronLeft className="h-4 w-4" />, page - 1, page === 1, 'Previous page')}

      {pages.map((p, idx) =>
        p === '...'
          ? <span key={`dots-${idx}`} className="flex h-9 w-9 items-center justify-center text-gray-400"><MoreHorizontal className="h-4 w-4" /></span>
          : btn(p, p as number, false, `Page ${p}`, p === page),
      )}

      {btn(<ChevronRight className="h-4 w-4" />, page + 1, page === totalPages, 'Next page')}
    </nav>
  )
}
