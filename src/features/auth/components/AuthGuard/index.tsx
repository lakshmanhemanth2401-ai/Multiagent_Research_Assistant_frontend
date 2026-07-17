import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { ROUTES } from '@/utils/constants'
import LoadingOverlay from '../LoadingOverlay'

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * Wraps any component tree that requires the user to be authenticated.
 * Shows a loading overlay while the store is hydrating from storage.
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isInitialized } = useAuthStore()
  const location = useLocation()

  if (!isInitialized) {
    return <LoadingOverlay message='Restoring session…' />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return <>{children}</>
}
