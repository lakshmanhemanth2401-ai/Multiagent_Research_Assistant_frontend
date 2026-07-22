import { useState } from 'react'
import {
  ChevronDown, ChevronUp, Clock, CheckCircle2, XCircle, Loader2,
  RotateCcw, AlertTriangle, Brain, Search, Globe, PenLine,
  Quote, Eye, Cpu, ShieldCheck,
} from 'lucide-react'
import { cn } from '@/utils/helpers'
import type { ResearchAgent, AgentStatus, AgentRole } from '@/types/research'

const AGENT_ICONS: Record<AgentRole, React.ElementType> = {
  planner:    Brain,
  researcher: Search,
  web_search: Globe,
  critic:     ShieldCheck,
  writer:     PenLine,
  citation:   Quote,
  reviewer:   Eye,
}

const STATUS_CONFIG: Record<AgentStatus, {
  label: string
  badge: string
  dot: string
  ring: string
  pulse: boolean
}> = {
  waiting:   { label: 'Waiting',   badge: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',     dot: 'bg-gray-400',           ring: 'border-gray-200 dark:border-gray-700', pulse: false },
  running:   { label: 'Running',   badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',   dot: 'bg-blue-500',           ring: 'border-blue-300 dark:border-blue-700', pulse: true  },
  completed: { label: 'Completed', badge: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', dot: 'bg-green-500',         ring: 'border-green-200 dark:border-green-700', pulse: false },
  failed:    { label: 'Failed',    badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',       dot: 'bg-red-500',            ring: 'border-red-300 dark:border-red-700',   pulse: false },
  retrying:  { label: 'Retrying',  badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', dot: 'bg-amber-500',       ring: 'border-amber-300 dark:border-amber-700', pulse: true },
  skipped:   { label: 'Skipped',   badge: 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500',      dot: 'bg-gray-300',          ring: 'border-gray-200 dark:border-gray-700', pulse: false },
}

const ACTIVITY_COLORS: Record<string, string> = {
  info:    'text-blue-500',
  success: 'text-green-500',
  warning: 'text-amber-500',
  error:   'text-red-500',
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
}

interface AgentCardProps {
  agent: ResearchAgent
  onRetry?: (role: AgentRole) => void
}

export default function AgentCard({ agent, onRetry }: AgentCardProps) {
  const [expanded, setExpanded] = useState(false)
  const cfg = STATUS_CONFIG[agent.status]
  const Icon = AGENT_ICONS[agent.role]

  const pct = agent.targetDuration > 0
    ? Math.min(100, Math.round((agent.durationSeconds / agent.targetDuration) * 100))
    : 0

  return (
    <div className={cn(
      'rounded-xl border-2 bg-white dark:bg-gray-800 overflow-hidden transition-all duration-200',
      cfg.ring,
    )}>
      {/* Header row */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
            agent.status === 'running' || agent.status === 'retrying'
              ? 'bg-blue-100 dark:bg-blue-900/30'
              : agent.status === 'completed'
              ? 'bg-green-100 dark:bg-green-900/30'
              : agent.status === 'failed'
              ? 'bg-red-100 dark:bg-red-900/30'
              : 'bg-gray-100 dark:bg-gray-700',
          )}>
            {agent.status === 'running' || agent.status === 'retrying' ? (
              <Loader2 className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin" />
            ) : agent.status === 'completed' ? (
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : agent.status === 'failed' ? (
              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            ) : (
              <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            )}
          </div>

          {/* Name + status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{agent.name}</span>
              <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', cfg.badge)}>
                {cfg.pulse && <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />}
                {cfg.label}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 truncate">{agent.description}</p>
          </div>
        </div>

        {/* Current task */}
        {(agent.status === 'running' || agent.status === 'retrying') && (
          <div className="mt-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 px-3 py-2">
            <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
              <Cpu className="h-3 w-3 shrink-0 animate-pulse" />
              {agent.currentTask}
            </p>
          </div>
        )}

        {agent.status === 'completed' && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic truncate">
            {agent.currentTask}
          </p>
        )}

        {/* Progress bar (while running) */}
        {(agent.status === 'running' || agent.status === 'retrying') && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-1">
              <span>{pct}% complete</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(agent.durationSeconds)} / {formatDuration(agent.targetDuration)}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}

        {/* Duration (completed) */}
        {agent.status === 'completed' && (
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
            <Clock className="h-3 w-3" />
            Completed in {formatDuration(agent.durationSeconds)}
          </div>
        )}

        {/* Actions row */}
        <div className="mt-3 flex items-center justify-between">
          {agent.status === 'failed' && onRetry ? (
            <button
              onClick={() => onRetry(agent.role)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Retry
            </button>
          ) : <span />}

          {agent.activities.length > 0 && (
            <button
              onClick={() => setExpanded(v => !v)}
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors ml-auto"
            >
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {agent.activities.length} {agent.activities.length === 1 ? 'activity' : 'activities'}
            </button>
          )}
        </div>
      </div>

      {/* Expandable activity log */}
      {expanded && agent.activities.length > 0 && (
        <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-4 py-3 space-y-2 max-h-48 overflow-y-auto">
          {agent.activities.map(act => (
            <div key={act.id} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-current" style={{ color: '' }}>
                <AlertTriangle className={cn('h-3 w-3 shrink-0 mt-0.5', ACTIVITY_COLORS[act.type])} style={{ display: 'none' }} />
              </span>
              <span className={cn('mt-0.5 text-xs shrink-0', ACTIVITY_COLORS[act.type])}>●</span>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{act.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
