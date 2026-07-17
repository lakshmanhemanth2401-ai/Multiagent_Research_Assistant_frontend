import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { useUIStore } from '@/store/ui.store'
import * as authService from '@/services/auth'
import type {
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
} from '@/types/auth'
import { ROUTES, QUERY_KEYS } from '@/utils/constants'

// ─── helpers ──────────────────────────────────────────────────────────────────

function extractMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message
  }
  return fallback
}

// ─── useLogin ─────────────────────────────────────────────────────────────────

export function useLogin() {
  const { setUser, setTokens } = useAuthStore()
  const { addToast } = useUIStore()
  const navigate = useNavigate()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: ({ user, tokens }) => {
      setUser(user)
      setTokens(tokens.access_token, tokens.refresh_token)
      qc.setQueryData(QUERY_KEYS.USER, user)
      addToast({ type: 'success', message: `Welcome back, ${user.name}!` })
      const from =
        (window.history.state?.usr?.from as Location | undefined)?.pathname ?? ROUTES.DASHBOARD
      navigate(from, { replace: true })
    },
    onError: (err) => {
      addToast({ type: 'error', message: extractMessage(err, 'Sign in failed. Please try again.') })
    },
  })
}

// ─── useRegister ──────────────────────────────────────────────────────────────

export function useRegister() {
  const { setUser, setTokens } = useAuthStore()
  const { addToast } = useUIStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => authService.register(credentials),
    onSuccess: ({ user, tokens }) => {
      setUser(user)
      setTokens(tokens.access_token, tokens.refresh_token)
      addToast({ type: 'success', message: 'Account created! Welcome aboard.' })
      if (!user.email_verified) {
        navigate(ROUTES.VERIFY_EMAIL, { replace: true })
      } else {
        navigate(ROUTES.DASHBOARD, { replace: true })
      }
    },
    onError: (err) => {
      addToast({ type: 'error', message: extractMessage(err, 'Registration failed. Please try again.') })
    },
  })
}

// ─── useLogout ────────────────────────────────────────────────────────────────

export function useLogout() {
  const { logout } = useAuthStore()
  const { addToast } = useUIStore()
  const navigate = useNavigate()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      logout()
      qc.clear()
      addToast({ type: 'info', message: 'You have been signed out.' })
      navigate(ROUTES.LOGIN, { replace: true })
    },
  })
}

// ─── useCurrentUser ───────────────────────────────────────────────────────────

export function useCurrentUser() {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: QUERY_KEYS.USER,
    queryFn: () => authService.getMe(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 min
  })
}

// ─── useForgotPassword ────────────────────────────────────────────────────────

export function useForgotPassword() {
  return useMutation({
    mutationFn: (req: ForgotPasswordRequest) => authService.forgotPassword(req),
  })
}

// ─── useResetPassword ─────────────────────────────────────────────────────────

export function useResetPassword() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (req: ResetPasswordRequest) => authService.resetPassword(req),
    onSuccess: () => {
      navigate(ROUTES.LOGIN, { replace: true, state: { passwordReset: true } })
    },
  })
}

// ─── useVerifyEmail ───────────────────────────────────────────────────────────

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (req: VerifyEmailRequest) => authService.verifyEmail(req),
  })
}

// ─── useResendVerification ────────────────────────────────────────────────────

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => authService.resendVerification(email),
  })
}

// ─── utility re-export ────────────────────────────────────────────────────────

export { extractMessage }
