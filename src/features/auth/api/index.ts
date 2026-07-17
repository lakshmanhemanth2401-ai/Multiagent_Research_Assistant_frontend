/**
 * Mock auth API — replace each function body with a real apiClient call
 * once the backend is available.  All functions return the same shape that
 * the real API will return so the hooks / store never need to change.
 */
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  RefreshTokenResponse,
  User,
} from '@/types/auth'

// ─── helpers ──────────────────────────────────────────────────────────────────

const delay = (ms = 900) => new Promise<void>((r) => setTimeout(r, ms))

const MOCK_USER: User = {
  id: 'usr_mock_001',
  email: 'demo@research.ai',
  name: 'Demo User',
  avatar: undefined,
  role: 'user',
  email_verified: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

const MOCK_TOKENS = {
  access_token: 'mock_access_token_' + Date.now(),
  refresh_token: 'mock_refresh_token_' + Date.now(),
  token_type: 'Bearer',
  expires_in: 3600,
}

// ─── endpoints ────────────────────────────────────────────────────────────────

export async function apiLogin(credentials: LoginCredentials): Promise<AuthResponse> {
  await delay()
  // Simulate wrong credentials
  if (credentials.password === 'wrong') {
    throw Object.assign(new Error('Invalid email or password.'), { status: 401 })
  }
  return {
    user: { ...MOCK_USER, email: credentials.email },
    tokens: { ...MOCK_TOKENS, access_token: 'mock_access_' + Date.now() },
  }
}

export async function apiRegister(credentials: RegisterCredentials): Promise<AuthResponse> {
  await delay()
  if (credentials.email === 'taken@example.com') {
    throw Object.assign(new Error('An account with this email already exists.'), { status: 409 })
  }
  return {
    user: {
      ...MOCK_USER,
      id: 'usr_new_' + Date.now(),
      email: credentials.email,
      name: credentials.name,
      email_verified: false,
    },
    tokens: { ...MOCK_TOKENS, access_token: 'mock_access_' + Date.now() },
  }
}

export async function apiLogout(): Promise<void> {
  await delay(300)
}

export async function apiRefreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
  await delay(400)
  if (!refreshToken) throw Object.assign(new Error('No refresh token.'), { status: 401 })
  return { access_token: 'mock_refreshed_' + Date.now(), expires_in: 3600 }
}

export async function apiGetMe(): Promise<User> {
  await delay(400)
  return MOCK_USER
}

export async function apiForgotPassword(req: ForgotPasswordRequest): Promise<{ message: string }> {
  await delay()
  // Always succeed to avoid user enumeration
  void req
  return { message: 'If an account exists for that email, a reset link has been sent.' }
}

export async function apiResetPassword(req: ResetPasswordRequest): Promise<{ message: string }> {
  await delay()
  if (req.token === 'invalid') {
    throw Object.assign(new Error('This reset link is invalid or has expired.'), { status: 400 })
  }
  return { message: 'Your password has been reset. You can now sign in.' }
}

export async function apiVerifyEmail(req: VerifyEmailRequest): Promise<{ message: string }> {
  await delay()
  if (req.token === 'invalid') {
    throw Object.assign(new Error('This verification link is invalid or has expired.'), {
      status: 400,
    })
  }
  return { message: 'Your email has been verified. You can now sign in.' }
}

export async function apiResendVerification(email: string): Promise<{ message: string }> {
  await delay()
  void email
  return { message: 'A new verification email has been sent.' }
}
