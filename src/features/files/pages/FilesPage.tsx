import { FolderOpen, Upload, Search } from 'lucide-react'

export default function FilesPage() {
  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Files</h2>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            Manage your uploaded research documents
          </p>
        </div>
        <button className='flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors'>
          <Upload className='h-4 w-4' />
          Upload
        </button>
      </div>

      {/* Search */}
      <div className='mb-4 flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5'>
        <Search className='h-4 w-4 shrink-0 text-gray-400' />
        <input
          type='text'
          placeholder='Search files…'
          className='flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none'
        />
      </div>

      {/* Drop zone / empty state */}
      <div className='rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-12'>
        <div className='flex flex-col items-center justify-center text-center'>
          <FolderOpen className='h-12 w-12 text-gray-300 dark:text-gray-600 mb-4' />
          <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
            No files uploaded yet
          </p>
          <p className='mt-1 text-xs text-gray-400 dark:text-gray-500'>
            Drop files here or click Upload to get started
          </p>
        </div>
      </div>
    </div>
  )
}
