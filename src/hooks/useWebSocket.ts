mport { useEffect, useRef, useCallback } from 'react'

interface UseWebSocketOptions {
  onMessage?: (data: unknown) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Event) => void
  enabled?: boolean
}

export function useWebSocket(url: string | null, options: UseWebSocketOptions = {}) {
  const wsRef = useRef<WebSocket | null>(null)
  const optionsRef = useRef(options)
  optionsRef.current = options

  useEffect(() => {
    if (!url || options.enabled === false) return

    const ws = new WebSocket(url)
    ws.onopen = () => optionsRef.current.onOpen?.()
    ws.onclose = () => optionsRef.current.onClose?.()
    ws.onerror = (e) => optionsRef.current.onError?.(e)
    ws.onmessage = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data as string) as unknown
        optionsRef.current.onMessage?.(data)
      } catch {
        optionsRef.current.onMessage?.(e.data)
      }
    }
    wsRef.current = ws
    return () => {
      ws.close()
      wsRef.current = null
    }
  }, [url, options.enabled])

  const send = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
    }
  }, [])

  return { send, ws: wsRef.current }
}
