import { Microscope, Zap } from 'lucide-react'

export default function ResearchPage() {
  return (
    <div>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Research</h2>
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          Run multi-agent research sessions
        </p>
      </div>

      {/* New session card */}
      <div className='mb-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-6'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='rounded-lg bg-blue-50 dark:bg-blue-900/20 p-2 text-blue-600'>
            <Zap className='h-5 w-5' />
          </div>
          <div>
            <h3 className='text-sm font-semibold text-gray-900 dark:text-white'>New Research Session</h3>
            <p className='text-xs text-gray-500 dark:text-gray-400'>Describe what you want to research</p>
          </div>
        </div>
        <textarea
          placeholder='Enter your research query or topic…'
          rows={3}
          className='w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none resize-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-shadow'
        />
        <div className='mt-3 flex justify-end'>
          <button className='rounded-xl bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors'>
            Start Research
          </button>
        </div>
      </div>

      {/* Sessions list placeholder */}
      <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6'>
        <h3 className='text-base font-semibold text-gray-900 dark:text-white mb-4'>Past Sessions</h3>
        <div className='flex flex-col items-center justify-center py-10 text-center'>
          <Microscope className='h-10 w-10 text-gray-300 dark:text-gray-600 mb-3' />
          <p className='text-sm text-gray-500 dark:text-gray-400'>No research sessions yet</p>
        </div>
      </div>
    </div>
  )
}
