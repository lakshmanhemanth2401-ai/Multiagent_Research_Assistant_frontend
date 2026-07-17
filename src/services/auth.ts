/**
 * auth.ts — thin wrapper that re-exports the auth API functions.
 * By centralising imports here, feature code and hooks only depend on
 * this service; swapping mock → real implementation only touches /api/.
 */
export {
  apiLogin    as login,
  apiRegister as register,
  apiLogout   as logout,
  apiRefreshToken as refreshToken,
  apiGetMe    as getMe,
  apiForgotPassword as forgotPassword,
  apiResetPassword  as resetPassword,
  apiVerifyEmail    as verifyEmail,
  apiResendVerification as resendVerification,
} from '@/features/auth/api'
