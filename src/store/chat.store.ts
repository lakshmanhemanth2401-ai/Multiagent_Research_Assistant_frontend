import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Conversation, Message } from '@/types/chat'
import { generateId } from '@/utils/helpers'

interface ChatStore {
  conversations: Conversation[]
  activeConversationId: string | null
  isStreaming: boolean
  sidebarOpen: boolean

  // Selectors
  activeConversation: () => Conversation | undefined

  // Conversation management
  setActiveConversation: (id: string | null) => void
  addConversation: (conversation: Conversation) => void
  updateConversation: (id: string, patch: Partial<Omit<Conversation, 'id'>>) => void
  renameConversation: (id: string, title: string) => void
  deleteConversation: (id: string) => void
  pinConversation: (id: string, pinned: boolean) => void
  clearConversations: () => void

  // Messages
  addMessage: (conversationId: string, message: Message) => void
  updateLastMessage: (conversationId: string, content: string) => void
  finalizeStreamingMessage: (conversationId: string) => void

  // UI
  setStreaming: (streaming: boolean) => void
  setSidebarOpen: (open: boolean) => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      isStreaming: false,
      sidebarOpen: true,

      activeConversation: () =>
        get().conversations.find((c) => c.id === get().activeConversationId),

      setActiveConversation: (id) => set({ activeConversationId: id }),

      addConversation: (conversation) =>
        set((s) => ({
          conversations: [conversation, ...s.conversations],
          activeConversationId: conversation.id,
        })),

      updateConversation: (id, patch) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, ...patch, updated_at: new Date().toISOString() } : c,
          ),
        })),

      renameConversation: (id, title) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, title, updated_at: new Date().toISOString() } : c,
          ),
        })),

      deleteConversation: (id) =>
        set((s) => {
          const remaining = s.conversations.filter((c) => c.id !== id)
          const nextActive =
            s.activeConversationId === id
              ? (remaining[0]?.id ?? null)
              : s.activeConversationId
          return { conversations: remaining, activeConversationId: nextActive }
        }),

      pinConversation: (id, pinned) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, is_pinned: pinned } : c,
          ),
        })),

      clearConversations: () =>
        set({ conversations: [], activeConversationId: null }),

      addMessage: (conversationId, message) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [...c.messages, message],
                  updated_at: new Date().toISOString(),
                }
              : c,
          ),
        })),

      updateLastMessage: (conversationId, content) =>
        set((s) => ({
          conversations: s.conversations.map((c) => {
            if (c.id !== conversationId) return c
            const messages = [...c.messages]
            const last = messages[messages.length - 1]
            if (last) messages[messages.length - 1] = { ...last, content }
            return { ...c, messages }
          }),
        })),

      finalizeStreamingMessage: (conversationId) =>
        set((s) => ({
          conversations: s.conversations.map((c) => {
            if (c.id !== conversationId) return c
            const messages = [...c.messages]
            const last = messages[messages.length - 1]
            if (last) messages[messages.length - 1] = { ...last, is_streaming: false }
            return { ...c, messages }
          }),
        })),

      setStreaming: (isStreaming) => set({ isStreaming }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    {
      name: 'chat-store',
      partialize: (s) => ({
        conversations: s.conversations,
        activeConversationId: s.activeConversationId,
      }),
    },
  ),
)

// Helper to create a blank conversation object
export function createNewConversation(title = 'New Conversation'): Conversation {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    title,
    messages: [],
    created_at: now,
    updated_at: now,
  }
}
}))
