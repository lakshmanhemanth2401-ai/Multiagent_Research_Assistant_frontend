import { useState } from 'react'
import { ChevronDown, ChevronRight, Layers, CheckCircle2, PenLine, Clock } from 'lucide-react'
import { cn } from '@/utils/helpers'
import type { OutlineSection, OutlineSectionStatus } from '@/types/research'

const STATUS_ICON: Record<OutlineSectionStatus, React.ElementType> = {
  planned:   Clock,
  writing:   PenLine,
  completed: CheckCircle2,
}

const STATUS_COLOR: Record<OutlineSectionStatus, string> = {
  planned:   'text-gray-400 dark:text-gray-500',
  writing:   'text-blue-500 dark:text-blue-400',
  completed: 'text-green-500 dark:text-green-400',
}

interface SectionRowProps {
  section: OutlineSection
  depth?: number
}

function SectionRow({ section, depth = 0 }: SectionRowProps) {
  const [open, setOpen] = useState(true)
  const hasChildren = section.subsections && section.subsections.length > 0
  const StatusIcon = STATUS_ICON[section.status]

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2.5 group transition-colors',
          section.status === 'writing' && 'bg-blue-50/60 dark:bg-blue-900/10',
          section.status === 'completed' && 'bg-green-50/40 dark:bg-green-900/10',
          section.status === 'planned' && 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
        )}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        {/* Expand toggle */}
        {hasChildren ? (
          <button
            onClick={() => setOpen(v => !v)}
            className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
        ) : (
          <span className="h-3.5 w-3.5 shrink-0" />
        )}

        {/* Status icon */}
        <StatusIcon className={cn('h-3.5 w-3.5 shrink-0', STATUS_COLOR[section.status],
          section.status === 'writing' && 'animate-pulse')} />

        {/* Title */}
        <span className={cn(
          'flex-1 min-w-0 text-sm leading-snug',
          depth === 0 ? 'font-semibold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300',
          section.status === 'completed' && 'line-through-none',
        )}>
          {section.title}
        </span>

        {/* Word count */}
        {section.wordCount && section.status === 'completed' && (
          <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums shrink-0">
            ~{section.wordCount}w
          </span>
        )}

        {/* Writing badge */}
        {section.status === 'writing' && (
          <span className="shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400 animate-pulse">
            writing…
          </span>
        )}
      </div>

      {/* Subsections */}
      {hasChildren && open && (
        <div>
          {section.subsections!.map(sub => (
            <SectionRow key={sub.id} section={sub} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

interface OutlinePanelProps {
  outline: OutlineSection[]
}

export default function OutlinePanel({ outline }: OutlinePanelProps) {
  if (outline.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Layers className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-sm text-gray-500 dark:text-gray-400">The research outline will be generated when the Planner agent completes.</p>
      </div>
    )
  }

  const completed = outline.filter(s => s.status === 'completed').length
  const total = outline.length
  const writingCount = outline.filter(s => s.status === 'writing').length +
    (outline.flatMap(s => s.subsections ?? []).filter(s => s.status === 'writing').length)

  return (
    <div className="space-y-3">
      {/* Progress summary */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-500"
            style={{ width: `${Math.round((completed / total) * 100)}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums shrink-0">
          {completed}/{total} sections complete
          {writingCount > 0 && ` · ${writingCount} writing`}
        </span>
      </div>

      {/* Section tree */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="divide-y divide-gray-100 dark:divide-gray-700/60">
          {outline.map(section => (
            <SectionRow key={section.id} section={section} depth={0} />
          ))}
        </div>
      </div>
    </div>
  )
}
