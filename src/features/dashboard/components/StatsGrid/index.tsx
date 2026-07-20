import {
  Microscope,
  FileText,
  BookOpen,
  Quote,
  Zap,
  Bot,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react'
import { cn } from '@/utils/helpers'
import Skeleton from '@/components/common/Skeleton'
import type { DashboardStats, StatItem } from '../../types'

const ICONS: Record<string, React.ElementType> = {
  sessions:   Microscope,
  docs:       FileText,
  reports:    BookOpen,
  citations:  Quote,
  tokens:     Zap,
  agents:     Bot,
}

const COLORS: Record<string, { bg: string; icon: string }> = {
  sessions:   { bg: 'bg-blue-50 dark:bg-blue-900/20',    icon: 'text-blue-600 dark:text-blue-400' },
  docs:       { bg: 'bg-violet-50 dark:bg-violet-900/20', icon: 'text-violet-600 dark:text-violet-400' },
  reports:    { bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: 'text-emerald-600 dark:text-emerald-400' },
  citations:  { bg: 'bg-amber-50 dark:bg-amber-900/20',  icon: 'text-amber-600 dark:text-amber-400' },
  tokens:     { bg: 'bg-pink-50 dark:bg-pink-900/20',    icon: 'text-pink-600 dark:text-pink-400' },
  agents:     { bg: 'bg-cyan-50 dark:bg-cyan-900/20',    icon: 'text-cyan-600 dark:text-cyan-400' },
}

function StatCard({ stat }: { stat: StatItem }) {
  const Icon = ICONS[stat.id] ?? Microscope
  const color = COLORS[stat.id] ?? COLORS.sessions
  const TrendIcon =
    stat.trendDirection === 'up'
      ? TrendingUp
      : stat.trendDirection === 'down'
      ? TrendingDown
      : Minus

  return (
    <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 transition-shadow hover:shadow-md'>
      <div className='flex items-start justify-between'>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-medium text-gray-500 dark:text-gray-400 truncate'>
            {stat.label}
          </p>
          <p className='mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white'>
            {stat.value}
            {stat.unit && <span className='text-lg font-medium ml-0.5'>{stat.unit}</span>}
          </p>
        </div>
        <div className={cn('rounded-xl p-2.5 shrink-0', color.bg)}>
          <Icon className={cn('h-5 w-5', color.icon)} aria-hidden='true' />
        </div>
      </div>

      {stat.trend !== undefined && (
        <div className='mt-3 flex items-center gap-1.5'>
          <TrendIcon
            className={cn(
              'h-3.5 w-3.5',
              stat.trendDirection === 'up'   && 'text-green-500',
              stat.trendDirection === 'down' && 'text-red-500',
              stat.trendDirection === 'neutral' && 'text-gray-400',
            )}
            aria-hidden='true'
          />
          <span
            className={cn(
              'text-xs font-semibold',
              stat.trendDirection === 'up'   && 'text-green-600 dark:text-green-400',
              stat.trendDirection === 'down' && 'text-red-600 dark:text-red-400',
              stat.trendDirection === 'neutral' && 'text-gray-500',
            )}
          >
            {stat.trend > 0 ? '+' : ''}{stat.trend}%
          </span>
          <span className='text-xs text-gray-400 dark:text-gray-500'>vs last month</span>
        </div>
      )}
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5'>
      <div className='flex items-start justify-between'>
        <div className='flex-1 space-y-2'>
          <Skeleton width='60%' height={14} />
          <Skeleton width='40%' height={28} />
        </div>
        <Skeleton variant='rect' width={40} height={40} className='rounded-xl' />
      </div>
      <Skeleton width='50%' height={12} className='mt-3' />
    </div>
  )
}

interface StatsGridProps {
  stats?: DashboardStats
  isLoading: boolean
  isError: boolean
}

export default function StatsGrid({ stats, isLoading, isError }: StatsGridProps) {
  if (isLoading) {
    return (
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
    )
  }

  if (isError || !stats) {
    return (
      <div className='rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-5 text-sm text-red-600 dark:text-red-400'>
        Failed to load statistics. Please refresh the page.
      </div>
    )
  }

  const items = [
    stats.researchSessions,
    stats.documentsUploaded,
    stats.reportsGenerated,
    stats.citationsCollected,
    stats.tokensUsed,
    stats.aiAgentsRun,
  ]

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
      {items.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
    </div>
  )
}
