import { FileText, Download } from 'lucide-react'

export default function ReportsPage() {
  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Reports</h2>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            View and export your research reports
          </p>
        </div>
        <button className='flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors'>
          <Download className='h-4 w-4' />
          Export
        </button>
      </div>

      <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6'>
        <div className='flex flex-col items-center justify-center py-12 text-center'>
          <FileText className='h-10 w-10 text-gray-300 dark:text-gray-600 mb-3' />
          <p className='text-sm text-gray-500 dark:text-gray-400'>No reports yet</p>
          <p className='mt-1 text-xs text-gray-400 dark:text-gray-500'>
            Complete a research session to generate a report
          </p>
        </div>
      </div>
    </div>
  )
}
