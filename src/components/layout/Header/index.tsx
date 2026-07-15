import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, Bell, Sun, Moon, Menu, ChevronDown, User, LogOut, Settings } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/utils/helpers'
import { ROUTES } from '@/utils/constants'

const PAGE_TITLES: Record<string, string> = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.CHAT]:      'Chat',
  [ROUTES.RESEARCH]:  'Research',
  [ROUTES.REPORTS]:   'Reports',
  [ROUTES.FILES]:     'Files',
  [ROUTES.SETTINGS]:  'Settings',
}

interface HeaderProps {
  onMobileMenuOpen: () => void
}

export default function Header({ onMobileMenuOpen }: HeaderProps) {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const [profileOpen, setProfileOpen] = useState(false)

  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Research Assistant'

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 md:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuOpen}
        className="md:hidden rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Page title */}
      <h1 className="text-base font-semibold text-gray-900 dark:text-white">
        {pageTitle}
      </h1>

      <div className="flex-1" />

      {/* Search — desktop */}
      <div className="hidden md:flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 w-60 focus-within:border-primary-400 focus-within:ring-1 focus-within:ring-primary-400 transition-shadow">
        <Search className="h-4 w-4 shrink-0 text-gray-400" />
        <input
          type="text"
          placeholder="Search…"
          className="w-full bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none"
        />
      </div>

      {/* Theme toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title="Toggle theme"
      >
        {theme === 'dark'
          ? <Sun className="h-5 w-5" />
          : <Moon className="h-5 w-5" />}
      </button>

      {/* Notifications */}
      <button
        className="relative rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
      </button>

      {/* Profile dropdown */}
      <div className="relative">
        <button
          onClick={() => setProfileOpen((v) => !v)}
          className={cn(
            'flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors',
            'hover:bg-gray-100 dark:hover:bg-gray-800',
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-white text-xs font-semibold select-none">
            U
          </div>
          <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform', profileOpen && 'rotate-180')} />
        </button>

        {profileOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
            <div className="absolute right-0 top-full z-20 mt-1 w-52 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl py-1 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">User</p>
                <p className="text-xs text-gray-500 truncate">user@example.com</p>
              </div>
              <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <User className="h-4 w-4 text-gray-400" />
                Profile
              </button>
              <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Settings className="h-4 w-4 text-gray-400" />
                Settings
              </button>
              <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
              <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
