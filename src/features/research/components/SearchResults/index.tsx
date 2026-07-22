import { Lightbulb, ShieldCheck, Star, Brain, AlertCircle } from 'lucide-react'
import { cn } from '@/utils/helpers'
import type { Finding, FindingConfidence, AgentRole } from '@/types/research'

const CONFIDENCE_CONFIG: Record<FindingConfidence, { label: string; badge: string }> = {
  low:      { label: 'Low confidence',      badge: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400' },
  medium:   { label: 'Medium confidence',   badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  high:     { label: 'High confidence',     badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  verified: { label: 'Verified',            badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
}

const CONFIDENCE_ICON: Record<FindingConfidence, React.ElementType> = {
  low:      AlertCircle,
  medium:   Lightbulb,
  high:     Star,
  verified: ShieldCheck,
}

const AGENT_COLOR: Record<AgentRole, string> = {
  planner:    'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  researcher: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  web_search: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  critic:     'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  writer:     'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  citation:   'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  reviewer:   'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

interface FindingsPanelProps {
  findings: Finding[]
}

export default function FindingsPanel({ findings }: FindingsPanelProps) {
  if (findings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Brain className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Intermediate findings will appear here as agents complete their tasks.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {findings.length} finding{findings.length !== 1 ? 's' : ''} from {new Set(findings.map(f => f.agentRole)).size} agents
      </p>
      <div className="space-y-3">
        {findings.map(finding => {
          const confCfg = CONFIDENCE_CONFIG[finding.confidence]
          const ConfIcon = CONFIDENCE_ICON[finding.confidence]
          return (
            <div
              key={finding.id}
              className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', AGENT_COLOR[finding.agentRole])}>
                    {finding.agentRole.replace('_', ' ')}
                  </span>
                  <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', confCfg.badge)}>
                    <ConfIcon className="h-3 w-3" />
                    {confCfg.label}
                  </span>
                </div>
                <time className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                  {formatTime(finding.timestamp)}
                </time>
              </div>

              {/* Title */}
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5">
                {finding.title}
              </h4>

              {/* Content */}
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {finding.content}
              </p>

              {/* Related sources */}
              {finding.relatedSourceIds.length > 0 && (
                <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  {finding.relatedSourceIds.length} related source{finding.relatedSourceIds.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
