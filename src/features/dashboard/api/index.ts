/**
 * Dashboard mock API
 * Replace each function body with a real apiClient call once the backend is ready.
 */
import type {
  DashboardStats,
  ResearchSession,
  DashboardReport,
  ActivityItem,
  ResearchProgressItem,
  Notification,
} from '../types'

const delay = (ms = 700) => new Promise<void>((r) => setTimeout(r, ms))

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function fetchDashboardStats(): Promise<DashboardStats> {
  await delay(600)
  return {
    researchSessions: { id: 'sessions',   label: 'Research Sessions',   value: 24,  trend: 12,  trendDirection: 'up' },
    documentsUploaded:{ id: 'docs',       label: 'Documents Uploaded',  value: 137, trend: 8,   trendDirection: 'up' },
    reportsGenerated: { id: 'reports',    label: 'Reports Generated',   value: 18,  trend: -3,  trendDirection: 'down' },
    citationsCollected:{ id:'citations',  label: 'Citations Collected', value: 892, trend: 21,  trendDirection: 'up' },
    tokensUsed:       { id: 'tokens',     label: 'Tokens Used',         value: '2.4M', trend: 5, trendDirection: 'up', unit: '' },
    aiAgentsRun:      { id: 'agents',     label: 'AI Agents Run',       value: 96,  trend: 18,  trendDirection: 'up' },
  }
}

// ─── Research sessions ────────────────────────────────────────────────────────

