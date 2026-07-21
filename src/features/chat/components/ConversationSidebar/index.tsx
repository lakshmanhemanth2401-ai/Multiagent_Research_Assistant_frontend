import { useState, useRef, useEffect } from 'react'
import {
  Plus, Search, Pin, MoreVertical, Pencil, Trash2,
  MessageSquare, ChevronLeft, X,
} from 'lucide-react'
import { cn } from '@/utils/helpers'
import { formatRelativeTime } from '@/utils/formatters'
import { useChatStore } from '@/store/chat.store'
import {
  useCreateConversation,
  useDeleteConversation,
  useRenameConversation,
} from '../../hooks'
import type { Conversation } from '@/types/chat'

// ─── Rename input (inline) ────────────────────────────────────────────────────

function RenameInput({
  initialValue,
  onConfirm,
  onCancel,
}: {
  initialValue: string
  onConfirm: (v: string) => void
  onCancel: () => void
}) {
  const [value, setValue] = useState(initialValue)
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => { ref.current?.focus(); ref.current?.select() }, [])

  return (
    <input
      ref={ref}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onConfirm(value)
        if (e.key === 'Escape') onCancel()
      }}
      onBlur={() => onConfirm(value)}
      className='w-full rounded border border-primary-400 bg-white dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-900 dark:text-white outline-none ring-1 ring-primary-400'
    />
  )
}

// ─── Single conversation row ──────────────────────────────────────────────────

function ConvRow({
  conv,
  isActive,
  onSelect,
}: {
  conv: Conversation
  isActive: boolean
  onSelect: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const rename = useRenameConversation()
  const del    = useDeleteConversation()
  const { pinConversation } = useChatStore()

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  const lastMsg = conv.messages[conv.messages.length - 1]
  const preview = lastMsg?.content.slice(0, 60) ?? 'No messages yet'

  return (
    <div
      className={cn(
        'group relative flex cursor-pointer items-start gap-2.5 rounded-lg px-3 py-2.5 transition-colors',
        isActive
          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
          : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300',
      )}
      onClick={onSelect}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Icon */}
      <MessageSquare
        className={cn('mt-0.5 h-4 w-4 shrink-0', isActive ? 'text-primary-500' : 'text-gray-400')}
        aria-hidden='true'
      />

      {/* Content */}
      <div className='min-w-0 flex-1'>
        {renaming ? (
          <RenameInput
            initialValue={conv.title}
            onConfirm={(v) => {
              if (v.trim()) rename.mutate({ id: conv.id, title: v.trim() })
              setRenaming(false)
            }}
            onCancel={() => setRenaming(false)}
          />
        ) : (
          <p className='truncate text-sm font-medium leading-snug'>{conv.title}</p>
        )}
        <p className='mt-0.5 truncate text-xs text-gray-400 dark:text-gray-500'>{preview}</p>
        <p className='mt-0.5 text-xs text-gray-400 dark:text-gray-500'>
          {formatRelativeTime(conv.updated_at)}
        </p>
      </div>

      {/* Pin indicator */}
      {conv.is_pinned && (
        <Pin className='h-3 w-3 shrink-0 text-primary-400 mt-1' aria-label='Pinned' />
      )}

      {/* Actions menu trigger */}
      <button
        onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v) }}
        className={cn(
          'absolute right-2 top-2 rounded p-1 transition-opacity',
          'opacity-0 group-hover:opacity-100 focus:opacity-100',
          menuOpen && 'opacity-100',
          isActive ? 'text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900/50' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600',
        )}
        aria-label='More options'
        aria-haspopup='true'
        aria-expanded={menuOpen}
      >
        <MoreVertical className='h-3.5 w-3.5' />
      </button>

      {/* Dropdown menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className='absolute right-1 top-8 z-20 min-w-[140px] rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg py-1'
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className='flex w-full items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            onClick={() => { setRenaming(true); setMenuOpen(false) }}
          >
            <Pencil className='h-3.5 w-3.5' /> Rename
          </button>
          <button
            className='flex w-full items-center gap-2 px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            onClick={() => { pinConversation(conv.id, !conv.is_pinned); setMenuOpen(false) }}
          >
            <Pin className='h-3.5 w-3.5' /> {conv.is_pinned ? 'Unpin' : 'Pin'}
          </button>
          <div className='my-1 h-px bg-gray-200 dark:bg-gray-600' />
          <button
            className='flex w-full items-center gap-2 px-3 py-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
            onClick={() => { del.mutate(conv.id); setMenuOpen(false) }}
          >
            <Trash2 className='h-3.5 w-3.5' /> Delete
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface ConversationSidebarProps {
  /** On mobile, whether the sidebar is shown */
  mobileOpen: boolean
  onMobileClose: () => void
}

