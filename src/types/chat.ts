export type MessageRole = 'user' | 'assistant' | 'system'

export interface CitationRef {
  id: string
  title: string
  url?: string
  authors?: string[]
  year?: number
}

export interface Message {
  id: string
  role: MessageRole
  content: string
  created_at: string
  is_streaming?: boolean
  is_error?: boolean
  citations?: CitationRef[]
  metadata?: Record<string, unknown>
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  created_at: string
  updated_at: string
  is_pinned?: boolean
  model?: string
}

export interface SendMessagePayload {
  conversationId: string
  content: string
}
