import { CheckCircle2, XCircle, Loader2, X, RotateCcw, FileText, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { useFilesStore } from '../store'
import { useUploads } from '../hooks'
import type { UploadItem, DocumentStatus } from '../types'

const STAGE_LABELS: Partial<Record<DocumentStatus, string>> = {
  extracting: 'Extracting text',
  chunking:   'Creating chunks',
  embedding:  'Generating embeddings',
  indexing:   'Indexing vectors',
  ready:      'Ready',
}

const STAGE_ORDER: DocumentStatus[] = ['extracting', 'chunking', 'embedding', 'indexing']

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function ProcessingStages({ current }: { current?: DocumentStatus }) {
  return (
    <div className="mt-2 flex items-center gap-1 overflow-x-auto pb-0.5">
      {STAGE_ORDER.map((stage, i) => {
        const isDone = current === 'ready' || (current && STAGE_ORDER.indexOf(current) > i)
        const isActive = current === stage
        return (
          <div key={stage} className="flex items-center gap-1 shrink-0">
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full font-medium',
              isDone   ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              isActive ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse' :
                         'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500',
            )}>
              {STAGE_LABELS[stage]}
            </span>
            {i < STAGE_ORDER.length - 1 && (
              <span className="text-gray-300 dark:text-gray-600">›</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

function UploadRow({ item }: { item: UploadItem }) {
  const { cancelUpload, retryUpload } = useFilesStore()
  const isActive = item.status === 'uploading' || item.status === 'processing'
  const Icon = item.fileType === 'image' ? ImageIcon : FileText

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
      {/* Icon */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700">
        <Icon className="h-4 w-4 text-gray-400" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.fileName}</span>
          <span className="text-xs text-gray-400 shrink-0">{formatFileSize(item.fileSize)}</span>
        </div>

        {/* Status */}
        {item.status === 'uploading' && (
          <div className="mt-1.5">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Uploading…</span>
              <span>{item.uploadProgress}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary-500 transition-all duration-300"
                style={{ width: `${item.uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {item.status === 'processing' && (
          <ProcessingStages current={item.processingStatus} />
        )}

        {item.status === 'ready' && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-3.5 w-3.5" /> Indexed and ready
          </div>
        )}

        {item.status === 'failed' && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-red-500">
            <XCircle className="h-3.5 w-3.5" />
            {item.error ?? 'Upload failed'}
          </div>
        )}

        {item.status === 'queued' && (
          <p className="mt-1 text-xs text-gray-400">Queued…</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0 mt-0.5">
        {item.status === 'failed' && (
          <button
            onClick={() => retryUpload(item.id)}
            className="rounded p-1 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
            title="Retry"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}
        {isActive && (
          <button
            onClick={() => cancelUpload(item.id)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 transition-colors"
            title="Cancel"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {(item.status === 'ready' || item.status === 'cancelled') && (
          <Loader2 className="h-3.5 w-3.5 text-transparent" />
        )}
      </div>
    </div>
  )
}

export default function UploadQueue() {
  const uploads = useUploads()
  const clearCompleted = useFilesStore(s => s.clearCompletedUploads)

  if (uploads.length === 0) return null

  const active    = uploads.filter(u => u.status === 'uploading' || u.status === 'processing' || u.status === 'queued').length
  const completed = uploads.filter(u => u.status === 'ready' || u.status === 'failed' || u.status === 'cancelled').length

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {active > 0 && <Loader2 className="h-4 w-4 text-primary-500 animate-spin" />}
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Upload Queue
          </span>
          <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
            {uploads.length}
          </span>
        </div>
        {completed > 0 && (
          <button
            onClick={clearCompleted}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            Clear completed
          </button>
        )}
      </div>

      {/* Items */}
      <div className="px-4 max-h-60 overflow-y-auto">
        {uploads.map(item => <UploadRow key={item.id} item={item} />)}
      </div>
    </div>
  )
}
