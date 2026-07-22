import { useState } from 'react'
import { ExternalLink, Globe, BookOpen, FileText, Newspaper, ShieldCheck, ShieldAlert } from 'lucide-react'
import { cn } from '@/utils/helpers'
import type { ResearchSource, ResearchSourceType } from '@/types/research'

const SOURCE_TYPE_ICON: Record<ResearchSourceType, React.ElementType> = {
  web:       Globe,
  academic:  BookOpen,
  documents: FileText,
  news:      Newspaper,
}

const SOURCE_TYPE_LABEL: Record<ResearchSourceType, string> = {
  web:       'Web',
  academic:  'Academic',
  documents: 'Document',
  news:      'News',
}

const SOURCE_TYPE_COLOR: Record<ResearchSourceType, string> = {
  web:       'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  academic:  'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  documents: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  news:      'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
}

type FilterTab = 'all' | ResearchSourceType

function RelevanceBar({ score }: { score: number }) {
  const pct = Math.min(100, Math.max(0, score))
  const color = pct >= 90 ? 'bg-green-500' : pct >= 75 ? 'bg-blue-500' : pct >= 60 ? 'bg-amber-500' : 'bg-gray-400'
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <div className={cn('h-full rounded-full transition-all', color)} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">{pct}</span>
    </div>
  )
}

interface SourcesPanelProps {
  sources: ResearchSource[]
}

export default function SourcesPanel({ sources }: SourcesPanelProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const tabs: { value: FilterTab; label: string }[] = [
    { value: 'all',       label: `All (${sources.length})` },
    { value: 'academic',  label: `Academic (${sources.filter(s => s.sourceType === 'academic').length})` },
    { value: 'web',       label: `Web (${sources.filter(s => s.sourceType === 'web').length})` },
  ]

  const filtered = activeTab === 'all' ? sources : sources.filter(s => s.sourceType === activeTab)

  if (sources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Globe className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Sources will appear here as the Web Search agent discovers them.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex gap-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
              activeTab === tab.value
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Source cards */}
      <div className="space-y-3">
        {filtered.map(src => {
          const TypeIcon = SOURCE_TYPE_ICON[src.sourceType]
          return (
            <div
              key={src.id}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start gap-3">
                {/* Letter avatar for domain */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                  {src.domain.slice(0, 2)}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Title + link */}
                  <div className="flex items-start justify-between gap-2">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2 leading-snug"
                    >
                      {src.title}
                    </a>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-gray-400 mt-0.5" />
                  </div>

                  {/* Domain + type + verified */}
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{src.domain}</span>
                    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', SOURCE_TYPE_COLOR[src.sourceType])}>
                      <TypeIcon className="h-3 w-3" />
                      {SOURCE_TYPE_LABEL[src.sourceType]}
                    </span>
                    {src.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                        <ShieldCheck className="h-3 w-3" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                        <ShieldAlert className="h-3 w-3" /> Unverified
                      </span>
                    )}
                    {src.publicationDate && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">{src.publicationDate}</span>
                    )}
                  </div>

                  {/* Authors */}
                  {src.authors && src.authors.length > 0 && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 italic">
                      {src.authors.join(', ')}
                    </p>
                  )}

                  {/* Snippet */}
                  <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                    {src.snippet}
                  </p>

                  {/* Relevance */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500">Relevance:</span>
                    <RelevanceBar score={src.relevanceScore} />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
