import { useState, useRef } from 'react'
import {
  FileText, FileSpreadsheet, FileCode, Image as ImageIcon, File,
  MoreVertical, Eye, Pencil, Trash2, RotateCcw, Download,
  CheckCircle2, AlertCircle, Loader2, Clock, Shield,
} from 'lucide-react'
import { cn } from '@/utils/helpers'
import type { KBDocument, FileType, DocumentStatus, IndexingStatus } from '../types'

// ── Helpers ───────────────────────────────────────────────────────────────────
export const FILE_ICON_MAP: Record<FileType, React.ElementType> = {
  pdf: FileText, docx: FileText, txt: FileText, md: FileCode,
  pptx: FileText, csv: FileSpreadsheet, xlsx: FileSpreadsheet,
  image: ImageIcon, other: File,
}

export const FILE_COLOR_MAP: Record<FileType, string> = {
  pdf:   'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  docx:  'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  txt:   'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  md:    'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  pptx:  'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  csv:   'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  xlsx:  'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  image: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  other: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-500',
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

const STATUS_CONFIG: Record<DocumentStatus, { icon: React.ElementType; badge: string; label: string }> = {
  queued:     { icon: Clock,        badge: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',             label: 'Queued' },
  uploading:  { icon: Loader2,      badge: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',           label: 'Uploading' },
  extracting: { icon: Loader2,      badge: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',   label: 'Extracting' },
  chunking:   { icon: Loader2,      badge: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',           label: 'Chunking' },
  embedding:  { icon: Loader2,      badge: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',   label: 'Embedding' },
  indexing:   { icon: Loader2,      badge: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',       label: 'Indexing' },
  ready:      { icon: CheckCircle2, badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',       label: 'Ready' },
  failed:     { icon: AlertCircle,  badge: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',               label: 'Failed' },
  cancelled:  { icon: Clock,        badge: 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500',              label: 'Cancelled' },
}

const INDEXING_CONFIG: Record<IndexingStatus, { icon: React.ElementType; color: string; label: string }> = {
  not_indexed: { icon: Clock,         color: 'text-gray-400',                                    label: 'Not indexed' },
  indexing:    { icon: Loader2,       color: 'text-amber-500',                                   label: 'Indexing' },
  indexed:     { icon: Shield,        color: 'text-green-500 dark:text-green-400',               label: 'Indexed' },
  stale:       { icon: AlertCircle,   color: 'text-amber-500',                                   label: 'Stale' },
}

const PROCESSING_STATUSES: DocumentStatus[] = ['uploading', 'extracting', 'chunking', 'embedding', 'indexing']

export function StatusBadge({ status }: { status: DocumentStatus }) {
  const cfg = STATUS_CONFIG[status]
  const Icon = cfg.icon
  const isSpinning = PROCESSING_STATUSES.includes(status)
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', cfg.badge)}>
      <Icon className={cn('h-3 w-3', isSpinning && 'animate-spin')} />
      {cfg.label}
    </span>
  )
}

export function IndexBadge({ status }: { status: IndexingStatus }) {
  const cfg = INDEXING_CONFIG[status]
  const Icon = cfg.icon
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium', cfg.color)} title={cfg.label}>
      <Icon className={cn('h-3 w-3', status === 'indexing' && 'animate-spin')} />
      {cfg.label}
    </span>
  )
}

// ── Action menu ───────────────────────────────────────────────────────────────
interface ActionMenuProps {
  doc: KBDocument
  onPreview: () => void
  onRename: () => void
  onDelete: () => void
  onRetry: () => void
}

export function ActionMenu({ doc, onPreview, onRename, onDelete, onRetry }: ActionMenuProps) {
  const [open, setOpen] = useState(false)
  const isFailed = doc.status === 'failed'
  const isReady  = doc.status === 'ready'

  return (
    <div className="relative">
      <button
        onClick={e => { e.stopPropagation(); setOpen(v => !v) }}
        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 transition-colors"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-40 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1">
            {isReady && (
              <button onClick={() => { setOpen(false); onPreview() }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Eye className="h-3.5 w-3.5" /> Preview
              </button>
            )}
            <button onClick={() => { setOpen(false); onRename() }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Pencil className="h-3.5 w-3.5" /> Rename
            </button>
            <button
              onClick={() => { setOpen(false) }}
              disabled
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-400 dark:text-gray-500 cursor-not-allowed">
              <Download className="h-3.5 w-3.5" /> Download
            </button>
            {isFailed && (
              <button onClick={() => { setOpen(false); onRetry() }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors">
                <RotateCcw className="h-3.5 w-3.5" /> Retry
              </button>
            )}
            <div className="my-1 h-px bg-gray-100 dark:bg-gray-700" />
            <button onClick={() => { setOpen(false); onDelete() }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ── Document Card (grid view) ─────────────────────────────────────────────────
interface DocumentCardProps {
  doc: KBDocument
  onPreview: () => void
  onRename: () => void
  onDelete: () => void
  onRetry: () => void
}

export default function DocumentCard({ doc, onPreview, onRename, onDelete, onRetry }: DocumentCardProps) {
  const FileIcon = FILE_ICON_MAP[doc.fileType]
  const colorCls = FILE_COLOR_MAP[doc.fileType]
  const isProcessing = PROCESSING_STATUSES.includes(doc.status)

  return (
    <div
      className="group relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800 transition-all cursor-pointer"
      onClick={onPreview}
    >
      {/* File type icon */}
      <div className={cn('mb-3 flex h-12 w-12 items-center justify-center rounded-xl', colorCls)}>
        <FileIcon className="h-6 w-6" />
      </div>

      {/* Name */}
      <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug mb-1">
        {doc.name}
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 truncate mb-3">{doc.originalName}</p>

      {/* Status + index */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        <StatusBadge status={doc.status} />
        {doc.status === 'ready' && <IndexBadge status={doc.indexingStatus} />}
      </div>

      {/* Processing progress bar */}
      {isProcessing && (
        <div className="mb-3 h-1 w-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <div className="h-full rounded-full bg-primary-400 animate-pulse w-1/3" />
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
        <span>{formatFileSize(doc.size)}</span>
        <span>{formatDate(doc.uploadedAt)}</span>
      </div>

      {/* Chunk count */}
      {doc.chunkCount && (
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{doc.chunkCount} chunks</p>
      )}

      {/* Actions button (top-right on hover) */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={e => e.stopPropagation()}>
        <ActionMenu doc={doc} onPreview={onPreview} onRename={onRename} onDelete={onDelete} onRetry={onRetry} />
      </div>

      {/* Failed overlay */}
      {doc.status === 'failed' && (
        <div className="mt-2 rounded-lg bg-red-50 dark:bg-red-900/20 p-2">
          <p className="text-xs text-red-600 dark:text-red-400 line-clamp-2">{doc.processingError}</p>
        </div>
      )}
    </div>
  )
}
