import { MessageSquare } from 'lucide-react'

export default function ChatPage() {
  return (
    <div>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Chat</h2>
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          Converse with your AI research assistant
        </p>
      </div>

      <div className='flex h-[calc(100vh-14rem)] flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden'>
        {/* Messages area */}
        <div className='flex flex-1 flex-col items-center justify-center p-8 text-center'>
          <MessageSquare className='h-12 w-12 text-gray-300 dark:text-gray-600 mb-4' />
          <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
            No conversations yet
          </p>
          <p className='mt-1 text-xs text-gray-400 dark:text-gray-500'>
            Start a conversation below
          </p>
        </div>

        {/* Input area */}
        <div className='border-t border-gray-200 dark:border-gray-700 p-4'>
          <div className='flex items-center gap-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-3'>
            <input
              type='text'
              placeholder='Type your message…'
              className='flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none'
            />
            <button className='rounded-lg bg-primary-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors'>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
