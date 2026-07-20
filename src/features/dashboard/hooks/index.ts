import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/utils/constants'
import {
  fetchDashboardStats,
  fetchRecentSessions,
  fetchRecentReports,
  fetchActivityFeed,
  fetchResearchProgress,
  fetchNotifications,
} from '../api'

const STALE = 2 * 60 * 1000 // 2 minutes

export function useDashboardStats() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_STATS,
    queryFn: fetchDashboardStats,
    staleTime: STALE,
  })
}

export function useRecentSessions() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_SESSIONS,
    queryFn: fetchRecentSessions,
    staleTime: STALE,
  })
}

export function useRecentReports() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_REPORTS,
    queryFn: fetchRecentReports,
    staleTime: STALE,
  })
}

export function useActivityFeed() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_ACTIVITY,
    queryFn: fetchActivityFeed,
    staleTime: STALE,
  })
}

export function useResearchProgress() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_PROGRESS,
    queryFn: fetchResearchProgress,
    staleTime: 30 * 1000, // refresh more often for live progress
    refetchInterval: 30 * 1000,
  })
}

export function useNotifications() {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_NOTIFS,
    queryFn: fetchNotifications,
    staleTime: STALE,
  })
}
