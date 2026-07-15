import { Outlet } from 'react-router-dom'
import { Microscope } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/30">
            <Microscope className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Research Assistant
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Multi-Agent AI Research Platform
          </p>
        </div>

        <Outlet />
      </div>
    </div>
  )
}
