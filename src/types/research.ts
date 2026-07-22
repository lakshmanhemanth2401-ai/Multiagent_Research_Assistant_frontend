// ── Research module – TypeScript types ──────────────────────────────────────

export type ResearchDepth = 'quick' | 'standard' | 'deep'
export type ResearchSourceType = 'web' | 'academic' | 'documents' | 'news'

export type ResearchStatus =
  | 'idle'
  | 'planning'
  | 'researching'
  | 'writing'
  | 'reviewing'
  | 'completed'
  | 'failed'
  | 'paused'
  | 'cancelled'

export type AgentRole =
  | 'planner'
  | 'researcher'
  | 'web_search'
  | 'critic'
  | 'writer'
  | 'citation'
  | 'reviewer'

export type AgentStatus =
  | 'waiting'
  | 'running'
  | 'completed'
  | 'failed'
  | 'retrying'
  | 'skipped'

export type TimelineEventType =
  | 'query_planned'
  | 'web_searching'
  | 'source_found'
  | 'doc_analyzed'
  | 'fact_verified'
  | 'writing'
  | 'citation_generated'
  | 'reviewing'
  | 'completed'
  | 'error'

export type FindingConfidence = 'low' | 'medium' | 'high' | 'verified'
export type OutlineSectionStatus = 'planned' | 'writing' | 'completed'

// ── Config ────────────────────────────────────────────────────────────────────
export interface ResearchConfig {
  topic: string
  instructions?: string
  depth: ResearchDepth
  sourceTypes: ResearchSourceType[]
  attachedDocIds?: string[]
}

// ── Agent ─────────────────────────────────────────────────────────────────────
export interface AgentActivity {
  id: string
  timestamp: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

export interface ResearchAgent {
  id: string
  role: AgentRole
  name: string
  description: string
  status: AgentStatus
  currentTask: string
  targetDuration: number    // seconds the agent should run
  durationSeconds: number   // elapsed seconds (becomes actual when completed)
  activities: AgentActivity[]
  startedAt?: string
  completedAt?: string
}

// ── Timeline ──────────────────────────────────────────────────────────────────
export interface TimelineEvent {
  id: string
  type: TimelineEventType
  title: string
  description: string
  timestamp: string
  agentRole: AgentRole
}

// ── Sources ───────────────────────────────────────────────────────────────────
export interface ResearchSource {
  id: string
  title: string
  url: string
  domain: string
  sourceType: ResearchSourceType
  relevanceScore: number
  publicationDate?: string
  isVerified: boolean
  snippet: string
  authors?: string[]
  agentRole: AgentRole
}

// ── Citations ─────────────────────────────────────────────────────────────────
export interface Citation {
  id: string
  sourceId: string
  text: string
  context: string
  pageNumber?: number
  agentRole: AgentRole
}

// ── Outline ───────────────────────────────────────────────────────────────────
export interface OutlineSection {
  id: string
  title: string
  level: 1 | 2 | 3
  status: OutlineSectionStatus
  wordCount?: number
  subsections?: OutlineSection[]
}

// ── Findings ──────────────────────────────────────────────────────────────────
export interface Finding {
  id: string
  agentRole: AgentRole
  title: string
  content: string
  confidence: FindingConfidence
  timestamp: string
  relatedSourceIds: string[]
}

// ── Full Research Session ─────────────────────────────────────────────────────
export interface ResearchSession {
  id: string
  config: ResearchConfig
  status: ResearchStatus
  progress: number
  agents: ResearchAgent[]
  timeline: TimelineEvent[]
  sources: ResearchSource[]
  citations: Citation[]
  outline: OutlineSection[]
  findings: Finding[]
  startedAt?: string
  completedAt?: string
  pausedAt?: string
  elapsedSeconds: number
  totalTokens?: number
  estimatedCost?: number
}

// ── Legacy compatibility ──────────────────────────────────────────────────────
export type AgentType = AgentRole
export interface AgentStep {
  id: string
  agent: AgentRole
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