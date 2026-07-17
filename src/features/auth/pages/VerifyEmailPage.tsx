import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, AlertCircle, Loader2, Mail } from 'lucide-react'
import { ROUTES } from '@/utils/constants'
import { useVerifyEmail, useResendVerification } from '../hooks'
import { AuthCard } from '../components'
import Button from '@/components/common/Button'
import { useAuthStore } from '@/store/auth.store'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const verifyEmail = useVerifyEmail()
  const resend = useResendVerification()
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    if (token) {
      verifyEmail.mutate({ token })
    }
    // Only run on mount with token
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  // ── Auto-verification flow (token in URL) ──────────────────────────────────
  if (token) {
    if (verifyEmail.isPending) {
      return (
        <AuthCard title="Verifying your email…" subtitle="">
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please wait while we verify your email address.
            </p>
          </div>
        </AuthCard>
      )
    }

    if (verifyEmail.isSuccess) {
      return (
        <AuthCard title="Email verified!" subtitle="">
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your email has been verified. You can now access all features.
            </p>
            <Link to={ROUTES.DASHBOARD}>
              <Button>Go to dashboard</Button>
            </Link>
          </div>
        </AuthCard>
      )
    }

    if (verifyEmail.isError) {
      return (
        <AuthCard title="Verification failed" subtitle="">
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <AlertCircle className="h-7 w-7" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This verification link is invalid or has expired.
            </p>
            {user?.email && (
              <Button
                variant="outline"
                loading={resend.isPending}
                onClick={() => resend.mutate(user.email)}
              >
                Resend verification email
              </Button>
            )}
            <Link
              to={ROUTES.LOGIN}
              className="text-sm text-primary-600 hover:underline dark:text-primary-400"
            >
              Back to sign in
            </Link>
          </div>
        </AuthCard>
      )
    }
  }

  // ── No token: informational / resend page ─────────────────────────────────
  return (
    <AuthCard title="Check your inbox" subtitle="">
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
          <Mail className="h-7 w-7" />
        </div>

        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We sent a verification link to{' '}
            {user?.email ? (
              <span className="font-semibold text-gray-900 dark:text-white">{user.email}</span>
            ) : (
              'your email address'
            )}
            .
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Please check your inbox and click the link to verify your account.
          </p>
        </div>

        {resend.isSuccess && (
          <div
            role="status"
            className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-2 text-sm text-green-700 dark:text-green-400"
          >
            Verification email resent successfully.
          </div>
        )}

        {user?.email && (
          <Button
            variant="outline"
            loading={resend.isPending}
            onClick={() => resend.mutate(user.email)}
          >
            Resend verification email
          </Button>
        )}

        <Link
          to={ROUTES.LOGIN}
          className="text-sm text-primary-600 hover:underline dark:text-primary-400"
        >
          Back to sign in
        </Link>
      </div>
    </AuthCard>
  )
}