export async function fetchRecentSessions(): Promise<ResearchSession[]> {
  await delay(750)
  return [
    {
      id: 'sess_001',
      title: 'Quantum Computing in Drug Discovery',
      topic: 'Quantum algorithms applied to molecular simulation',
      status: 'completed',
      agentsUsed: 4,
      documentsFound: 23,
      createdAt: '2026-07-15T09:00:00Z',
      updatedAt: '2026-07-15T11:30:00Z',
      completedAt: '2026-07-15T11:30:00Z',
    },
    {
      id: 'sess_002',
      title: 'Climate Change Economic Impact',
      topic: 'Macro-economic models for climate risk',
      status: 'in_progress',
      agentsUsed: 3,
      documentsFound: 11,
      createdAt: '2026-07-17T08:00:00Z',
      updatedAt: '2026-07-17T10:15:00Z',
      progress: 62,
    },
    {
      id: 'sess_003',
      title: 'Large Language Model Alignment',
      topic: 'Techniques for aligning LLMs with human values',
      status: 'completed',
      agentsUsed: 5,
      documentsFound: 41,
      createdAt: '2026-07-13T14:00:00Z',
      updatedAt: '2026-07-13T17:45:00Z',
      completedAt: '2026-07-13T17:45:00Z',
    },
    {
      id: 'sess_004',
      title: 'Renewable Energy Storage Solutions',
      topic: 'Battery technology advances for grid-scale storage',
      status: 'queued',
      agentsUsed: 0,
      documentsFound: 0,
      createdAt: '2026-07-17T12:00:00Z',
      updatedAt: '2026-07-17T12:00:00Z',
    },
    {
      id: 'sess_005',
      title: 'mRNA Vaccine Efficacy Studies',
      topic: 'Long-term efficacy data for mRNA-based vaccines',
      status: 'failed',
      agentsUsed: 2,
      documentsFound: 4,
      createdAt: '2026-07-16T16:00:00Z',
      updatedAt: '2026-07-16T16:22:00Z',
    },
  ]
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export async function fetchRecentReports(): Promise<DashboardReport[]> {
  await delay(650)
  return [
    {
      id: 'rpt_001',
      title: 'Quantum Computing in Drug Discovery — Full Analysis',
      summary:
        'A comprehensive review of quantum algorithms applied to molecular docking and protein-folding simulations.',
      format: 'pdf',
      pageCount: 34,
      citationCount: 88,
      createdAt: '2026-07-15T11:30:00Z',
      sessionId: 'sess_001',
    },
    {
      id: 'rpt_002',
      title: 'LLM Alignment Techniques — Research Summary',
      summary:
        'Overview of RLHF, constitutional AI, and debate-based alignment strategies across recent literature.',
      format: 'docx',
      pageCount: 22,
      citationCount: 54,
      createdAt: '2026-07-13T17:45:00Z',
      sessionId: 'sess_003',
    },
    {
      id: 'rpt_003',
      title: 'Grid-Scale Battery Storage — Technology Landscape',
      summary: 'Comparative analysis of lithium-ion, flow, and solid-state battery technologies.',
      format: 'markdown',
      pageCount: 14,
      citationCount: 31,
      createdAt: '2026-07-10T09:20:00Z',
      sessionId: 'sess_004',
    },
  ]
}

// ─── Activity feed ────────────────────────────────────────────────────────────

export async function fetchActivityFeed(): Promise<ActivityItem[]> {
  await delay(500)
  return [
    {
      id: 'act_001',
      type: 'research_started',
      title: 'Research session started',
      description: 'Climate Change Economic Impact session was initiated.',
      timestamp: '2026-07-17T08:00:00Z',
    },
    {
      id: 'act_002',
      type: 'report_generated',
      title: 'Report generated',
      description: 'LLM Alignment Techniques report is ready for download.',
      timestamp: '2026-07-13T17:45:00Z',
    },
    {
      id: 'act_003',
      type: 'research_completed',
      title: 'Research completed',
      description: 'Quantum Computing in Drug Discovery session finished successfully.',
      timestamp: '2026-07-15T11:30:00Z',
    },
    {
      id: 'act_004',
      type: 'document_uploaded',
      title: '3 documents uploaded',
      description: 'climate_model_2026.pdf, ipcc_summary.pdf, and economic_risk.docx were added.',
      timestamp: '2026-07-17T07:45:00Z',
    },
    {
      id: 'act_005',
      type: 'agent_error',
      title: 'Agent encountered an error',
      description: 'Synthesis agent failed during mRNA Vaccine Efficacy session.',
      timestamp: '2026-07-16T16:22:00Z',
    },
  ]
}

// ─── Research progress ────────────────────────────────────────────────────────

export async function fetchResearchProgress(): Promise<ResearchProgressItem[]> {
  await delay(600)
  return [
    {
      sessionId: 'sess_002',
      sessionTitle: 'Climate Change Economic Impact',
      overallProgress: 62,
      status: 'in_progress',
      estimatedTimeRemainingSeconds: 480,
      agents: [
        { id: 'agt_1', name: 'Search Agent',    role: 'Web & academic search',   status: 'done',    progress: 100 },
        { id: 'agt_2', name: 'Analysis Agent',  role: 'Document analysis',       status: 'running', progress: 71  },
        { id: 'agt_3', name: 'Synthesis Agent', role: 'Cross-source synthesis',  status: 'running', progress: 38  },
        { id: 'agt_4', name: 'Citation Agent',  role: 'Citation extraction',     status: 'idle',    progress: 0   },
      ],
    },
  ]
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function fetchNotifications(): Promise<Notification[]> {
  await delay(400)
  return [
    {
      id: 'notif_001',
      title: 'Research complete',
      message: 'Your Quantum Computing session has finished. View the generated report.',
      severity: 'success',
      timestamp: '2026-07-15T11:30:00Z',
      read: false,
      actionLabel: 'View report',
      actionHref: '/reports',
    },
    {
      id: 'notif_002',
      title: 'Agent failure',
      message: 'The Synthesis agent failed during your mRNA Vaccine session. Retry or adjust parameters.',
      severity: 'error',
      timestamp: '2026-07-16T16:22:00Z',
      read: false,
      actionLabel: 'View session',
      actionHref: '/research',
    },
    {
      id: 'notif_003',
      title: 'Storage approaching limit',
      message: 'You have used 78% of your document storage quota.',
      severity: 'warning',
      timestamp: '2026-07-17T06:00:00Z',
      read: true,
      actionLabel: 'Manage files',
      actionHref: '/files',
    },
    {
      id: 'notif_004',
      title: 'New feature available',
      message: 'Multi-agent parallel execution is now available. Try it in your next research session.',
      severity: 'info',
      timestamp: '2026-07-14T10:00:00Z',
      read: true,
    },
  ]
}
