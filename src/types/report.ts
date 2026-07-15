export type ReportFormat = 'markdown' | 'pdf' | 'docx'
export type ReportStatus = 'draft' | 'published'

export interface Report {
  id: string
  title: string
  content: string
  research_session_id: string
  format: ReportFormat
  status: ReportStatus
  word_count: number
  created_at: string
  updated_at: string
}

export interface ReportExportOptions {
  format: ReportFormat
  include_citations: boolean
  include_sources: boolean
  include_toc: boolean
}
