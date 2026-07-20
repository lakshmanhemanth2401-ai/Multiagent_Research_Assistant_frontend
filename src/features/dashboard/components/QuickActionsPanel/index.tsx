import { Link } from 'react-router-dom'
import { Microscope, MessageSquare, Upload, FileText, Settings, LayoutDashboard } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { ROUTES } from '@/utils/constants'

interface Action {
  label: string
  description: string
  href: string
  Icon: React.ElementType
  color: string
  bg: string
}

const ACTIONS: Action[] = [
  {
    label:       'New Research',
    description: 'Start a multi-agent research session',
    href:        ROUTES.RESEARCH,
    Icon:        Microscope,
    color:       'text-blue-600 dark:text-blue-400',
    bg:          'bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30',
  },
  {
    label:       'Chat with AI',
    description: 'Ask questions across your documents',
    href:        ROUTES.CHAT,
    Icon:        MessageSquare,
    color:       'text-violet-600 dark:text-violet-400',
    bg:          'bg-violet-50 dark:bg-violet-900/20 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30',
  },
  {
    label:       'Upload Documents',
    description: 'Add PDFs, DOCX, or text files',
    href:        ROUTES.FILES,
    Icon:        Upload,
    color:       'text-amber-600 dark:text-amber-400',
    bg:          'bg-amber-50 dark:bg-amber-900/20 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30',
  },
  {
    label:       'Browse Reports',
    description: 'View and export generated reports',
    href:        ROUTES.REPORTS,
    Icon:        FileText,
    color:       'text-emerald-600 dark:text-emerald-400',
    bg:          'bg-emerald-50 dark:bg-emerald-900/20 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30',
  },
  {
    label:       'Dashboard',
    description: 'Return to your home overview',
    href:        ROUTES.DASHBOARD,
    Icon:        LayoutDashboard,
    color:       'text-pink-600 dark:text-pink-400',
    bg:          'bg-pink-50 dark:bg-pink-900/20 group-hover:bg-pink-100 dark:group-hover:bg-pink-900/30',
  },
  {
    label:       'Settings',
    description: 'Manage preferences and API keys',
    href:        ROUTES.SETTINGS,
    Icon:        Settings,
    color:       'text-gray-600 dark:text-gray-400',
    bg:          'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600',
  },
]

export default function QuickActionsPanel() {
  return (
    <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
      <div className='border-b border-gray-200 dark:border-gray-700 px-5 py-4'>
        <h2 className='text-base font-semibold text-gray-900 dark:text-white'>Quick Actions</h2>
      </div>

      <div className='grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3'>
        {ACTIONS.map((action) => (
          <Link
            key={action.href + action.label}
            to={action.href}
            className={cn(
              'group flex flex-col items-start gap-2 rounded-xl border border-gray-100 dark:border-gray-700',
              'p-3 transition-all hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-sm',
            )}
          >
            <div className={cn('rounded-lg p-2 transition-colors', action.bg)}>
              <action.Icon className={cn('h-4 w-4', action.color)} aria-hidden='true' />
            </div>
            <div>
              <p className='text-xs font-semibold text-gray-800 dark:text-gray-200'>{action.label}</p>
              <p className='mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-tight'>
                {action.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
