import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, User } from 'lucide-react'
import { ROUTES } from '@/utils/constants'
import { registerSchema, type RegisterFormValues } from '../schemas'
import { useRegister, extractMessage } from '../hooks'
import { AuthCard, PasswordInput, SocialLoginButton } from '../components'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

export default function RegisterPage() {
  const registerMutation = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirm_password: '' },
  })

  useEffect(() => {
    if (registerMutation.isError) {
      setError('root', { message: extractMessage(registerMutation.error) })
    }
  }, [registerMutation.isError, registerMutation.error, setError])

  const onSubmit = (data: RegisterFormValues) => registerMutation.mutate(data)
  const isBusy = isSubmitting || registerMutation.isPending
  const password = watch('password')

  const strength = [password.length >= 8, /[A-Z]/.test(password), /[a-z]/.test(password), /[0-9]/.test(password)].filter(Boolean).length
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'][strength]

  return (
    <AuthCard title="Create an account" subtitle="Start your research journey today">
      {errors.root && (
        <div role="alert" className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {errors.root.message}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input {...register('name')} id="name" label="Full name" placeholder="John Doe" autoComplete="name" required fullWidth disabled={isBusy} error={errors.name?.message} leftIcon={<User className="h-4 w-4" />} />
        <Input {...register('email')} id="email" type="email" label="Email" placeholder="you@example.com" autoComplete="email" required fullWidth disabled={isBusy} error={errors.email?.message} leftIcon={<Mail className="h-4 w-4" />} />
        <div>
          <PasswordInput {...register('password')} id="password" label="Password" placeholder="Min. 8 characters" autoComplete="new-password" required disabled={isBusy} error={errors.password?.message} />
          {password && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1,2,3,4].map((i) => (<div key={i} className={h-1 flex-1 rounded-full transition-colors } />))}
              </div>
              {strengthLabel && <p className="text-xs text-gray-500 dark:text-gray-400">Password strength: <span className="font-medium text-gray-700 dark:text-gray-300">{strengthLabel}</span></p>}
            </div>
          )}
        </div>
        <PasswordInput {...register('confirm_password')} id="confirm_password" label="Confirm password" placeholder="Re-enter your password" autoComplete="new-password" required disabled={isBusy} error={errors.confirm_password?.message} />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          By creating an account, you agree to our <a href="#" className="text-primary-600 hover:underline dark:text-primary-400">Terms of Service</a> and <a href="#" className="text-primary-600 hover:underline dark:text-primary-400">Privacy Policy</a>.
        </p>
        <Button type="submit" fullWidth loading={isBusy} className="mt-2">Create account</Button>
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
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="font-medium text-primary-600 hover:underline dark:text-primary-400">Sign in</Link>
      </p>
    </AuthCard>
  )
}