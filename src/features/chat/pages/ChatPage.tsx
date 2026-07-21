import { useState, useCallback } from 'react'
import { PanelLeftOpen } from 'lucide-react'
import { useChatStore } from '@/store/chat.store'
import { useConversations, useSendMessage, useCreateConversation } from '../hooks'
import {
  ConversationSidebar,
  ChatWindow,
  PromptInput,
} from '../components'

export default function ChatPage() {
  const [mobileOpen, setMobileOpen] = useState(false)

  // Seed conversations from mock API
  useConversations()

  const { activeConversationId, isStreaming, sidebarOpen, setSidebarOpen } = useChatStore()
  const conversation = useChatStore((s) => s.activeConversation())
  const { sendMessage } = useSendMessage()
  const createConv = useCreateConversation()

  const handleSend = useCallback(
    async (text: string) => {
      // Auto-create a conversation if none is active
      if (!activeConversationId) {
        const conv = await createConv.mutateAsync(text.slice(0, 40) + (text.length > 40 ? '…' : ''))
        // After creation the store updates activeConversationId
        // We need a short wait for the store to reflect the new id
        await new Promise((r) => setTimeout(r, 50))
        const storeId = useChatStore.getState().activeConversationId
        if (storeId) {
          await useChatStore.getState()
          sendMessage(text)
        }
        void conv
      } else {
        sendMessage(text)
      }
    },
    [activeConversationId, createConv, sendMessage],
  )

  const messages = conversation?.messages ?? []

  return (
    // Break out of MainLayout's max-width/padding for a full chat UI
    <div className="-mx-6 -my-6 flex h-[calc(100vh-4rem)] overflow-hidden rounded-none">
      {/* Conversation sidebar */}
      <ConversationSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main chat area */}
      <div className="flex flex-1 flex-col overflow-hidden bg-gray-50 dark:bg-gray-950">
        {/* Chat toolbar */}
        <div className="flex h-12 shrink-0 items-center gap-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4">
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex lg:hidden rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Open conversations"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>

          {/* Desktop: toggle sidebar if collapsed */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="hidden lg:flex rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Show sidebar"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </button>
          )}

          {/* Conversation title */}
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {conversation?.title ?? 'New Conversation'}
          </h2>

          {isStreaming && (
            <span className="ml-auto text-xs text-primary-500 animate-pulse">
              AI is responding…
            </span>
          )}
        </div>

        {/* Messages */}
        <ChatWindow
          messages={messages}
          isStreaming={isStreaming}
          onSuggestedPrompt={(p) => handleSend(p)}
        />

        {/* Input */}
        <PromptInput
          onSend={handleSend}
          isStreaming={isStreaming}
          disabled={false}
        />
      </div>
    </div>
  )
}