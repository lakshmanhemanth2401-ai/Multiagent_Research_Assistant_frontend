import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { ROUTES } from '@/utils/constants'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../schemas'
import { useForgotPassword, extractMessage } from '../hooks'
import { AuthCard } from '../components'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    getValues,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  useEffect(() => {
    if (forgotPassword.isError) {
      setError('root', { message: extractMessage(forgotPassword.error) })
    }
  }, [forgotPassword.isError, forgotPassword.error, setError])

  const onSubmit = (data: ForgotPasswordFormValues) => forgotPassword.mutate(data)
  const isBusy = isSubmitting || forgotPassword.isPending

  if (forgotPassword.isSuccess) {
    return (
      <AuthCard title="Check your email" subtitle="">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We sent a password reset link to{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {getValues('email')}
              </span>
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Didn&apos;t receive it? Check your spam folder or{' '}
              <button
                type="button"
                onClick={() => forgotPassword.reset()}
                className="text-primary-600 hover:underline dark:text-primary-400 font-medium"
              >
                try another email
              </button>
              .
            </p>
          </div>
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 text-sm text-primary-600 hover:underline dark:text-primary-400 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link."
    >
      {errors.root && (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400"
        >
          {errors.root.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          {...register('email')}
          id="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          autoComplete="email"
          required
          fullWidth
          disabled={isBusy}
          error={errors.email?.message}
          leftIcon={<Mail className="h-4 w-4" />}
        />

        <Button type="submit" fullWidth loading={isBusy}>
          Send reset link
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
