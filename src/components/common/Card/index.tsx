import { cn } from '@/utils/helpers'

export interface CardProps {
  className?: string
  children: React.ReactNode
  hoverable?: boolean
  bordered?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export interface CardHeaderProps {
  className?: string
  children: React.ReactNode
  action?: React.ReactNode
}

export interface CardBodyProps {
  className?: string
  children: React.ReactNode
}

export interface CardFooterProps {
  className?: string
  children: React.ReactNode
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
}

function Card({ className, children, hoverable, padding = 'none' }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
        'overflow-hidden',
        hoverable && 'transition-shadow hover:shadow-md cursor-pointer',
        paddingMap[padding],
        className,
      )}
    >
      {children}
    </div>
  )
}

function CardHeader({ className, children, action }: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 px-5 py-4',
        className,
      )}
    >
      <div className="flex-1 min-w-0">{children}</div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

function CardBody({ className, children }: CardBodyProps) {
  return <div className={cn('p-5', className)}>{children}</div>
}

function CardFooter({ className, children }: CardFooterProps) {
  return (
    <div
      className={cn(
        'border-t border-gray-200 dark:border-gray-700 px-5 py-4',
        className,
      )}
    >
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Body   = CardBody
Card.Footer = CardFooter

export default Card
