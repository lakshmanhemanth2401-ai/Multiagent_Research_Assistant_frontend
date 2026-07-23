import { sleep } from '@/utils/helpers'
import type { KBDocument, KBCollection } from '../types'

// ── Seeded documents ──────────────────────────────────────────────────────────
export const SEED_DOCUMENTS: KBDocument[] = [
  {
    id: 'doc-001', name: 'AI in Healthcare 2025', originalName: 'ai_healthcare_2025.pdf',
    fileType: 'pdf', mimeType: 'application/pdf', size: 2_840_000,
    uploadedAt: '2026-07-20T10:23:00Z', processedAt: '2026-07-20T10:24:15Z',
    status: 'ready', indexingStatus: 'indexed', pageCount: 24, chunkCount: 156, wordCount: 18420,
    tags: ['ai', 'healthcare', 'research'], collectionIds: ['col-001'],
    extractedTextPreview: 'The integration of artificial intelligence into healthcare has accelerated dramatically over the past five years. From diagnostic imaging to drug discovery, AI systems are augmenting clinical decision-making and transforming patient outcomes in measurable ways.',
  },
  {
    id: 'doc-002', name: 'Climate Change Research Synthesis', originalName: 'climate_change_synthesis.docx',
    fileType: 'docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 1_560_000,
    uploadedAt: '2026-07-19T14:45:00Z', processedAt: '2026-07-19T14:46:00Z',
    status: 'ready', indexingStatus: 'indexed', pageCount: 15, chunkCount: 89, wordCount: 11200,
    tags: ['climate', 'environment', 'policy'], collectionIds: ['col-002'],
    extractedTextPreview: 'Global surface temperatures have risen by approximately 1.1°C above pre-industrial levels. The accelerating rate observed in the past three decades demands urgent coordinated policy response across all major economies.',
  },
  {
    id: 'doc-003', name: 'Quantum Computing Overview', originalName: 'quantum_computing_overview.pdf',
    fileType: 'pdf', mimeType: 'application/pdf', size: 4_200_000,
    uploadedAt: '2026-07-18T09:00:00Z', processedAt: '2026-07-18T09:02:30Z',
    status: 'ready', indexingStatus: 'indexed', pageCount: 31, chunkCount: 204, wordCount: 24600,
    tags: ['quantum', 'computing', 'physics'], collectionIds: ['col-001'],
    extractedTextPreview: 'Quantum computing leverages superposition and entanglement to perform computations infeasible for classical systems. Current NISQ devices demonstrate quantum advantage in narrow problem domains.',
  },
  {
    id: 'doc-004', name: 'Machine Learning Fundamentals', originalName: 'ml_fundamentals.md',
    fileType: 'md', mimeType: 'text/markdown', size: 240_000,
    uploadedAt: '2026-07-17T16:30:00Z', processedAt: '2026-07-17T16:30:45Z',
    status: 'ready', indexingStatus: 'not_indexed', pageCount: 8, chunkCount: 52, wordCount: 7800,
    tags: ['machine-learning', 'tutorial'], collectionIds: ['col-001'],
    extractedTextPreview: '# Introduction to Machine Learning\n\nMachine learning is a subset of artificial intelligence enabling systems to learn from data and improve performance over time without explicit programming.',
  },
  {
    id: 'doc-005', name: 'Financial Analysis Q4 2025', originalName: 'financial_q4_2025.xlsx',
    fileType: 'xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 890_000,
    uploadedAt: '2026-07-22T08:15:00Z',
    status: 'embedding', indexingStatus: 'not_indexed', pageCount: 12,
    tags: ['finance', 'quarterly-report'], collectionIds: ['col-002'],
  },
  {
    id: 'doc-006', name: 'Project Requirements v2.1', originalName: 'project_requirements.txt',
    fileType: 'txt', mimeType: 'text/plain', size: 45_000,
    uploadedAt: '2026-07-21T11:20:00Z', processedAt: '2026-07-21T11:20:30Z',
    status: 'ready', indexingStatus: 'indexed', pageCount: 3, chunkCount: 21, wordCount: 2800,
    tags: ['project', 'requirements'], collectionIds: ['col-002'],
    extractedTextPreview: '1. Project Overview\n\nThis document outlines functional and non-functional requirements for the Multi-Agent Research Assistant platform, including authentication, document management, and research workflows.',
  },
  {
    id: 'doc-007', name: 'Research Methodology Guide', originalName: 'research_methodology.pdf',
    fileType: 'pdf', mimeType: 'application/pdf', size: 1_120_000,
    uploadedAt: '2026-07-22T13:00:00Z',
    status: 'failed', indexingStatus: 'not_indexed',
    tags: [], collectionIds: [],
    processingError: 'Failed to extract text: document may be scanned or image-only. Try re-uploading with OCR enabled.',
  },
]

// ── Seeded collections ────────────────────────────────────────────────────────
export const SEED_COLLECTIONS: KBCollection[] = [
  {
    id: 'col-001', name: 'AI Research', description: 'AI, ML, and computing research papers',
    color: '#6366f1', documentIds: ['doc-001', 'doc-003', 'doc-004'],
    createdAt: '2026-07-15T10:00:00Z', updatedAt: '2026-07-20T10:24:15Z',
  },
  {
    id: 'col-002', name: 'Business Documents', description: 'Reports, requirements, and business docs',
    color: '#10b981', documentIds: ['doc-002', 'doc-005', 'doc-006'],
    createdAt: '2026-07-16T14:00:00Z', updatedAt: '2026-07-22T08:15:00Z',
  },
]

// ── Mock API (replace with real endpoints later) ──────────────────────────────
export async function listDocumentsApi(): Promise<KBDocument[]> {
  await sleep(400)
  return SEED_DOCUMENTS
}

export async function listCollectionsApi(): Promise<KBCollection[]> {
  await sleep(300)
  return SEED_COLLECTIONS
}

export async function deleteDocumentApi(id: string): Promise<void> {
  await sleep(200)
  void id
}

export async function renameDocumentApi(id: string, name: string): Promise<void> {
  await sleep(150)
  void id; void name
}
