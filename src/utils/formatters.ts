import { format, formatDistanceToNow, isValid } from 'date-fns'

export function formatDate(date: string | Date, pattern = 'MMM d, yyyy'): string {
  const d = new Date(date)
  return isValid(d) ? format(d, pattern) : ''
}
export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'MMM d, yyyy HH:mm')
}
export function formatRelativeTime(date: string | Date): string {
  const d = new Date(date)
  return isValid(d) ? formatDistanceToNow(d, { addSuffix: true }) : ''
}
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes, i = 0
  while (size >= 1024 && i < units.length - 1) { size /= 1024; i++ }
  return size.toFixed(1) + ' ' + units[i]
}
export function formatTokenCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  return String(n)
}
