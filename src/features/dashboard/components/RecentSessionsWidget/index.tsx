import { Link } from 'react-router-dom'
import {
  CheckCircle2, Clock, AlertCircle, ListOrdered,
  ChevronRight, Play, Eye, Microscope,
} from 'lucide-react'
import { cn } from '@/utils/helpers'
import { formatRelativeTime } from '@/utils/formatters'
import { ROUTES } from '@/utils/constants'
import Badge, { type BadgeVariant } from '@/components/common/Badge'
import Button from '@/components/common/Button'
import Skeleton from '@/components/common/Skeleton'
import ProgressBar from '@/components/common/ProgressBar'
import type { ResearchSession, ResearchStatus } from '../../types'

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ResearchStatus,
  { label: string; badge: BadgeVariant; Icon: React.ElementType }
> = {
  completed:   { label: 'Completed',   badge: 'success', Icon: CheckCircle2 },
  in_progress: { label: 'In Progress', badge: 'info',    Icon: Clock        },
  failed:      { label: 'Failed',      badge: 'danger',  Icon: AlertCircle  },
  queued:      { label: 'Queued',      badge: 'warning', Icon: ListOrdered  },
}

// ─── Session row ──────────────────────────────────────────────────────────────

function SessionRow({ session }: { session: ResearchSession }) {
  const { label, badge, Icon } = STATUS_CONFIG[session.status]

  return (
    <div className='flex items-start gap-4 py-4 first:pt-0 last:pb-0'>
      <div className='mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'>
        <Microscope className='h-4 w-4' aria-hidden='true' />
      </div>

      <div className='min-w-0 flex-1'>
        <div className='flex flex-wrap items-center gap-2'>
          <p className='text-sm font-semibold text-gray-900 dark:text-white truncate'>
            {session.title}
          </p>
          <Badge variant={badge} dot size='sm'>{label}</Badge>
        </div>

        <p className='mt-0.5 text-xs text-gray-500 dark:text-gray-400 truncate'>
          {session.topic}
        </p>

        {session.status === 'in_progress' && session.progress !== undefined && (
          <ProgressBar
            value={session.progress}
            size='xs'
            variant='primary'
            animated
            className='mt-2 max-w-xs'
          />
        )}

        <div className='mt-1.5 flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-gray-500'>
          <span className='flex items-center gap-1'>
            <Icon className='h-3 w-3' aria-hidden='true' />
            {formatRelativeTime(session.updatedAt)}
          </span>
          {session.agentsUsed > 0 && (
            <span>{session.agentsUsed} agent{session.agentsUsed !== 1 ? 's' : ''}</span>
          )}
          {session.documentsFound > 0 && (
            <span>{session.documentsFound} docs</span>
          )}
        </div>
      </div>

      <div className='flex shrink-0 items-center gap-2'>
        {session.status === 'in_progress' && (
          <Link to={ROUTES.RESEARCH} title='Continue'>
            <Button size='xs' variant='outline' leftIcon={<Play className='h-3 w-3' />}>
              Continue
            </Button>
          </Link>
        )}
        {session.status === 'completed' && (
          <Link to={ROUTES.REPORTS} title='View report'>
            <Button size='xs' variant='ghost' leftIcon={<Eye className='h-3 w-3' />}>
              View
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SessionSkeleton() {
  return (
    <div className='flex items-start gap-4 py-4'>
      <Skeleton variant='rect' width={32} height={32} className='rounded-lg shrink-0' />
      <div className='flex-1 space-y-2'>
        <Skeleton width='70%' height={14} />
        <Skeleton width='50%' height={12} />
        <Skeleton width='30%' height={10} />
      </div>
    </div>
  )
}

// ─── Widget ───────────────────────────────────────────────────────────────────

interface Props {
  sessions?: ResearchSession[]
  isLoading: boolean
  isError: boolean
}

export default function RecentSessionsWidget({ sessions, isLoading, isError }: Props) {
  return (
    <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-5 py-4'>
        <h2 className='text-base font-semibold text-gray-900 dark:text-white'>
          Recent Research Sessions
        </h2>
        <Link
          to={ROUTES.RESEARCH}
          className={cn(
            'flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400',
            'hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 rounded',
          )}
        >
          View all
          <ChevronRight className='h-3.5 w-3.5' aria-hidden='true' />
        </Link>
      </div>

      {/* Body */}
      <div className='divide-y divide-gray-100 dark:divide-gray-700/50 px-5'>
        {isLoading && Array.from({ length: 4 }).map((_, i) => <SessionSkeleton key={i} />)}

        {isError && (
          <p className='py-8 text-center text-sm text-red-500'>Failed to load sessions.</p>
        )}

        {!isLoading && !isError && (!sessions || sessions.length === 0) && (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <Microscope className='h-9 w-9 text-gray-300 dark:text-gray-600 mb-3' aria-hidden='true' />
            <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>No sessions yet</p>
            <p className='mt-1 text-xs text-gray-400 dark:text-gray-500'>
              Start your first research session to see it here.
            </p>
            <Link to={ROUTES.RESEARCH} className='mt-4'>
              <Button size='sm' leftIcon={<Microscope className='h-4 w-4' />}>
                New Research
              </Button>
            </Link>
          </div>
        )}

        {!isLoading && sessions?.map((s) => <SessionRow key={s.id} session={s} />)}
      </div>
    </div>
  )
}
