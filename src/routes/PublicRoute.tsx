import { Outlet, Navigate } from 'react-router-dom'
import { ROUTES } from '@/utils/constants'

// Auth check placeholder — authentication not yet implemented (Day 2)
export default function PublicRoute() {
  const isAuthenticated = false // TODO: replace with useAuthStore
  return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Outlet />
}
