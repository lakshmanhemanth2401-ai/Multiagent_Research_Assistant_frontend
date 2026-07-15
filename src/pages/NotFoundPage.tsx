import { Link } from 'react-router-dom'
import { Microscope, Home } from 'lucide-react'
import { ROUTES } from '@/utils/constants'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 mb-6">
        <Microscope className="h-8 w-8" />
      </div>
      <p className="text-7xl font-extrabold text-primary-600 dark:text-primary-400">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
        Page not found
      </h1>
      <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to={ROUTES.HOME}
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition-colors"
      >
        <Home className="h-4 w-4" />
        Back to home
      </Link>
    </div>
  )
}
