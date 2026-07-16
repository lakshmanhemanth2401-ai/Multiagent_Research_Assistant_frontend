import { AlertTriangle } from 'lucide-react'
import Modal from '../Modal'
import Button from '../Button'

export interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  loading?: boolean
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading,
}: ConfirmDialogProps) {
  const iconColor = {
    danger: 'text-red-600 bg-red-100 dark:bg-red-900/30',
    warning: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
    info: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
  }[variant]

  const btnVariant = variant === 'danger' ? 'danger' : 'primary'

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      hideClose
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading} size="sm">
            {cancelLabel}
          </Button>
          <Button
            variant={btnVariant}
            onClick={onConfirm}
            loading={loading}
            size="sm"
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-4">
        <div className={`shrink-0 rounded-xl p-3 ${iconColor}`}>
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </Modal>
  )
}
