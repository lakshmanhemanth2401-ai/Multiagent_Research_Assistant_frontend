import { BarChart3, MessageSquare, Microscope, FileText } from 'lucide-react'

const stats = [
  { label: 'Research Sessions', value: '0', icon: Microscope, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  { label: 'Chat Conversations', value: '0', icon: MessageSquare, color: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20' },
  { label: 'Reports Generated', value: '0', icon: FileText, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
  { label: 'Tokens Used', value: '0', icon: BarChart3, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
]

export default function DashboardPage() {
  return (
    <div>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Dashboard</h2>
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          Overview of your research activity
        </p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {stats.map((stat) => (
          <div
            key={stat.label}
            className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5'
          >
            <div className='flex items-center justify-between'>
              <p className='text-sm font-medium text-gray-500 dark:text-gray-400'>{stat.label}</p>
              <div className={'rounded-lg p-2 ' + stat.color}>
                <stat.icon className='h-5 w-5' />
              </div>
            </div>
            <p className='mt-3 text-3xl font-bold text-gray-900 dark:text-white'>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Placeholder activity */}
      <div className='mt-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6'>
        <h3 className='text-base font-semibold text-gray-900 dark:text-white mb-4'>
          Recent Activity
        </h3>
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <BarChart3 className='h-10 w-10 text-gray-300 dark:text-gray-600 mb-3' />
          <p className='text-sm text-gray-500 dark:text-gray-400'>No activity yet</p>
          <p className='mt-1 text-xs text-gray-400 dark:text-gray-500'>
            Start a research session or chat to see activity here
          </p>
        </div>
      </div>
    </div>
  )
}
