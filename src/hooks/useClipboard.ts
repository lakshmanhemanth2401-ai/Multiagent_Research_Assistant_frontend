mport { useState, useCallback } from 'react'

export function useClipboard(resetTimeout = 2000) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!navigator?.clipboard) return false
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), resetTimeout)
        return true
      } catch {
        return false
      }
    },
    [resetTimeout],
  )

  return { copied, copy }
}
