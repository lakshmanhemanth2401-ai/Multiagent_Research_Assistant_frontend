xport type ResearchStatus = 'idle' | 'planning' | 'researching' | 'writing' | 'completed' | 'failed'

export type AgentType = 'planner' | 'researcher' | 'writer' | 'reviewer'

export interface AgentStep {
  id: string
  agent: AgentType
  status: ResearchStatus
  message: string
  timestamp: string
}

export interface Source {
  id: string
  title: string
  url: string
  snippet: string
  relevance_score: number
  published_at?: string
}

export interface ResearchSession {
  id: string
  query: string
  status: ResearchStatus
  steps: AgentStep[]
  sources: Source[]
  token_count?: number
  cost_usd?: number
  created_at: string
  updated_at: string
}
