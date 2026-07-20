import { Microscope, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { ROUTES } from '@/utils/constants'
import Button from '@/components/common/Button'

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function getFirstName(name: string): string {
  return name.split(' ')[0]
}

export default function WelcomeSection() {
  const user = useAuthStore((s) => s.user)
  const greeting = getGreeting()
  const firstName = user ? getFirstName(user.name) : 'Researcher'

  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <div>
        <div className='flex items-center gap-2 mb-1'>
          <Sparkles className='h-4 w-4 text-primary-500' aria-hidden='true' />
          <p className='text-sm font-medium text-primary-600 dark:text-primary-400'>{greeting}</p>
        </div>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl'>
          Welcome back, {firstName}!
        </h1>
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          Here&apos;s what&apos;s happening with your research today.
        </p>
      </div>

      <div className='flex items-center gap-3 shrink-0'>
        <Link to={ROUTES.RESEARCH}>
          <Button leftIcon={<Microscope className='h-4 w-4' />}>
            New Research
          </Button>
        </Link>
      </div>
    </div>
  )
}
