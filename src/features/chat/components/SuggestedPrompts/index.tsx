import { Sparkles } from 'lucide-react'

const SUGGESTIONS = [
  'Summarise the latest research on quantum computing',
  'What are the key findings in my uploaded documents?',
  'Compare different approaches to machine learning alignment',
  'Explain the economic impact of renewable energy adoption',
  'Generate a literature review on CRISPR gene editing',
  'What are the most cited papers on large language models?',
]

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void
}

export default function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div className='flex flex-col items-center gap-6 py-8 px-4 text-center'>
      <div className='flex flex-col items-center gap-2'>
        <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/25'>
          <Sparkles className='h-7 w-7' aria-hidden='true' />
        </div>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
          Research Assistant
        </h2>
        <p className='max-w-sm text-sm text-gray-500 dark:text-gray-400'>
          Ask anything about your research. I can search documents, summarise findings, and generate reports.
        </p>
      </div>

      <div className='grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2'>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 transition-all hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 hover:shadow-sm'
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
