import { cn } from '@/utils/helpers'
import { User } from 'lucide-react'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: AvatarSize
  className?: string
  status?: 'online' | 'offline' | 'busy' | 'away'
}

const sizeMap: Record<AvatarSize, { container: string; text: string; icon: string; status: string }> = {
  xs: { container: 'h-6 w-6',   text: 'text-[10px]', icon: 'h-3 w-3', status: 'h-1.5 w-1.5' },
  sm: { container: 'h-8 w-8',   text: 'text-xs',     icon: 'h-4 w-4', status: 'h-2 w-2' },
  md: { container: 'h-10 w-10', text: 'text-sm',      icon: 'h-5 w-5', status: 'h-2.5 w-2.5' },
  lg: { container: 'h-12 w-12', text: 'text-base',    icon: 'h-6 w-6', status: 'h-3 w-3' },
  xl: { container: 'h-16 w-16', text: 'text-xl',      icon: 'h-8 w-8', status: 'h-3.5 w-3.5' },
}

const statusColors: Record<NonNullable<AvatarProps['status']>, string> = {
  online:  'bg-green-500',
  offline: 'bg-gray-400',
  busy:    'bg-red-500',
  away:    'bg-amber-500',
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function Avatar({ src, alt, name, size = 'md', className, status }: AvatarProps) {
  const s = sizeMap[size]

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div
        className={cn(
          'flex items-center justify-center overflow-hidden rounded-full select-none',
          'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300',
          s.container,
        )}
      >
        {src ? (
          <img src={src} alt={alt ?? name ?? 'Avatar'} className="h-full w-full object-cover" />
        ) : name ? (
          <span className={cn('font-semibold leading-none', s.text)}>{getInitials(name)}</span>
        ) : (
          <User className={s.icon} />
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-white dark:ring-gray-900',
            s.status,
            statusColors[status],
          )}
          aria-label={status}
        />
      )}
    </div>
  )
}
