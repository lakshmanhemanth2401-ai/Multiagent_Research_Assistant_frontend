import { Link } from 'react-router-dom'
import { Info, CheckCircle2, AlertTriangle, AlertCircle, Bell, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { formatRelativeTime } from '@/utils/formatters'
import Skeleton from '@/components/common/Skeleton'
import type { Notification, NotificationSeverity } from '../../types'

const SEVERITY_CONFIG: Record<
  NotificationSeverity,
  { Icon: React.ElementType; iconColor: string; bg: string; border: string }
> = {
  info:    { Icon: Info,          iconColor: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-900/20',    border: 'border-blue-200 dark:border-blue-800' },
  success: { Icon: CheckCircle2,  iconColor: 'text-green-500',  bg: 'bg-green-50 dark:bg-green-900/20',  border: 'border-green-200 dark:border-green-800' },
  warning: { Icon: AlertTriangle, iconColor: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-900/20',  border: 'border-amber-200 dark:border-amber-800' },
  error:   { Icon: AlertCircle,   iconColor: 'text-red-500',    bg: 'bg-red-50 dark:bg-red-900/20',      border: 'border-red-200 dark:border-red-800' },
}

function NotificationItem({ notif }: { notif: Notification }) {
  const { Icon, iconColor, bg, border } = SEVERITY_CONFIG[notif.severity]

  return (
    <div className={cn(
      'flex items-start gap-3 rounded-lg border p-3 transition-colors',
      notif.read
        ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
        : cn(bg, border),
    )}>
      <Icon className={cn('h-4 w-4 shrink-0 mt-0.5', iconColor)} aria-hidden='true' />

      <div className='min-w-0 flex-1'>
        <div className='flex items-start justify-between gap-2'>
          <p className={cn(
            'text-sm font-medium leading-snug',
            notif.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white',
          )}>
            {notif.title}
          </p>
          {!notif.read && (
            <span className='mt-1 h-2 w-2 shrink-0 rounded-full bg-primary-500' aria-label='Unread' />
          )}
        </div>

        <p className='mt-0.5 text-xs text-gray-500 dark:text-gray-400'>{notif.message}</p>

        <div className='mt-1.5 flex items-center justify-between gap-2'>
          <time dateTime={notif.timestamp} className='text-xs text-gray-400 dark:text-gray-500'>
            {formatRelativeTime(notif.timestamp)}
          </time>
          {notif.actionLabel && notif.actionHref && (
            <Link
              to={notif.actionHref}
              className='flex items-center gap-0.5 text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline'
            >
              {notif.actionLabel}
              <ChevronRight className='h-3 w-3' aria-hidden='true' />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

function NotifSkeleton() {
  return (
    <div className='flex items-start gap-3 rounded-lg border border-gray-200 dark:border-gray-700 p-3'>
      <Skeleton variant='circle' width={16} height={16} className='mt-0.5 shrink-0' />
      <div className='flex-1 space-y-1.5'>
        <Skeleton width='55%' height={13} />
        <Skeleton width='90%' height={11} />
        <Skeleton width='30%' height={10} />
      </div>
    </div>
  )
}

interface Props {
  notifications?: Notification[]
  isLoading: boolean
  isError: boolean
}

export default function NotificationsPanel({ notifications, isLoading, isError }: Props) {
  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0

  return (
    <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
      <div className='flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-5 py-4'>
        <div className='flex items-center gap-2'>
          <h2 className='text-base font-semibold text-gray-900 dark:text-white'>Notifications</h2>
          {unreadCount > 0 && (
            <span className='flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white'>
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      <div className='p-4 space-y-2'>
        {isLoading && Array.from({ length: 3 }).map((_, i) => <NotifSkeleton key={i} />)}

        {isError && (
          <p className='py-4 text-center text-sm text-red-500'>Failed to load notifications.</p>
        )}

        {!isLoading && !isError && (!notifications || notifications.length === 0) && (
          <div className='flex flex-col items-center justify-center py-8 text-center'>
            <Bell className='h-8 w-8 text-gray-300 dark:text-gray-600 mb-2' aria-hidden='true' />
            <p className='text-sm text-gray-500 dark:text-gray-400'>All caught up!</p>
          </div>
        )}

        {!isLoading && notifications?.map((n) => (
          <NotificationItem key={n.id} notif={n} />
        ))}
      </div>
    </div>
  )
}
