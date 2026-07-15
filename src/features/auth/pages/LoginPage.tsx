import { Link } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { ROUTES } from '@/utils/constants'

export default function LoginPage() {
  return (
    <div className='rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg border border-gray-100 dark:border-gray-700'>
      <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Welcome back</h2>
      <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>Sign in to your account</p>

      <form className='mt-6 space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
            Email
          </label>
          <div className='flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-shadow'>
            <Mail className='h-4 w-4 shrink-0 text-gray-400' />
            <input
              type='email'
              placeholder='you@example.com'
              className='flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none'
            />
          </div>
        </div>

        <div>
          <div className='flex items-center justify-between mb-1.5'>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Password
            </label>
            <button type='button' className='text-xs text-primary-600 hover:underline'>
              Forgot password?
            </button>
          </div>
          <div className='flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2.5 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-shadow'>
            <Lock className='h-4 w-4 shrink-0 text-gray-400' />
            <input
              type='password'
              placeholder='••••••••'
              className='flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none'
            />
          </div>
        </div>

        <button
          type='submit'
          className='w-full rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition-colors'
        >
          Sign in
        </button>
      </form>

      <p className='mt-5 text-center text-sm text-gray-500 dark:text-gray-400'>
        Don&apos;t have an account?{' '}
        <Link to={ROUTES.REGISTER} className='font-medium text-primary-600 hover:underline'>
          Sign up
        </Link>
      </p>
    </div>
  )
}
