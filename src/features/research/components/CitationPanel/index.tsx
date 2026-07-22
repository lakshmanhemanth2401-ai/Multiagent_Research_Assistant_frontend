import { Quote, BookOpen, Hash } from 'lucide-react'
import type { Citation, ResearchSource } from '@/types/research'

interface CitationsPanelProps {
  citations: Citation[]
  sources: ResearchSource[]
}

export default function CitationsPanel({ citations, sources }: CitationsPanelProps) {
  if (citations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Quote className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Citations will be generated once the Citation agent runs.</p>
      </div>
    )
  }

  const sourceMap = Object.fromEntries(sources.map(s => [s.id, s]))

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {citations.length} citation{citations.length !== 1 ? 's' : ''} generated · APA 7th edition format
      </p>
      <div className="space-y-4">
        {citations.map((cit, idx) => {
          const src = sourceMap[cit.sourceId]
          return (
            <div key={cit.id} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
              {/* Citation number + text */}
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-xs font-bold text-primary-700 dark:text-primary-300">
                  {idx + 1}
                </span>
                <blockquote className="flex-1 text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed border-l-2 border-primary-300 dark:border-primary-700 pl-3">
                  {cit.text}
                </blockquote>
              </div>

              {/* Context + page */}
              <div className="mt-3 flex flex-wrap items-center gap-3 pl-9">
                <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <BookOpen className="h-3 w-3" />
                  {cit.context}
                </span>
                {cit.pageNumber && (
                  <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Hash className="h-3 w-3" />
                    p. {cit.pageNumber}
                  </span>
                )}
              </div>

              {/* Linked source */}
              {src && (
                <div className="mt-3 ml-9 flex items-center gap-2 rounded-lg bg-gray-50 dark:bg-gray-900/50 px-3 py-2">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 uppercase">
                    {src.domain.slice(0, 1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{src.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{src.domain}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
