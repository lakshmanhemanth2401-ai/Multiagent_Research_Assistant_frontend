import { useState } from 'react'
import { X, FileText, Copy, Check, Hash, Calendar, Tag, Shield } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { FILE_ICON_MAP, FILE_COLOR_MAP, StatusBadge, IndexBadge, formatFileSize, formatDate } from '../FileCard'
import type { KBDocument, KBCollection } from '../types'

type PreviewTab = 'preview' | 'metadata' | 'chunks'

const CHUNK_PREVIEWS = [
  'The integration of artificial intelligence into healthcare has accelerated dramatically over the past five years...',
  'From diagnostic imaging to drug discovery, AI systems are augmenting clinical decision-making...',
  'Machine learning models trained on electronic health records can predict patient outcomes with high accuracy...',
  'Natural language processing enables automated extraction of clinical insights from unstructured notes...',
  'Computer vision algorithms outperform radiologists in specific imaging tasks, particularly chest X-ray analysis...',
]

interface DocumentPreviewProps {
  doc: KBDocument
  collections: KBCollection[]
  onClose: () => void
}

export default function DocumentPreview({ doc, collections, onClose }: DocumentPreviewProps) {
  const [activeTab, setActiveTab] = useState<PreviewTab>('preview')
  const [copied, setCopied] = useState(false)
  const FileIcon = FILE_ICON_MAP[doc.fileType]
  const colorCls = FILE_COLOR_MAP[doc.fileType]

  const docCollections = collections.filter(c => doc.collectionIds.includes(c.id))
  const canPreview = doc.status === 'ready' && doc.extractedTextPreview
  const chunks = Array.from({ length: Math.min(5, doc.chunkCount ?? 0) }, (_, i) => ({
    id: i + 1,
    preview: CHUNK_PREVIEWS[i % CHUNK_PREVIEWS.length],
    tokens: Math.floor(Math.random() * 100) + 200,
  }))

  function handleCopy() {
    if (doc.extractedTextPreview) {
      navigator.clipboard.writeText(doc.extractedTextPreview).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full sm:max-w-2xl max-h-[90vh] rounded-t-2xl sm:rounded-2xl bg-white dark:bg-gray-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', colorCls)}>
            <FileIcon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{doc.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{doc.originalName}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={doc.status} />
            <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 shrink-0 px-4">
          {(['preview', 'metadata', 'chunks'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px transition-colors',
                activeTab === tab
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
              )}
            >
              {tab}
              {tab === 'chunks' && doc.chunkCount && (
                <span className="ml-1.5 text-xs text-gray-400">({doc.chunkCount})</span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Preview tab */}
          {activeTab === 'preview' && (
            <div>
              {!canPreview ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {doc.status === 'failed'
                      ? 'Preview unavailable — document processing failed.'
                      : doc.fileType === 'image'
                      ? 'Image preview not available in this view.'
                      : 'Preview will be available after processing completes.'}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Extracted Text Preview
                    </p>
                    <button onClick={handleCopy}
                      className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-900/60 p-4 font-mono text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {doc.extractedTextPreview}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Metadata tab */}
          {activeTab === 'metadata' && (
            <div className="space-y-2">
              {[
                { icon: FileText,  label: 'File name',   value: doc.originalName },
                { icon: Hash,      label: 'File type',   value: doc.fileType.toUpperCase() },
                { icon: FileText,  label: 'Size',        value: formatFileSize(doc.size) },
                { icon: Calendar,  label: 'Uploaded',    value: formatDate(doc.uploadedAt) },
                { icon: Calendar,  label: 'Processed',   value: doc.processedAt ? formatDate(doc.processedAt) : '—' },
                { icon: Shield,    label: 'Index status',value: doc.indexingStatus.replace('_', ' ') },
                { icon: Hash,      label: 'Pages',       value: doc.pageCount ?? '—' },
                { icon: Hash,      label: 'Chunks',      value: doc.chunkCount ?? '—' },
                { icon: Hash,      label: 'Words',       value: doc.wordCount ? doc.wordCount.toLocaleString() : '—' },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <row.icon className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="w-28 text-xs font-medium text-gray-500 dark:text-gray-400 shrink-0">{row.label}</span>
                  <span className="text-sm text-gray-900 dark:text-white">{String(row.value)}</span>
                </div>
              ))}

              {doc.tags && doc.tags.length > 0 && (
                <div className="flex items-start gap-3 pt-2">
                  <Tag className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                  <span className="w-28 text-xs font-medium text-gray-500 dark:text-gray-400 shrink-0">Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {doc.tags.map(t => (
                      <span key={t} className="rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {docCollections.length > 0 && (
                <div className="pt-3">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Collections</p>
                  <div className="flex flex-wrap gap-2">
                    {docCollections.map(c => (
                      <span key={c.id} className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white"
                        style={{ backgroundColor: c.color }}>
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chunks tab */}
          {activeTab === 'chunks' && (
            <div>
              {chunks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No chunks available yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Showing {chunks.length} of {doc.chunkCount ?? 0} total chunks
                  </p>
                  {chunks.map(chunk => (
                    <div key={chunk.id} className="rounded-xl border border-gray-200 dark:border-gray-700 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Chunk #{chunk.id}
                        </span>
                        <span className="text-xs text-gray-400">~{chunk.tokens} tokens</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                        {chunk.preview}
                      </p>
                    </div>
                  ))}
                  {(doc.chunkCount ?? 0) > 5 && (
                    <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                      + {(doc.chunkCount ?? 0) - 5} more chunks
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
