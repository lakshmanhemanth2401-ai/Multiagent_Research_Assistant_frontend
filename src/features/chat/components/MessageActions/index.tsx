import { useState } from 'react'
import { Copy, Check, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface MessageActionsProps {
  content: string
  role: 'user' | 'assistant'
  onRegenerate?: () => void
  className?: string
}

export default function MessageActions({ content, role, onRegenerate, className }: MessageActionsProps) {
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState<'up' | 'down' | null>(null)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      <button
        onClick={handleCopy}
        title={copied ? 'Copied!' : 'Copy message'}
        className='rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
      >
        {copied ? <Check className='h-3.5 w-3.5 text-green-500' /> : <Copy className='h-3.5 w-3.5' />}
      </button>

      {role === 'assistant' && (
        <>
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              title='Regenerate response'
              className='rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
            >
              <RefreshCw className='h-3.5 w-3.5' />
            </button>
          )}
          <button
            onClick={() => setLiked(liked === 'up' ? null : 'up')}
            title='Good response'
            className={cn(
              'rounded p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700',
              liked === 'up' ? 'text-green-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
            )}
          >
            <ThumbsUp className='h-3.5 w-3.5' />
          </button>
          <button
            onClick={() => setLiked(liked === 'down' ? null : 'down')}
            title='Bad response'
            className={cn(
              'rounded p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700',
              liked === 'down' ? 'text-red-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
            )}
          >
            <ThumbsDown className='h-3.5 w-3.5' />
          </button>
        </>
      )}
    </div>
  )
}
