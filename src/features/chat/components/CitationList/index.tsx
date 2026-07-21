import { ExternalLink, Quote } from 'lucide-react'
import type { CitationRef } from '@/types/chat'

interface CitationListProps {
  citations: CitationRef[]
}

export default function CitationList({ citations }: CitationListProps) {
  if (citations.length === 0) return null
  return (
    <div className='mt-3 border-t border-gray-200 dark:border-gray-700 pt-3'>
      <p className='mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400'>
        <Quote className='h-3 w-3' aria-hidden='true' />
        Sources
      </p>
      <ul className='space-y-1'>
        {citations.map((cit, i) => (
          <li key={cit.id} className='flex items-start gap-2'>
            <span className='mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-[10px] font-bold text-primary-600 dark:text-primary-400'>
              {i + 1}
            </span>
            <div className='min-w-0'>
              {cit.url ? (
                <a
                  href={cit.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 hover:underline'
                >
                  {cit.title}
                  <ExternalLink className='h-2.5 w-2.5 shrink-0' aria-hidden='true' />
                </a>
              ) : (
                <p className='text-xs text-gray-600 dark:text-gray-400'>{cit.title}</p>
              )}
              {(cit.authors || cit.year) && (
                <p className='text-[11px] text-gray-400 dark:text-gray-500'>
                  {cit.authors?.join(', ')}{cit.authors && cit.year ? ' · ' : ''}{cit.year}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
