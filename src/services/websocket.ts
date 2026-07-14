type MessageHandler = (data: unknown) => void

export class WebSocketService {
  private ws: WebSocket | null = null
  private handlers = new Map<string, MessageHandler[]>()

  connect(url: string): void {
    this.ws = new WebSocket(url)
    this.ws.onmessage = (e: MessageEvent) => {
      try {
        const p = JSON.parse(e.data as string) as { type?: string; data?: unknown }
        this.handlers.get(p.type ?? 'message')?.forEach((h) => h(p.data))
      } catch { this.handlers.get('message')?.forEach((h) => h(e.data)) }
    }
  }
  disconnect(): void { this.ws?.close(); this.ws = null; this.handlers.clear() }
  on(event: string, handler: MessageHandler): void {
    this.handlers.set(event, [...(this.handlers.get(event) ?? []), handler])
  }
  send(data: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(data))
  }
}
export const wsService = new WebSocketService()
