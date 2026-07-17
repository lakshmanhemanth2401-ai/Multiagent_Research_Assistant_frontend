export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role?: 'user' | 'admin'
  email_verified?: boolean
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember_me?: boolean
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  confirm_password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
  confirm_password: string
}

export interface VerifyEmailRequest {
  token: string
}

export interface ResendVerificationRequest {
  email: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

export interface RefreshTokenResponse {
  access_token: string
  expires_in: number
}
