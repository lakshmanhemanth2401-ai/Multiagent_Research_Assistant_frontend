import { useRef, useState, useCallback } from 'react'
import { UploadCloud, FolderOpen, AlertCircle, X } from 'lucide-react'
import { cn } from '@/utils/helpers'
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE_BYTES } from '../store'

const ACCEPTED_DISPLAY = 'PDF, DOCX, TXT, MD, PPTX, CSV, XLSX, Images'

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void
  onClose?: () => void
}

interface ValidationError { file: string; reason: string }

export default function DropZone({ onFilesSelected, onClose }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState<ValidationError[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFiles = useCallback((files: File[]): { valid: File[]; errors: ValidationError[] } => {
    const valid: File[] = []
    const errs: ValidationError[] = []
    for (const file of files) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        errs.push({ file: file.name, reason: `Unsupported type (.${ext})` })
      } else if (file.size > MAX_FILE_SIZE_BYTES) {
        errs.push({ file: file.name, reason: 'Exceeds 50 MB limit' })
      } else {
        valid.push(file)
      }
    }
    return { valid, errors: errs }
  }, [])

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return
    const { valid, errors } = validateFiles(Array.from(files))
    setErrors(errors)
    if (valid.length > 0) onFilesSelected(valid)
  }, [validateFiles, onFilesSelected])

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const onDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false) }
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="relative rounded-2xl border-2 border-dashed bg-white dark:bg-gray-800 transition-all duration-200"
      style={{ borderColor: isDragging ? 'var(--color-primary-400, #818cf8)' : undefined }}
    >
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 transition-colors"
          aria-label="Close upload zone"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div
        className={cn(
          'flex flex-col items-center justify-center gap-4 rounded-2xl px-6 py-12 text-center transition-colors',
          isDragging
            ? 'bg-primary-50 dark:bg-primary-900/20'
            : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/80',
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className={cn(
          'flex h-14 w-14 items-center justify-center rounded-2xl transition-colors',
          isDragging ? 'bg-primary-100 dark:bg-primary-900/40' : 'bg-gray-100 dark:bg-gray-700',
        )}>
          {isDragging
            ? <UploadCloud className="h-7 w-7 text-primary-600 dark:text-primary-400 animate-bounce" />
            : <FolderOpen className="h-7 w-7 text-gray-400 dark:text-gray-500" />}
        </div>

        <div>
          <p className="text-base font-semibold text-gray-900 dark:text-white">
            {isDragging ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            or{' '}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="font-medium text-primary-600 dark:text-primary-400 hover:underline"
            >
              browse your computer
            </button>
          </p>
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
            {ACCEPTED_DISPLAY} · Max 50 MB per file
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept={ALLOWED_EXTENSIONS.map(e => `.${e}`).join(',')}
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-1.5">
          {errors.map((err, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span className="font-medium truncate max-w-[200px]">{err.file}</span>
              <span className="text-gray-500">–</span>
              <span>{err.reason}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
