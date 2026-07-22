import { Pause, Play, XCircle, Clock, CheckCircle2, AlertCircle, Ban } from 'lucide-react'
import { cn } from '@/utils/helpers'
import type { ResearchSession, ResearchStatus } from '@/types/research'

const STATUS_CONFIG: Record<ResearchStatus, { label: string; badge: string; dot: string }> = {
  idle:        { label: 'Idle',        badge: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',                 dot: 'bg-gray-400' },
  planning:    { label: 'Planning',    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',       dot: 'bg-violet-500' },
  researching: { label: 'Researching', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',               dot: 'bg-blue-500' },
  writing:     { label: 'Writing',     badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',           dot: 'bg-amber-500' },
  reviewing:   { label: 'Reviewing',   badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',       dot: 'bg-orange-500' },
  completed:   { label: 'Completed',   badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',           dot: 'bg-green-500' },
  failed:      { label: 'Failed',      badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',                   dot: 'bg-red-500' },
  paused:      { label: 'Paused',      badge: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',                  dot: 'bg-gray-500' },
  cancelled:   { label: 'Cancelled',   badge: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',                  dot: 'bg-gray-400' },
}

const RUNNING_STATUSES: ResearchStatus[] = ['planning', 'researching', 'writing', 'reviewing']

function formatElapsed(secs: number): string {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const DEPTH_LABEL = { quick: 'Quick', standard: 'Standard', deep: 'Deep' }

interface WorkspaceHeaderProps {
  session: ResearchSession
  onPause:  () => void
  onResume: () => void
  onCancel: () => void
}

export default function WorkspaceHeader({ session, onPause, onResume, onCancel }: WorkspaceHeaderProps) {
  const cfg = STATUS_CONFIG[session.status]
  const isRunning = RUNNING_STATUSES.includes(session.status)
  const isPaused  = session.status === 'paused'
  const isDone    = session.status === 'completed'
  const isCancelled = session.status === 'cancelled'

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-sm">
      {/* Row 1: title + status + controls */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        {/* Left: title + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap mb-1">
            {/* Status badge */}
            <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium', cfg.badge)}>
              <span className={cn(
                'h-1.5 w-1.5 rounded-full',
                cfg.dot,
                isRunning && 'animate-pulse',
              )} />
              {cfg.label}
            </span>

            {/* Depth badge */}
            <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
              {DEPTH_LABEL[session.config.depth]} Research
            </span>
          </div>

          <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">
            {session.config.topic}
          </h1>
        </div>

        {/* Right: controls */}
        <div className="flex items-center gap-2 shrink-0">
          {isRunning && (
            <button
              onClick={onPause}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Pause className="h-3.5 w-3.5" />
              Pause
            </button>
          )}
          {isPaused && (
            <button
              onClick={onResume}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
            >
              <Play className="h-3.5 w-3.5" />
              Resume
            </button>
          )}
          {(isRunning || isPaused) && (
            <button
              onClick={onCancel}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-300 dark:border-red-700 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <XCircle className="h-3.5 w-3.5" />
              Cancel
            </button>
          )}
          {isDone && (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-green-100 dark:bg-green-900/30 px-3 py-1.5 text-sm font-medium text-green-700 dark:text-green-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Research complete
            </span>
          )}
          {isCancelled && (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 dark:bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300">
              <Ban className="h-3.5 w-3.5" />
              Cancelled
            </span>
          )}
          {session.status === 'failed' && (
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-red-100 dark:bg-red-900/30 px-3 py-1.5 text-sm font-medium text-red-700 dark:text-red-300">
              <AlertCircle className="h-3.5 w-3.5" />
              Failed
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {isDone ? 'Research complete' : isPaused ? 'Paused' : `${session.progress}% complete`}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3" />
            Elapsed: {formatElapsed(session.elapsedSeconds)}
          </div>
        </div>
        <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-1000',
              isDone ? 'bg-green-500' : isCancelled ? 'bg-gray-400' : 'bg-primary-500',
              isRunning && 'bg-gradient-to-r from-primary-500 to-primary-400',
            )}
            style={{ width: `${isDone ? 100 : session.progress}%` }}
          />
        </div>
      </div>

      {/* Agents mini-progress row */}
      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
        {session.agents.map(agent => (
          <div
            key={agent.id}
            title={`${agent.name}: ${agent.status}`}
            className={cn(
              'h-2 flex-1 min-w-[20px] rounded-full transition-colors duration-500',
              agent.status === 'completed' && 'bg-green-400',
              (agent.status === 'running' || agent.status === 'retrying') && 'bg-primary-400 animate-pulse',
              agent.status === 'waiting' && 'bg-gray-200 dark:bg-gray-700',
              agent.status === 'failed' && 'bg-red-400',
              agent.status === 'paused' && 'bg-gray-300',
            )}
          />
        ))}
        <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">
          {session.agents.filter(a => a.status === 'completed').length}/{session.agents.length} agents
        </span>
      </div>
    </div>
  )
}
