import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, Zap, Layers, Globe, BookOpen, FileText, Newspaper, AlertCircle } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { ROUTES } from '@/utils/constants'
import { useStartResearch } from '../hooks'
import type { ResearchDepth, ResearchSourceType } from '@/types/research'

// ── Zod schema ────────────────────────────────────────────────────────────────
const schema = z.object({
  topic: z
    .string()
    .min(10, 'Research topic must be at least 10 characters')
    .max(500, 'Research topic must be 500 characters or fewer'),
  instructions: z.string().max(2000, 'Instructions must be 2000 characters or fewer').optional(),
  depth: z.enum(['quick', 'standard', 'deep'] as const),
  sourceTypes: z
    .array(z.enum(['web', 'academic', 'documents', 'news'] as const))
    .min(1, 'Select at least one source type'),
})

type FormValues = z.infer<typeof schema>

// ── Depth options ─────────────────────────────────────────────────────────────
const DEPTH_OPTIONS: {
  value: ResearchDepth
  label: string
  description: string
  time: string
  icon: React.ElementType
  color: string
}[] = [
  { value: 'quick',    label: 'Quick',    icon: Zap,    time: '~5 min',  color: 'text-amber-500',
    description: 'Fast overview with key insights. Best for quick fact-checks or introductory summaries.' },
  { value: 'standard', label: 'Standard', icon: Layers, time: '~12 min', color: 'text-blue-500',
    description: 'Balanced depth and breadth. Suitable for most research tasks with solid coverage.' },
  { value: 'deep',     label: 'Deep',     icon: Globe,  time: '~25 min', color: 'text-violet-500',
    description: 'Comprehensive analysis with extensive source discovery. Best for thorough research reports.' },
]

// ── Source type options ───────────────────────────────────────────────────────
const SOURCE_TYPES: { value: ResearchSourceType; label: string; description: string; icon: React.ElementType }[] = [
  { value: 'web',       icon: Globe,     label: 'Web Sources',        description: 'General websites, blogs, news sites' },
  { value: 'academic',  icon: BookOpen,  label: 'Academic Papers',    description: 'Peer-reviewed journals and research papers' },
  { value: 'documents', icon: FileText,  label: 'Uploaded Documents', description: 'Your previously uploaded files' },
  { value: 'news',      icon: Newspaper, label: 'News Articles',      description: 'Recent news and press releases' },
]

