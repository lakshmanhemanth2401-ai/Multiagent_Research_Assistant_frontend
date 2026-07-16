import { useRef, useState } from 'react'
import { UploadCloud, X, FileText, Image, File } from 'lucide-react'
import { cn } from '@/utils/helpers'

export interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSizeMB?: number
  onFilesSelected?: (files: File[]) => void
  className?: string
  disabled?: boolean
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileIcon({ type }: { type: string }) {
  if (type.startsWith('image/')) return <Image className="h-4 w-4 text-blue-500" />
  if (type === 'application/pdf' || type.includes('text')) return <FileText className="h-4 w-4 text-red-500" />
  return <File className="h-4 w-4 text-gray-400" />
}

export default function FileUpload({
  accept,
  multiple,
  maxSizeMB = 50,
  onFilesSelected,
  className,
  disabled,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)

  const processFiles = (incoming: FileList | File[]) => {
    setError(null)
    const arr = Array.from(incoming)
    const maxBytes = maxSizeMB * 1024 * 1024
    const oversized = arr.filter((f) => f.size > maxBytes)
    if (oversized.length) {
      setError(`${oversized[0].name} exceeds the ${maxSizeMB} MB limit.`)
      return
    }
    const next = multiple ? [...files, ...arr] : arr
    setFiles(next)
    onFilesSelected?.(next)
  }

  const remove = (idx: number) => {
    const next = files.filter((_, i) => i !== idx)
    setFiles(next)
    onFilesSelected?.(next)
  }

  return (
    <div className={cn('w-full space-y-3', className)}>
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (!disabled) processFiles(e.dataTransfer.files)
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 cursor-pointer',
          'transition-colors text-center select-none',
          dragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50',
          disabled && 'pointer-events-none opacity-50',
        )}
      >
        <UploadCloud className="mb-3 h-10 w-10 text-gray-400" aria-hidden="true" />
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Drop files here or <span className="text-primary-600 dark:text-primary-400">browse</span>
        </p>
        <p className="mt-1 text-xs text-gray-400">
          {accept ? `Accepts: ${accept}` : 'Any file type'} · Max {maxSizeMB} MB
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => e.target.files && processFiles(e.target.files)}
      />

      {error && (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, idx) => (
            <li
              key={`${file.name}-${idx}`}
              className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5"
            >
              <FileIcon type={file.type} />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">{file.name}</p>
                <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); remove(idx) }}
                aria-label={`Remove ${file.name}`}
                className="shrink-0 rounded p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
