import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { ROUTES } from '@/utils/constants'
import { resetPasswordSchema, type ResetPasswordFormValues } from '../schemas'
import { useResetPassword, extractMessage } from '../hooks'
import { AuthCard, PasswordInput } from '../components'
import Button from '@/components/common/Button'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const resetPassword = useResetPassword()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirm_password: '' },
  })

  useEffect(() => {
    if (resetPassword.isError) {
      setError('root', { message: extractMessage(resetPassword.error) })
    }
  }, [resetPassword.isError, resetPassword.error, setError])

  const onSubmit = (data: ResetPasswordFormValues) =>
    resetPassword.mutate({ ...data, token })

  const isBusy = isSubmitting || resetPassword.isPending
  const password = watch('password')
  const strength = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
  ].filter(Boolean).length
  const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'][strength]

  if (!token) {
    return (
      <AuthCard title="Invalid link" subtitle="">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
            <AlertCircle className="h-7 w-7" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This password reset link is invalid or has expired.
          </p>
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
          >
            Request a new reset link
          </Link>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Set a new password" subtitle="Choose a strong password for your account.">
      {errors.root && (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400"
        >
          {errors.root.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <PasswordInput
            {...register('password')}
            id="password"
            label="New password"
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            required
            disabled={isBusy}
            error={errors.password?.message}
          />
          {password && (
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i <= strength ? strengthColor : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <PasswordInput
          {...register('confirm_password')}
          id="confirm_password"
          label="Confirm new password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          required
          disabled={isBusy}
          error={errors.confirm_password?.message}
        />

        <Button type="submit" fullWidth loading={isBusy}>
          Reset password
        </Button>
      </form>

      <Link
        to={ROUTES.LOGIN}
        className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>
    </AuthCard>
  )
}
