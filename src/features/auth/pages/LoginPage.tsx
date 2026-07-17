import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'lucide-react'
import { ROUTES } from '@/utils/constants'
import { loginSchema, type LoginFormValues } from '../schemas'
import { useLogin, extractMessage } from '../hooks'
import { AuthCard, PasswordInput, SocialLoginButton } from '../components'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

export default function LoginPage() {
  const location = useLocation()
  const login = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember_me: false },
  })

  const passwordReset = (location.state as { passwordReset?: boolean } | null)?.passwordReset

  useEffect(() => {
    if (login.isError) {
      setError('root', { message: extractMessage(login.error) })
    }
  }, [login.isError, login.error, setError])

  const onSubmit = (data: LoginFormValues) => login.mutate(data)
  const isBusy = isSubmitting || login.isPending

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your account">
      {passwordReset && (
        <div role="status" className="mb-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          Your password has been reset successfully. Please sign in.
        </div>
      )}
      {errors.root && (
        <div role="alert" className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {errors.root.message}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          {...register('email')}
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          fullWidth
          disabled={isBusy}
          error={errors.email?.message}
          leftIcon={<Mail className="h-4 w-4" />}
        />
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password <span className="text-red-500">*</span>
            </label>
            <Link to={ROUTES.FORGOT_PASSWORD} className="text-xs text-primary-600 hover:underline dark:text-primary-400">
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            {...register('password')}
            id="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            disabled={isBusy}
            error={errors.password?.message}
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input {...register('remember_me')} type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Remember me for 30 days</span>
        </label>
        <Button type="submit" fullWidth loading={isBusy} className="mt-2">Sign in</Button>
      </form>
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        <span className="text-xs text-gray-400">or</span>
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="space-y-3">
        <SocialLoginButton provider="google" disabled />
        <SocialLoginButton provider="github" disabled />
      </div>
      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{' '}
        <Link to={ROUTES.REGISTER} className="font-medium text-primary-600 hover:underline dark:text-primary-400">Sign up</Link>
      </p>
    </AuthCard>
  )
}