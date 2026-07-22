import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useResearchStore } from '@/store/research.store'
import { QUERY_KEYS, ROUTES } from '@/utils/constants'
import type { ResearchConfig } from '@/types/research'
import { listResearchSessionsApi } from '../api'

export function useResearchSessions() {
  return useQuery({
    queryKey: QUERY_KEYS.RESEARCH_SESSIONS,
    queryFn: listResearchSessionsApi,
    staleTime: 60_000,
  })
}

export function useResearchSession(sessionId: string | undefined) {
  return useResearchStore(state =>
    sessionId ? state.sessions[sessionId] : undefined
  )
}

export function useStartResearch() {
  const navigate = useNavigate()
  const startExecution = useResearchStore(s => s.startExecution)

  return useMutation({
    mutationFn: async (config: ResearchConfig) => {
      // Brief artificial delay to simulate API call
      await new Promise(r => setTimeout(r, 600))
      return startExecution(config)
    },
    onSuccess: (sessionId) => {
      navigate(ROUTES.RESEARCH_WORKSPACE.replace(':sessionId', sessionId))
    },
  })
}

export function useResearchSimulation(sessionId: string | undefined) {
  const tickExecution = useResearchStore(s => s.tickExecution)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!sessionId) return

    intervalRef.current = setInterval(() => {
      const session = useResearchStore.getState().sessions[sessionId]
      if (!session) return
      const isRunning = ['planning', 'researching', 'writing', 'reviewing'].includes(session.status)
      if (isRunning) {
        tickExecution(sessionId)
      }
      if (['completed', 'cancelled', 'failed'].includes(session.status)) {
        clearInterval(intervalRef.current!)
        intervalRef.current = null
      }
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [sessionId, tickExecution])
}
