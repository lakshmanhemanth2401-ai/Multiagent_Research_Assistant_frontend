import { Link } from 'react-router-dom'
import { CheckCircle2, Loader2, Clock, AlertCircle, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { ROUTES } from '@/utils/constants'
import ProgressBar from '@/components/common/ProgressBar'
import Skeleton from '@/components/common/Skeleton'
import type { AgentProgress, AgentStatus, ResearchProgressItem } from '../../types'

const AGENT_STATUS_CONFIG: Record<AgentStatus, { Icon: React.ElementType; label: string; color: string }> = {
  done:    { Icon: CheckCircle2, label: 'Done',    color: 'text-green-500' },
  running: { Icon: Loader2,      label: 'Running', color: 'text-blue-500 animate-spin' },
  idle:    { Icon: Clock,        label: 'Waiting', color: 'text-gray-400' },
  error:   { Icon: AlertCircle,  label: 'Error',   color: 'text-red-500' },
}

function AgentRow({ agent }: { agent: AgentProgress }) {
  const { Icon, label, color } = AGENT_STATUS_CONFIG[agent.status]

  return (
    <div className='flex items-center gap-3 py-2'>
      <Icon className={cn('h-4 w-4 shrink-0', color)} aria-label={label} />
      <div className='flex-1 min-w-0'>
        <div className='flex items-center justify-between gap-2'>
          <p className='text-xs font-medium text-gray-800 dark:text-gray-200 truncate'>{agent.name}</p>
          <span className='text-xs text-gray-500 dark:text-gray-400 shrink-0'>{agent.progress}%</span>
        </div>
        <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>{agent.role}</p>
        {agent.status === 'running' && (
          <ProgressBar value={agent.progress} size='xs' animated className='mt-1' />
        )}
        {agent.status === 'done' && (
          <div className='mt-1 h-1 rounded-full bg-green-200 dark:bg-green-800' />
        )}
      </div>
    </div>
  )
}

function ProgressCard({ item }: { item: ResearchProgressItem }) {
  const mins = item.estimatedTimeRemainingSeconds
    ? Math.ceil(item.estimatedTimeRemainingSeconds / 60)
    : null

  return (
    <div className='rounded-xl border border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/10 p-4'>
      <div className='flex items-start justify-between gap-2 mb-3'>
        <div className='min-w-0'>
          <p className='text-sm font-semibold text-gray-900 dark:text-white truncate'>
            {item.sessionTitle}
          </p>
          {mins && (
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              ~{mins} min remaining
            </p>
          )}
        </div>
        <span className='shrink-0 text-sm font-bold text-primary-700 dark:text-primary-300'>
          {item.overallProgress}%
        </span>
      </div>

      <ProgressBar
        value={item.overallProgress}
        size='sm'
        variant='primary'
        animated
        className='mb-4'
      />

      <div className='divide-y divide-gray-200 dark:divide-gray-700/50'>
        {item.agents.map((agent) => (
          <AgentRow key={agent.id} agent={agent} />
        ))}
      </div>

      <Link to={ROUTES.RESEARCH} className='mt-3 flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline'>
        View full details <ChevronRight className='h-3 w-3' />
      </Link>
    </div>
  )
}

interface Props {
  items?: ResearchProgressItem[]
  isLoading: boolean
  isError: boolean
}

export default function ResearchProgressWidget({ items, isLoading, isError }: Props) {
  return (
    <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
      <div className='border-b border-gray-200 dark:border-gray-700 px-5 py-4'>
        <h2 className='text-base font-semibold text-gray-900 dark:text-white'>Live Research Progress</h2>
      </div>

      <div className='p-5 space-y-4'>
        {isLoading && (
          <div className='space-y-3'>
            <Skeleton width='60%' height={14} />
            <Skeleton width='100%' height={8} className='rounded-full' />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className='flex items-center gap-3 py-1'>
                <Skeleton variant='circle' width={16} height={16} />
                <div className='flex-1 space-y-1'>
                  <Skeleton width='45%' height={12} />
                  <Skeleton width='70%' height={10} />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <p className='text-sm text-red-500'>Failed to load progress.</p>
        )}

        {!isLoading && !isError && (!items || items.length === 0) && (
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <Loader2 className='h-8 w-8 text-gray-300 dark:text-gray-600 mb-2' aria-hidden='true' />
            <p className='text-sm text-gray-500 dark:text-gray-400'>No active sessions</p>
            <p className='mt-0.5 text-xs text-gray-400 dark:text-gray-500'>
              Start a new research session to track real-time agent progress.
            </p>
          </div>
        )}

        {!isLoading && items?.map((item) => (
          <ProgressCard key={item.sessionId} item={item} />
        ))}
      </div>
    </div>
  )
}
