import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
export function generateId(): string { return crypto.randomUUID() }
export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}
export function truncate(str: string, max: number): string {
  return str.length <= max ? str : str.slice(0, max - 1) + '\u2026'
}
export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}
export function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url)
}
