import {
  Lightbulb, Globe, FileSearch, ShieldCheck, PenLine,
  Quote, Star, CheckCircle2, AlertCircle,
} from 'lucide-react'
import { cn } from '@/utils/helpers'
import type { TimelineEvent, TimelineEventType } from '@/types/research'

const EVENT_CONFIG: Record<TimelineEventType, {
  icon: React.ElementType
  color: string
  ring: string
}> = {
  query_planned:     { icon: Lightbulb,   color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',  ring: 'ring-violet-200 dark:ring-violet-800' },
  web_searching:     { icon: Globe,       color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',          ring: 'ring-blue-200 dark:ring-blue-800' },
  source_found:      { icon: FileSearch,  color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',          ring: 'ring-cyan-200 dark:ring-cyan-800' },
  doc_analyzed:      { icon: FileSearch,  color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',         ring: 'ring-teal-200 dark:ring-teal-800' },
  fact_verified:     { icon: ShieldCheck, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',     ring: 'ring-green-200 dark:ring-green-800' },
  writing:           { icon: PenLine,     color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',     ring: 'ring-amber-200 dark:ring-amber-800' },
  citation_generated:{ icon: Quote,       color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',         ring: 'ring-pink-200 dark:ring-pink-800' },
  reviewing:         { icon: Star,        color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400', ring: 'ring-orange-200 dark:ring-orange-800' },
  completed:         { icon: CheckCircle2,color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400', ring: 'ring-emerald-200 dark:ring-emerald-800' },
  error:             { icon: AlertCircle, color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',             ring: 'ring-red-200 dark:ring-red-800' },
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

interface ResearchTimelineProps {
  events: TimelineEvent[]
}

export default function ResearchTimeline({ events }: ResearchTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Lightbulb className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Timeline events will appear here as research progresses.</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />

      <div className="space-y-4">
        {events.map((event, idx) => {
          const cfg = EVENT_CONFIG[event.type]
          const Icon = cfg.icon
          const isLatest = idx === events.length - 1

          return (
            <div key={event.id} className="relative flex gap-4">
              {/* Icon bubble */}
              <div className={cn(
                'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4 ring-white dark:ring-gray-800',
                cfg.color.split(' ').slice(0, 2).join(' '),
                cfg.ring,
                isLatest && 'ring-2 ring-offset-2',
              )}>
                <Icon className="h-4 w-4" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{event.title}</p>
                  <time className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                    {formatTime(event.timestamp)}
                  </time>
                </div>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {event.description}
                </p>
                <span className="mt-1 inline-block text-xs text-gray-400 dark:text-gray-500 italic capitalize">
                  {event.agentRole.replace('_', ' ')} Agent
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
