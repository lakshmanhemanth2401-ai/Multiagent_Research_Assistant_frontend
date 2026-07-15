import { create } from 'zustand'
import type { Conversation, Message } from '@/types/chat'

interface ChatStore {
  conversations: Conversation[]
  activeConversationId: string | null
  isStreaming: boolean
  setActiveConversation: (id: string | null) => void
  addConversation: (conversation: Conversation) => void
  addMessage: (conversationId: string, message: Message) => void
  updateLastMessage: (conversationId: string, content: string) => void
  setStreaming: (streaming: boolean) => void
  clearConversations: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  activeConversationId: null,
  isStreaming: false,
  setActiveConversation: (id) => set({ activeConversationId: id }),
  addConversation: (conversation) =>
    set((state) => ({ conversations: [conversation, ...state.conversations] })),
  addMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, messages: [...c.messages, message] } : c,
      ),
    })),
  updateLastMessage: (conversationId, content) =>
    set((state) => ({
      conversations: state.conversations.map((c) => {
        if (c.id !== conversationId) return c
        const messages = [...c.messages]
        const last = messages[messages.length - 1]
        if (last) messages[messages.length - 1] = { ...last, content }
        return { ...c, messages }
      }),
    })),
  setStreaming: (isStreaming) => set({ isStreaming }),
  clearConversations: () => set({ conversations: [], activeConversationId: null }),
}))
