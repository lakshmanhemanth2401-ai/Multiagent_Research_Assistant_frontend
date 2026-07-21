import { useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useChatStore } from '@/store/chat.store'
import { generateId } from '@/utils/helpers'
import { QUERY_KEYS } from '@/utils/constants'
import {
  fetchConversations,
  createConversation,
  deleteConversationApi,
  renameConversationApi,
  sendMessageApi,
} from '../api'
import type { Message } from '@/types/chat'

// ─── Load / seed conversations ────────────────────────────────────────────────

export function useConversations() {
  const { conversations, addConversation } = useChatStore()

  const query = useQuery({
    queryKey: QUERY_KEYS.CONVERSATIONS,
    queryFn: fetchConversations,
    staleTime: Infinity, // conversations live in Zustand; only load once
  })

  // Seed store on first load if empty
  if (query.isSuccess && conversations.length === 0 && query.data.length > 0) {
    query.data.forEach((c) => addConversation(c))
  }

  return query
}

// ─── Create conversation ──────────────────────────────────────────────────────

export function useCreateConversation() {
  const { addConversation } = useChatStore()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (title?: string) => createConversation(title),
    onSuccess: (conv) => {
      addConversation(conv)
      qc.invalidateQueries({ queryKey: QUERY_KEYS.CONVERSATIONS })
    },
  })
}

// ─── Delete conversation ──────────────────────────────────────────────────────

export function useDeleteConversation() {
  const { deleteConversation } = useChatStore()

  return useMutation({
    mutationFn: (id: string) => deleteConversationApi(id),
    onSuccess: (_, id) => deleteConversation(id),
  })
}

// ─── Rename conversation ──────────────────────────────────────────────────────

export function useRenameConversation() {
  const { renameConversation } = useChatStore()

  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      renameConversationApi(id, title),
    onSuccess: (_, { id, title }) => renameConversation(id, title),
  })
}

// ─── Send message (with streaming simulation) ─────────────────────────────────

export function useSendMessage() {
  const {
    addMessage,
    updateLastMessage,
    finalizeStreamingMessage,
    setStreaming,
    activeConversationId,
  } = useChatStore()

  const sendMessage = useCallback(
    async (content: string) => {
      if (!activeConversationId || !content.trim()) return

      const conversationId = activeConversationId

      // 1. Add user message
      const userMsg: Message = {
        id: 'msg_' + generateId().slice(0, 8),
        role: 'user',
        content: content.trim(),
        created_at: new Date().toISOString(),
      }
      addMessage(conversationId, userMsg)

      // 2. Add placeholder assistant message (streaming)
      const placeholderId = 'msg_' + generateId().slice(0, 8)
      addMessage(conversationId, {
        id: placeholderId,
        role: 'assistant',
        content: '',
        created_at: new Date().toISOString(),
        is_streaming: true,
      })

      setStreaming(true)

      try {
        await sendMessageApi(conversationId, content, (chunk) => {
          updateLastMessage(conversationId, chunk)
        })
        finalizeStreamingMessage(conversationId)
      } catch {
        updateLastMessage(conversationId, '*An error occurred. Please try again.*')
        finalizeStreamingMessage(conversationId)
      } finally {
        setStreaming(false)
      }
    },
    [
      activeConversationId,
      addMessage,
      updateLastMessage,
      finalizeStreamingMessage,
      setStreaming,
    ],
  )

  return { sendMessage }
}
