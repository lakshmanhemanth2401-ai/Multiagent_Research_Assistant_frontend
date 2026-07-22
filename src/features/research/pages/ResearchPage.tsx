import { useNavigate } from 'react-router-dom'
import { Microscope, Plus, Clock, ChevronRight, CheckCircle2, Ban, Pause, Loader2 } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { ROUTES } from '@/utils/constants'
import { useResearchStore } from '@/store/research.store'
import type { ResearchSession, ResearchStatus } from '@/types/research'

const STATUS_CONFIG: Partial<Record<ResearchStatus, { label: string; badge: string; icon: React.ElementType }>> = {
  planning:    { label: 'Planning',    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300', icon: Loader2 },
  researching: { label: 'Researching', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',         icon: Loader2 },
  writing:     { label: 'Writing',     badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',     icon: Loader2 },
  reviewing:   { label: 'Reviewing',   badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300', icon: Loader2 },
  completed:   { label: 'Completed',   badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',     icon: CheckCircle2 },
  paused:      { label: 'Paused',      badge: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',            icon: Pause },
  cancelled:   { label: 'Cancelled',   badge: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',            icon: Ban },
  failed:      { label: 'Failed',      badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',             icon: Ban },
}

const DEPTH_LABEL = { quick: 'Quick', standard: 'Standard', deep: 'Deep' }

function formatElapsed(secs: number): string {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  if (m === 0) return `${s}s`
  return `${m}m ${s}s`
}

function SessionCard({ session }: { session: ResearchSession }) {
  const navigate = useNavigate()
  const cfg = STATUS_CONFIG[session.status]
  const StatusIcon = cfg?.icon ?? Loader2
  const isActive = ['planning', 'researching', 'writing', 'reviewing'].includes(session.status)

  return (
    <div
      onClick={() => navigate(ROUTES.RESEARCH_WORKSPACE.replace(':sessionId', session.id))}
      className="group cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {cfg && (
              <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', cfg.badge)}>
                <StatusIcon className={cn('h-3 w-3', isActive && 'animate-spin')} />
                {cfg.label}
              </span>
            )}
            <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
              {DEPTH_LABEL[session.config.depth]}
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">
            {session.config.topic}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatElapsed(session.elapsedSeconds)}
            </span>
            <span>{session.agents.filter(a => a.status === 'completed').length}/{session.agents.length} agents</span>
            <span>{session.sources.length} sources</span>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary-500 transition-colors shrink-0 mt-1" />
      </div>

      {/* Mini progress bar */}
      {session.status !== 'idle' && (
        <div className="mt-3 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              session.status === 'completed' ? 'bg-green-500' : 'bg-primary-500',
            )}
            style={{ width: `${session.progress}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default function ResearchPage() {
  const navigate = useNavigate()
  const sessions = useResearchStore(s => Object.values(s.sessions))
  const sorted = [...sessions].sort((a, b) => {
    const ta = a.startedAt ? new Date(a.startedAt).getTime() : 0
    const tb = b.startedAt ? new Date(b.startedAt).getTime() : 0
    return tb - ta
  })

  const active    = sorted.filter(s => ['planning', 'researching', 'writing', 'reviewing', 'paused'].includes(s.status))
  const completed = sorted.filter(s => s.status === 'completed')
  const other     = sorted.filter(s => ['cancelled', 'failed', 'idle'].includes(s.status))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Research</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Multi-agent deep research sessions
          </p>
        </div>
        <button
          onClick={() => navigate(ROUTES.RESEARCH_NEW)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          New Research
        </button>
      </div>

      {/* Empty state */}
      {sessions.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 py-20 text-center">
          <Microscope className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-2">No research sessions yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
            Start a new research session to let multi-agent AI perform deep analysis on any topic.
          </p>
          <button
            onClick={() => navigate(ROUTES.RESEARCH_NEW)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Start First Research
          </button>
        </div>
      )}

      {/* Active sessions */}
      {active.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Active ({active.length})
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {active.map(s => <SessionCard key={s.id} session={s} />)}
          </div>
        </section>
      )}

      {/* Completed sessions */}
      {completed.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Completed ({completed.length})
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {completed.map(s => <SessionCard key={s.id} session={s} />)}
          </div>
        </section>
      )}

      {/* Other sessions */}
      {other.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Other ({other.length})
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {other.map(s => <SessionCard key={s.id} session={s} />)}
          </div>
        </section>
      )}
    </div>
  )
}