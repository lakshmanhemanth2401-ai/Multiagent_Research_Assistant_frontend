export const storage = {
  get: <T>(key: string): T | null => {
    try { const i = localStorage.getItem(key); return i ? JSON.parse(i) as T : null }
    catch { return null }
  },
  set: <T>(key: string, value: T): void => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
  },
  remove: (key: string) => localStorage.removeItem(key),
  clear: () => localStorage.clear(),
}
