// Files & Knowledge Base module – TypeScript types

export type FileType =
  | 'pdf' | 'docx' | 'txt' | 'md' | 'pptx'
  | 'csv' | 'xlsx' | 'image' | 'other'

export type DocumentStatus =
  | 'queued'
  | 'uploading'
  | 'extracting'
  | 'chunking'
  | 'embedding'
  | 'indexing'
  | 'ready'
  | 'failed'
  | 'cancelled'

export type IndexingStatus = 'not_indexed' | 'indexing' | 'indexed' | 'stale'

export interface KBDocument {
  id: string
  name: string            // display name (editable)
  originalName: string    // original file name with extension
  fileType: FileType
  mimeType: string
  size: number            // bytes
  uploadedAt: string      // ISO datetime
  processedAt?: string
  status: DocumentStatus
  indexingStatus: IndexingStatus
  pageCount?: number
  chunkCount?: number
  wordCount?: number
  tags?: string[]
  collectionIds: string[]
  processingError?: string
  extractedTextPreview?: string
}

export interface UploadItem {
  id: string
  fileName: string
  fileSize: number
  fileType: FileType
  status: 'queued' | 'uploading' | 'processing' | 'ready' | 'failed' | 'cancelled'
  uploadProgress: number    // 0–100
  processingStatus?: DocumentStatus
  error?: string
  documentId?: string       // set when document is created in library
}

export interface KBCollection {
  id: string
  name: string
  description?: string
  color: string             // hex color for visual indicator
  documentIds: string[]
  createdAt: string
  updatedAt: string
}

export interface DocumentFilter {
  search: string
  fileTypes: FileType[]
  statuses: DocumentStatus[]
  collectionId?: string
}

export type DocumentSortField = 'name' | 'size' | 'uploadedAt' | 'fileType'
export type SortDirection = 'asc' | 'desc'

export interface DocumentSort {
  field: DocumentSortField
  direction: SortDirection
}
