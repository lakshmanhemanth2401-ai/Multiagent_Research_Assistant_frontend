import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { ROUTES } from '@/utils/constants'

export default function PublicRoute() {
  const { isAuthenticated, isInitialized } = useAuthStore()

  // While hydrating from storage, let through (ProtectedRoute handles the guard)
  if (!isInitialized) return <Outlet />

  return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Outlet />
}
