import { useRef, useEffect, useState, useCallback } from 'react'
import { Send, Paperclip, StopCircle } from 'lucide-react'
import { cn } from '@/utils/helpers'

const MAX_CHARS = 4000

interface PromptInputProps {
  onSend: (text: string) => void
  isStreaming: boolean
  onStop?: () => void
  disabled?: boolean
  placeholder?: string
}

export default function PromptInput({
  onSend,
  isStreaming,
  onStop,
  disabled,
  placeholder = 'Ask anything about your research…',
}: PromptInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const remaining = MAX_CHARS - value.length
  const canSend = value.trim().length > 0 && !isStreaming && !disabled && remaining >= 0

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'
  }, [value])

  const handleSend = useCallback(() => {
    if (!canSend) return
    onSend(value.trim())
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.focus()
    }
  }, [canSend, onSend, value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className='border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3'>
      <div
        className={cn(
          'flex items-end gap-2 rounded-xl border bg-white dark:bg-gray-800 px-3 py-2.5 shadow-sm transition-shadow',
          isStreaming || disabled
            ? 'border-gray-200 dark:border-gray-700'
            : 'border-gray-300 dark:border-gray-600 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-200 dark:focus-within:ring-primary-900/40',
        )}
      >
        {/* Attachment placeholder */}
        <button
          type='button'
          disabled={isStreaming || disabled}
          title='Attach file (coming soon)'
          className='shrink-0 rounded-lg p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:pointer-events-none'
        >
          <Paperclip className='h-4 w-4' />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, MAX_CHARS))}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={isStreaming ? 'AI is responding…' : placeholder}
          aria-label='Message input'
          className={cn(
            'flex-1 resize-none bg-transparent text-sm text-gray-900 dark:text-white',
            'placeholder:text-gray-400 outline-none leading-relaxed',
            'min-h-[24px] max-h-[200px] overflow-y-auto',
            'disabled:opacity-50',
          )}
        />

        {/* Character counter (shows when close to limit) */}
        {value.length > MAX_CHARS * 0.8 && (
          <span
            className={cn(
              'shrink-0 text-xs tabular-nums',
              remaining < 100 ? 'text-red-500' : 'text-gray-400',
            )}
          >
            {remaining}
          </span>
        )}

        {/* Stop / Send button */}
        {isStreaming ? (
          <button
            type='button'
            onClick={onStop}
            title='Stop generating'
            className='shrink-0 rounded-lg bg-red-500 p-2 text-white hover:bg-red-600 transition-colors'
          >
            <StopCircle className='h-4 w-4' />
          </button>
        ) : (
          <button
            type='button'
            onClick={handleSend}
            disabled={!canSend}
            title='Send message (Enter)'
            className={cn(
              'shrink-0 rounded-lg p-2 transition-colors',
              canSend
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed',
            )}
          >
            <Send className='h-4 w-4' />
          </button>
        )}
      </div>

      {/* Hint */}
      <p className='mt-1.5 text-center text-xs text-gray-400 dark:text-gray-500'>
        Press <kbd className='rounded border border-gray-300 dark:border-gray-600 px-1 py-0.5 font-mono text-[10px]'>Enter</kbd> to send ·{' '}
        <kbd className='rounded border border-gray-300 dark:border-gray-600 px-1 py-0.5 font-mono text-[10px]'>Shift+Enter</kbd> for new line
      </p>
    </div>
  )
}
