import { Link } from 'react-router-dom'
import { Clock, LogIn } from 'lucide-react'
import { ROUTES } from '@/utils/constants'
import { AuthCard } from '../components'
import Button from '@/components/common/Button'

export default function SessionExpiredPage() {
  return (
    <AuthCard title="Session expired" subtitle="">
      <div className="flex flex-col items-center gap-5 py-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
          <Clock className="h-8 w-8" />
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
            Your session has expired for security reasons.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please sign in again to continue where you left off.
          </p>
        </div>

        <Link to={ROUTES.LOGIN} replace className="w-full">
          <Button fullWidth leftIcon={<LogIn className="h-4 w-4" />}>
            Sign in again
          </Button>
        </Link>

        <p className="text-xs text-gray-400 dark:text-gray-500">
          Your work is saved — you won&apos;t lose any progress.
        </p>
      </div>
    </AuthCard>
  )
}
