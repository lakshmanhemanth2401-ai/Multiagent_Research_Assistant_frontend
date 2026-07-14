mport { create } from 'zustand'
import type { ResearchSession } from '@/types/research'

interface ResearchStore {
  sessions: ResearchSession[]
  activeSessionId: string | null
  setActiveSession: (id: string | null) => void
  addSession: (session: ResearchSession) => void
  updateSession: (id: string, updates: Partial<ResearchSession>) => void
  removeSession: (id: string) => void
}

export const useResearchStore = create<ResearchStore>((set) => ({
  sessions: [],
  activeSessionId: null,
  setActiveSession: (id) => set({ activeSessionId: id }),
  addSession: (session) =>
    set((state) => ({ sessions: [session, ...state.sessions] })),
  updateSession: (id, updates) =>
    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),
  removeSession: (id) =>
    set((state) => ({ sessions: state.sessions.filter((s) => s.id !== id) })),
}))
