import { Outlet, Navigate } from 'react-router-dom'
import { ROUTES } from '@/utils/constants'

// Auth check placeholder — authentication not yet implemented (Day 2)
export default function ProtectedRoute() {
  const isAuthenticated = true // TODO: replace with useAuthStore
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />
}
