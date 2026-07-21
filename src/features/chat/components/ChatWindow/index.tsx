import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { formatDate } from '@/utils/formatters'
import MessageBubble from '../MessageBubble'
import SuggestedPrompts from '../SuggestedPrompts'
import type { Message } from '@/types/chat'

// ─── Date separator ───────────────────────────────────────────────────────────

function DateSeparator({ date }: { date: string }) {
  return (
    <div className='flex items-center gap-3 px-4 py-2'>
      <div className='h-px flex-1 bg-gray-200 dark:bg-gray-700' />
      <span className='text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap'>
        {formatDate(date)}
      </span>
      <div className='h-px flex-1 bg-gray-200 dark:bg-gray-700' />
    </div>
  )
}

// ─── Scroll-to-bottom button ──────────────────────────────────────────────────

function ScrollToBottom({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label='Scroll to bottom'
      className={cn(
        'absolute bottom-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full',
        'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-md',
        'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200',
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none',
      )}
    >
      <ChevronDown className='h-4 w-4' />
    </button>
  )
}

// ─── Group messages by date ───────────────────────────────────────────────────

function groupMessagesByDate(messages: Message[]) {
  const groups: { date: string; messages: Message[] }[] = []
  messages.forEach((msg) => {
    const date = msg.created_at.slice(0, 10)
    const last = groups[groups.length - 1]
    if (last?.date === date) {
      last.messages.push(msg)
    } else {
      groups.push({ date, messages: [msg] })
    }
  })
  return groups
}

// ─── ChatWindow ───────────────────────────────────────────────────────────────

interface ChatWindowProps {
  messages: Message[]
  isStreaming: boolean
  onSuggestedPrompt: (prompt: string) => void
}

export default function ChatWindow({ messages, isStreaming, onSuggestedPrompt }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  // Scroll to bottom when new message arrives
  useEffect(() => {
    if (isStreaming) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isStreaming])

  // Scroll-to-bottom button visibility
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handler = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120
      setShowScrollBtn(!atBottom && messages.length > 0)
    }
    el.addEventListener('scroll', handler, { passive: true })
    return () => el.removeEventListener('scroll', handler)
  }, [messages.length])

  // Scroll to bottom on first load
  useEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [])

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })

  const groups = groupMessagesByDate(messages)

  return (
    <div className='relative flex-1 overflow-hidden'>
      <div
        ref={scrollRef}
        className='h-full overflow-y-auto scroll-smooth'
      >
        {messages.length === 0 ? (
          <SuggestedPrompts onSelect={onSuggestedPrompt} />
        ) : (
          <div className='pb-4'>
            {groups.map((group) => (
              <div key={group.date}>
                <DateSeparator date={group.date} />
                {group.messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
              </div>
            ))}
          </div>
        )}
        <div ref={bottomRef} aria-hidden='true' />
      </div>

      <ScrollToBottom visible={showScrollBtn} onClick={scrollToBottom} />
    </div>
  )
}