function groupByDate(convs: Conversation[]) {
  const today = new Date(); today.setHours(0,0,0,0)
  const yesterday = new Date(today); yesterday.setDate(today.getDate()-1)
  const weekAgo = new Date(today); weekAgo.setDate(today.getDate()-7)

  const groups: { label: string; items: Conversation[] }[] = [
    { label: 'Pinned', items: [] },
    { label: 'Today', items: [] },
    { label: 'Yesterday', items: [] },
    { label: 'Last 7 days', items: [] },
    { label: 'Older', items: [] },
  ]

  convs.forEach((c) => {
    if (c.is_pinned) { groups[0].items.push(c); return }
    const d = new Date(c.updated_at)
    if (d >= today)          groups[1].items.push(c)
    else if (d >= yesterday) groups[2].items.push(c)
    else if (d >= weekAgo)   groups[3].items.push(c)
    else                     groups[4].items.push(c)
  })

  return groups.filter((g) => g.items.length > 0)
}

export default function ConversationSidebar({ mobileOpen, onMobileClose }: ConversationSidebarProps) {
  const [query, setQuery] = useState('')
  const { conversations, activeConversationId, setActiveConversation, sidebarOpen, setSidebarOpen } = useChatStore()
  const createConv = useCreateConversation()

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()),
  )
  const groups = groupByDate(filtered)

  const sidebarContent = (
    <div className='flex h-full flex-col bg-gray-50 dark:bg-gray-900'>
      {/* Header */}
      <div className='flex items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-700 px-3 py-3'>
        <span className='text-sm font-semibold text-gray-900 dark:text-white'>Conversations</span>
        <div className='flex items-center gap-1'>
          <button
            onClick={() => createConv.mutate(undefined)}
            title='New conversation'
            className='rounded-lg p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors'
          >
            <Plus className='h-4 w-4' />
          </button>
          {/* Desktop collapse */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'Collapse' : 'Expand'}
            className='hidden lg:flex rounded-lg p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-colors'
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', !sidebarOpen && 'rotate-180')} />
          </button>
          {/* Mobile close */}
          <button
            onClick={onMobileClose}
            className='flex lg:hidden rounded-lg p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
          >
            <X className='h-4 w-4' />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className='px-3 py-2'>
        <div className='flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2.5 py-1.5'>
          <Search className='h-3.5 w-3.5 shrink-0 text-gray-400' />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search conversations…'
            className='flex-1 bg-transparent text-xs text-gray-900 dark:text-white placeholder-gray-400 outline-none'
          />
          {query && (
            <button onClick={() => setQuery('')} className='text-gray-400 hover:text-gray-600'>
              <X className='h-3 w-3' />
            </button>
          )}
        </div>
      </div>

      {/* Conversation groups */}
      <div className='flex-1 overflow-y-auto px-2 pb-4 space-y-4'>
        {groups.length === 0 && (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <MessageSquare className='h-8 w-8 text-gray-300 dark:text-gray-600 mb-2' />
            <p className='text-xs text-gray-500 dark:text-gray-400'>
              {query ? 'No matches found' : 'No conversations yet'}
            </p>
          </div>
        )}

        {groups.map((group) => (
          <div key={group.label}>
            <p className='mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500'>
              {group.label}
            </p>
            <div className='space-y-0.5'>
              {group.items.map((conv) => (
                <ConvRow
                  key={conv.id}
                  conv={conv}
                  isActive={conv.id === activeConversationId}
                  onSelect={() => {
                    setActiveConversation(conv.id)
                    onMobileClose()
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className='border-t border-gray-200 dark:border-gray-700 px-3 py-2'>
        <p className='text-xs text-gray-400 dark:text-gray-500'>
          {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col border-r border-gray-200 dark:border-gray-700 transition-all duration-200',
          sidebarOpen ? 'w-64' : 'w-0 overflow-hidden',
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className='fixed inset-0 z-30 lg:hidden'>
          <div
            className='absolute inset-0 bg-black/40'
            onClick={onMobileClose}
            aria-hidden='true'
          />
          <aside className='absolute left-0 top-0 h-full w-72 shadow-xl'>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
