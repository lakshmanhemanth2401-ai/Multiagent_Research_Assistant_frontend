import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/utils/helpers'
import Avatar from '@/components/common/Avatar'
import { useAuthStore } from '@/store/auth.store'
import TypingIndicator from '../TypingIndicator'
import MessageActions from '../MessageActions'
import CitationList from '../CitationList'
import type { Message } from '@/types/chat'

// ─── Code block with copy ─────────────────────────────────────────────────────

function CodeBlock({ children, className }: { children?: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false)
  const isBlock = className?.startsWith('language-')
  const code = String(children).replace(/\n$/, '')
  const lang = className?.replace('language-', '') ?? ''

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isBlock) {
    return (
      <code className='rounded bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 font-mono text-[0.85em] text-gray-800 dark:text-gray-200'>
        {children}
      </code>
    )
  }

  return (
    <div className='group relative my-3 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700'>
      {/* Header bar */}
      <div className='flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 py-2'>
        <span className='text-xs font-mono text-gray-500 dark:text-gray-400'>{lang || 'code'}</span>
        <button
          onClick={handleCopy}
          className='flex items-center gap-1.5 rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
        >
          {copied ? <Check className='h-3 w-3 text-green-500' /> : <Copy className='h-3 w-3' />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className='overflow-x-auto bg-gray-50 dark:bg-gray-900 p-4'>
        <code className='font-mono text-sm text-gray-800 dark:text-gray-200'>{code}</code>
      </pre>
    </div>
  )
}

// ─── Markdown wrapper ─────────────────────────────────────────────────────────

function MdContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        code: ({ className, children, ...rest }) => (
          <CodeBlock className={className} {...rest}>{children}</CodeBlock>
        ),
        table: ({ children }) => (
          <div className='my-3 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700'>
            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm'>
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className='bg-gray-50 dark:bg-gray-800 px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300'>
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className='px-4 py-2 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700'>
            {children}
          </td>
        ),
        blockquote: ({ children }) => (
          <blockquote className='my-3 border-l-4 border-primary-400 pl-4 text-gray-600 dark:text-gray-400 italic'>
            {children}
          </blockquote>
        ),
        h1: ({ children }) => <h1 className='mt-4 mb-2 text-xl font-bold text-gray-900 dark:text-white'>{children}</h1>,
        h2: ({ children }) => <h2 className='mt-3 mb-2 text-lg font-semibold text-gray-900 dark:text-white'>{children}</h2>,
        h3: ({ children }) => <h3 className='mt-3 mb-1.5 text-base font-semibold text-gray-900 dark:text-white'>{children}</h3>,
        ul: ({ children }) => <ul className='my-2 ml-4 list-disc space-y-1 text-gray-700 dark:text-gray-300'>{children}</ul>,
        ol: ({ children }) => <ol className='my-2 ml-4 list-decimal space-y-1 text-gray-700 dark:text-gray-300'>{children}</ol>,
        p: ({ children }) => <p className='my-1.5 leading-relaxed text-gray-800 dark:text-gray-200'>{children}</p>,
        a: ({ href, children }) => (
          <a href={href} target='_blank' rel='noopener noreferrer' className='text-primary-600 dark:text-primary-400 hover:underline'>
            {children}
          </a>
        ),
        strong: ({ children }) => <strong className='font-semibold text-gray-900 dark:text-white'>{children}</strong>,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

// ─── Message bubble ───────────────────────────────────────────────────────────

interface MessageBubbleProps {
  message: Message
  onRegenerate?: () => void
}

export default function MessageBubble({ message, onRegenerate }: MessageBubbleProps) {
  const user = useAuthStore((s) => s.user)
  const isUser = message.role === 'user'
  const isStreaming = message.is_streaming
  const isEmpty = !message.content && isStreaming

  return (
    <div
      className={cn(
        'group flex gap-3 px-4 py-3',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      {/* Avatar */}
      {isUser ? (
        <Avatar name={user?.name ?? 'You'} size='sm' className='shrink-0 mt-0.5' />
      ) : (
        <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white mt-0.5'>
          <span className='text-xs font-bold'>AI</span>
        </div>
      )}

      {/* Bubble */}
      <div className={cn('flex max-w-[80%] flex-col gap-1', isUser && 'items-end')}>
        {isUser ? (
          <div className='rounded-2xl rounded-tr-sm bg-primary-600 px-4 py-3 text-sm text-white shadow-sm'>
            <p className='whitespace-pre-wrap leading-relaxed'>{message.content}</p>
          </div>
        ) : (
          <div className='rounded-2xl rounded-tl-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm'>
            {isEmpty ? (
              <TypingIndicator />
            ) : (
              <div className='text-sm'>
                <MdContent content={message.content} />
                {message.citations && message.citations.length > 0 && (
                  <CitationList citations={message.citations} />
                )}
                {isStreaming && (
                  <span className='ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-primary-500 align-text-bottom' aria-hidden='true' />
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions (visible on hover) */}
        {!isStreaming && (
          <MessageActions
            content={message.content}
            role={message.role as 'user' | 'assistant'}
            onRegenerate={!isUser ? onRegenerate : undefined}
            className='opacity-0 group-hover:opacity-100 transition-opacity'
          />
        )}
      </div>
    </div>
  )
}
