import { useState } from 'react'
import { Search, ChevronDown, ChevronUp, LayoutGrid, LayoutList, X, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/utils/helpers'
import type { DocumentFilter, DocumentSort, DocumentSortField, FileType, DocumentStatus } from '../types'

const FILE_TYPE_OPTIONS: { value: FileType; label: string }[] = [
  { value: 'pdf',   label: 'PDF'   },
  { value: 'docx',  label: 'DOCX'  },
  { value: 'txt',   label: 'TXT'   },
  { value: 'md',    label: 'MD'    },
  { value: 'xlsx',  label: 'XLSX'  },
  { value: 'csv',   label: 'CSV'   },
  { value: 'image', label: 'Image' },
]

const STATUS_OPTIONS: { value: DocumentStatus; label: string }[] = [
  { value: 'ready',     label: 'Ready'      },
  { value: 'failed',    label: 'Failed'     },
  { value: 'extracting',label: 'Processing' },
  { value: 'cancelled', label: 'Cancelled'  },
]

const SORT_OPTIONS: { value: DocumentSortField; label: string }[] = [
  { value: 'uploadedAt', label: 'Upload date' },
  { value: 'name',       label: 'Name'        },
  { value: 'size',       label: 'File size'   },
  { value: 'fileType',   label: 'File type'   },
]

interface DocumentFiltersProps {
  filter: DocumentFilter
  sort: DocumentSort
  view: 'grid' | 'table'
  resultCount: number
  onFilterChange: (f: Partial<DocumentFilter>) => void
  onSortChange: (s: Partial<DocumentSort>) => void
  onViewChange: (v: 'grid' | 'table') => void
}

export default function DocumentFilters({
  filter, sort, view, resultCount,
  onFilterChange, onSortChange, onViewChange,
}: DocumentFiltersProps) {
  const [showMore, setShowMore] = useState(false)
  const hasActiveFilters = filter.search || filter.fileTypes.length > 0 || filter.statuses.length > 0

  function toggleFileType(ft: FileType) {
    const next = filter.fileTypes.includes(ft)
      ? filter.fileTypes.filter(t => t !== ft)
      : [...filter.fileTypes, ft]
    onFilterChange({ fileTypes: next })
  }

  function toggleStatus(st: DocumentStatus) {
    const next = filter.statuses.includes(st)
      ? filter.statuses.filter(s => s !== st)
      : [...filter.statuses, st]
    onFilterChange({ statuses: next })
  }

  function clearFilters() {
    onFilterChange({ search: '', fileTypes: [], statuses: [], collectionId: undefined })
  }

  return (
    <div className="space-y-3">
      {/* Row 1: Search + sort + view toggle */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="flex flex-1 min-w-48 items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500/30 transition-all">
          <Search className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents…"
            value={filter.search}
            onChange={e => onFilterChange({ search: e.target.value })}
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none"
          />
          {filter.search && (
            <button onClick={() => onFilterChange({ search: '' })} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Sort select */}
        <div className="relative">
          <select
            value={`${sort.field}:${sort.direction}`}
            onChange={e => {
              const [field, direction] = e.target.value.split(':') as [DocumentSortField, 'asc' | 'desc']
              onSortChange({ field, direction })
            }}
            className="rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 pr-8 text-sm text-gray-700 dark:text-gray-300 outline-none focus:border-primary-500 appearance-none cursor-pointer"
          >
            {SORT_OPTIONS.map(opt => (
              <>
                <option key={`${opt.value}:desc`} value={`${opt.value}:desc`}>{opt.label} (newest)</option>
                <option key={`${opt.value}:asc`}  value={`${opt.value}:asc`}>{opt.label} (oldest)</option>
              </>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        </div>

        {/* More filters toggle */}
        <button
          onClick={() => setShowMore(v => !v)}
          className={cn(
            'flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
            showMore || hasActiveFilters
              ? 'border-primary-400 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 dark:border-primary-700'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {hasActiveFilters && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-xs text-white">
              {(filter.fileTypes.length + filter.statuses.length + (filter.search ? 1 : 0))}
            </span>
          )}
          {showMore ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>

        {/* View toggle */}
        <div className="flex rounded-xl border border-gray-300 dark:border-gray-600 overflow-hidden bg-white dark:bg-gray-800">
          <button
            onClick={() => onViewChange('grid')}
            className={cn('p-2 transition-colors', view === 'grid'
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
              : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700')}
            title="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewChange('table')}
            className={cn('p-2 transition-colors', view === 'table'
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
              : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700')}
            title="Table view"
          >
            <LayoutList className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Row 2: Extended filters */}
      {showMore && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 space-y-3">
          {/* File types */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">File Type</p>
            <div className="flex flex-wrap gap-2">
              {FILE_TYPE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => toggleFileType(opt.value)}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-medium border transition-colors',
                    filter.fileTypes.includes(opt.value)
                      ? 'border-primary-500 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => toggleStatus(opt.value)}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-medium border transition-colors',
                    filter.statuses.includes(opt.value)
                      ? 'border-primary-500 bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Row 3: Results count + clear */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {resultCount} {resultCount === 1 ? 'document' : 'documents'}
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  )
}
