import { cn } from '@/utils/helpers'

interface AuthCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export default function AuthCard({ title, subtitle, children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg border border-gray-100 dark:border-gray-700',
        className,
      )}
    >
      <div className='mb-6'>
        <h2 className='text-xl font-bold text-gray-900 dark:text-white'>{title}</h2>
        {subtitle && (
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  )
}