// ── Component ─────────────────────────────────────────────────────────────────
export default function NewResearchPage() {
  const { mutate: startResearch, isPending, isError, error } = useStartResearch()

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { depth: 'standard', sourceTypes: ['web', 'academic'] },
  })

  const topic = watch('topic') ?? ''
  const selectedDepth = watch('depth')

  function onSubmit(values: FormValues) {
    startResearch({
      topic: values.topic,
      instructions: values.instructions || undefined,
      depth: values.depth,
      sourceTypes: values.sourceTypes,
    })
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Back link */}
      <Link
        to={ROUTES.RESEARCH}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Research
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Research Session</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configure your research task and let multi-agent AI do the deep work.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
        {/* ── Research Topic ── */}
        <div>
          <label htmlFor="topic" className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
            Research Topic <span className="text-red-500">*</span>
          </label>
          <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
            Describe what you want to research in detail. The more specific, the better the results.
          </p>
          <textarea
            id="topic"
            rows={4}
            placeholder="e.g. What are the latest advancements in quantum computing error correction and their implications for fault-tolerant quantum systems?"
            className={cn(
              'w-full rounded-xl border bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none resize-none transition-shadow',
              'focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20',
              errors.topic
                ? 'border-red-400 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-600',
            )}
            {...register('topic')}
          />
          <div className="mt-1 flex items-center justify-between">
            {errors.topic ? (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.topic.message}
              </p>
            ) : (
              <span />
            )}
            <span className={cn('text-xs tabular-nums', topic.length > 450 ? 'text-amber-500' : 'text-gray-400')}>
              {topic.length}/500
            </span>
          </div>
        </div>

        {/* ── Additional Instructions ── */}
        <div>
          <label htmlFor="instructions" className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
            Additional Instructions <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
            Specify focus areas, required perspectives, output format preferences, or constraints.
          </p>
          <textarea
            id="instructions"
            rows={3}
            placeholder="e.g. Focus on practical implementation aspects, include real-world case studies, avoid highly theoretical content..."
            className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none resize-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-shadow"
            {...register('instructions')}
          />
          {errors.instructions && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.instructions.message}
            </p>
          )}
        </div>

        {/* ── Research Depth ── */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
            Research Depth <span className="text-red-500">*</span>
          </label>
          <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
            Choose how thoroughly the agents should research your topic.
          </p>
          <Controller
            control={control}
            name="depth"
            render={({ field }) => (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {DEPTH_OPTIONS.map(opt => {
                  const Icon = opt.icon
                  const isSelected = field.value === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => field.onChange(opt.value)}
                      className={cn(
                        'relative rounded-xl border-2 p-4 text-left transition-all',
                        isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600',
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={cn('h-4 w-4', isSelected ? 'text-primary-600 dark:text-primary-400' : opt.color)} />
                        <span className={cn('text-sm font-semibold', isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white')}>
                          {opt.label}
                        </span>
                        <span className={cn(
                          'ml-auto flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-full',
                          isSelected ? 'bg-primary-100 text-primary-700 dark:bg-primary-800/40 dark:text-primary-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
                        )}>
                          <Clock className="h-2.5 w-2.5" />
                          {opt.time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {opt.description}
                      </p>
                      {isSelected && (
                        <div className="absolute top-3 right-3 h-4 w-4 rounded-full bg-primary-500 flex items-center justify-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          />
          {selectedDepth === 'deep' && (
            <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              Deep research uses significantly more processing time and tokens. Recommended for comprehensive reports.
            </p>
          )}
        </div>

        {/* ── Source Types ── */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
            Source Types <span className="text-red-500">*</span>
          </label>
          <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
            Select which types of sources the research agents should use.
          </p>
          <Controller
            control={control}
            name="sourceTypes"
            render={({ field }) => (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {SOURCE_TYPES.map(st => {
                  const Icon = st.icon
                  const isChecked = field.value.includes(st.value)
                  const isDisabled = st.value === 'documents'
                  return (
                    <button
                      key={st.value}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        if (isDisabled) return
                        const next = isChecked
                          ? field.value.filter(v => v !== st.value)
                          : [...field.value, st.value]
                        field.onChange(next)
                      }}
                      className={cn(
                        'flex items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-all',
                        isDisabled && 'cursor-not-allowed opacity-50',
                        !isDisabled && isChecked
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : !isDisabled
                          ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50',
                      )}
                    >
                      <div className={cn(
                        'h-8 w-8 shrink-0 rounded-lg flex items-center justify-center',
                        isChecked ? 'bg-primary-100 dark:bg-primary-800/40' : 'bg-gray-100 dark:bg-gray-700',
                      )}>
                        <Icon className={cn('h-4 w-4', isChecked ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400')} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{st.label}</span>
                          {isDisabled && (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                              Coming soon
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{st.description}</p>
                      </div>
                      <div className={cn(
                        'h-4 w-4 shrink-0 rounded border-2 flex items-center justify-center transition-colors',
                        isChecked ? 'border-primary-500 bg-primary-500' : 'border-gray-300 dark:border-gray-600',
                      )}>
                        {isChecked && (
                          <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 12 12">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          />
          {errors.sourceTypes && (
            <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.sourceTypes.message}
            </p>
          )}
        </div>

        {/* ── Error banner ── */}
        {isError && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-900/20 p-4">
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300">
              {error instanceof Error ? error.message : 'Failed to start research. Please try again.'}
            </p>
          </div>
        )}

        {/* ── Submit ── */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <Link
            to={ROUTES.RESEARCH}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 active:bg-primary-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            {isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Starting Research...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Start Research
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
