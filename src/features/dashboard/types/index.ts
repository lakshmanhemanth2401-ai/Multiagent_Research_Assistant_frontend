// ─── Stats ────────────────────────────────────────────────────────────────────

export interface StatItem {
  id: string
  label: string
  value: number | string
  /** Percentage change vs previous period */
  trend?: number
  /** 'up' | 'down' | 'neutral' */
  trendDirection?: 'up' | 'down' | 'neutral'
  unit?: string
}

export interface DashboardStats {
  researchSessions: StatItem
  documentsUploaded: StatItem
  reportsGenerated: StatItem
  citationsCollected: StatItem
  tokensUsed: StatItem
  aiAgentsRun: StatItem
}

// ─── Research sessions ────────────────────────────────────────────────────────

export type ResearchStatus = 'completed' | 'in_progress' | 'failed' | 'queued'

export interface ResearchSession {
  id: string
  title: string
  topic: string
  status: ResearchStatus
  agentsUsed: number
  documentsFound: number
  createdAt: string
  updatedAt: string
  completedAt?: string
  progress?: number   // 0–100, only relevant when status === 'in_progress'
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export type ReportFormat = 'pdf' | 'docx' | 'markdown'

export interface DashboardReport {
  id: string
  title: string
  summary: string
  format: ReportFormat
  pageCount: number
  citationCount: number
  createdAt: string
  sessionId: string
}

// ─── Activity feed ────────────────────────────────────────────────────────────

export type ActivityType =
  | 'research_started'
  | 'research_completed'
  | 'report_generated'
  | 'document_uploaded'
  | 'agent_error'
  | 'session_expired'

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description: string
  timestamp: string
  metadata?: Record<string, string | number>
}

// ─── Research progress ────────────────────────────────────────────────────────

export type AgentStatus = 'idle' | 'running' | 'done' | 'error'

export interface AgentProgress {
  id: string
  name: string
  role: string
  status: AgentStatus
  progress: number
}

export interface ResearchProgressItem {
  sessionId: string
  sessionTitle: string
  overallProgress: number
  status: ResearchStatus
  agents: AgentProgress[]
  estimatedTimeRemainingSeconds?: number
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationSeverity = 'info' | 'success' | 'warning' | 'error'

export interface Notification {
  id: string
  title: string
  message: string
  severity: NotificationSeverity
  timestamp: string
  read: boolean
  actionLabel?: string
  actionHref?: string
}

// ─── Quick actions ────────────────────────────────────────────────────────────

export interface QuickAction {
  id: string
  label: string
  description: string
  href: string
  iconName: string
  color: string
}
