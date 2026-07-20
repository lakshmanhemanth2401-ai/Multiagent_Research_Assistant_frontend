import {
  Microscope, CheckCircle2, BookOpen, Upload, AlertTriangle, LogOut, Activity,
} from 'lucide-react'
import { cn } from '@/utils/helpers'
import { formatRelativeTime } from '@/utils/formatters'
import Skeleton from '@/components/common/Skeleton'
import type { ActivityItem, ActivityType } from '../../types'

const ACTIVITY_CONFIG: Record<ActivityType, { Icon: React.ElementType; color: string; bg: string }> = {
  research_started:   { Icon: Microscope,   color: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-50 dark:bg-blue-900/20' },
  research_completed: { Icon: CheckCircle2, color: 'text-green-600 dark:text-green-400',  bg: 'bg-green-50 dark:bg-green-900/20' },
  report_generated:   { Icon: BookOpen,     color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/20' },
  document_uploaded:  { Icon: Upload,       color: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-50 dark:bg-amber-900/20' },
  agent_error:        { Icon: AlertTriangle, color: 'text-red-600 dark:text-red-400',     bg: 'bg-red-50 dark:bg-red-900/20' },
  session_expired:    { Icon: LogOut,       color: 'text-gray-600 dark:text-gray-400',   bg: 'bg-gray-100 dark:bg-gray-700' },
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const { Icon, color, bg } = ACTIVITY_CONFIG[item.type]

  return (
    <div className='flex items-start gap-3 py-3 first:pt-0 last:pb-0'>
      <div className={cn('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg', bg)}>
        <Icon className={cn('h-3.5 w-3.5', color)} aria-hidden='true' />
      </div>
      <div className='min-w-0 flex-1'>
        <p className='text-sm font-medium text-gray-900 dark:text-white'>{item.title}</p>
        <p className='mt-0.5 text-xs text-gray-500 dark:text-gray-400'>{item.description}</p>
      </div>
      <time
        dateTime={item.timestamp}
        className='shrink-0 text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap'
      >
        {formatRelativeTime(item.timestamp)}
      </time>
    </div>
  )
}

function ActivitySkeleton() {
  return (
    <div className='flex items-start gap-3 py-3'>
      <Skeleton variant='rect' width={28} height={28} className='rounded-lg shrink-0' />
      <div className='flex-1 space-y-1.5'>
        <Skeleton width='55%' height={13} />
        <Skeleton width='80%' height={11} />
      </div>
      <Skeleton width={60} height={11} className='shrink-0' />
    </div>
  )
}

interface Props {
  items?: ActivityItem[]
  isLoading: boolean
  isError: boolean
}

export default function ActivityFeedWidget({ items, isLoading, isError }: Props) {
  return (
    <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
      <div className='border-b border-gray-200 dark:border-gray-700 px-5 py-4'>
        <h2 className='text-base font-semibold text-gray-900 dark:text-white'>Recent Activity</h2>
      </div>

      <div className='divide-y divide-gray-100 dark:divide-gray-700/50 px-5'>
        {isLoading && Array.from({ length: 5 }).map((_, i) => <ActivitySkeleton key={i} />)}

        {isError && (
          <p className='py-8 text-center text-sm text-red-500'>Failed to load activity.</p>
        )}

        {!isLoading && !isError && (!items || items.length === 0) && (
          <div className='flex flex-col items-center justify-center py-10 text-center'>
            <Activity className='h-9 w-9 text-gray-300 dark:text-gray-600 mb-3' aria-hidden='true' />
            <p className='text-sm text-gray-500 dark:text-gray-400'>No activity yet</p>
          </div>
        )}

        {!isLoading && items?.map((item) => <ActivityRow key={item.id} item={item} />)}
      </div>
    </div>
  )
}
