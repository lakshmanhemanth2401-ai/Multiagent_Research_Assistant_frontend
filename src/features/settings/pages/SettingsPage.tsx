import { Sun, Moon, Monitor, Bell, Shield, User } from 'lucide-react'

const sections = [
  { id: 'account',   label: 'Account',       icon: User,    description: 'Manage your profile and preferences' },
  { id: 'appearance', label: 'Appearance',   icon: Sun,     description: 'Customize the look and feel' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Control notification settings' },
  { id: 'security',  label: 'Security',      icon: Shield,  description: 'Password, MFA and sessions' },
]

export default function SettingsPage() {
  return (
    <div>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>Settings</h2>
        <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
          Manage your account and application preferences
        </p>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {sections.map((section) => (
          <button
            key={section.id}
            className='flex items-start gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 text-left hover:border-primary-300 dark:hover:border-primary-700 transition-colors'
          >
            <div className='rounded-lg bg-gray-100 dark:bg-gray-700 p-2.5 text-gray-600 dark:text-gray-400 shrink-0'>
              <section.icon className='h-5 w-5' />
            </div>
            <div>
              <p className='text-sm font-semibold text-gray-900 dark:text-white'>{section.label}</p>
              <p className='mt-0.5 text-xs text-gray-500 dark:text-gray-400'>{section.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Theme selection */}
      <div className='mt-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6'>
        <h3 className='text-sm font-semibold text-gray-900 dark:text-white mb-4'>Theme</h3>
        <div className='grid grid-cols-3 gap-3'>
          {[{ label: 'Light', icon: Sun }, { label: 'Dark', icon: Moon }, { label: 'System', icon: Monitor }].map(({ label, icon: Icon }) => (
            <button
              key={label}
              className='flex flex-col items-center gap-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-4 text-sm text-gray-600 dark:text-gray-400 hover:border-primary-500 transition-colors'
            >
              <Icon className='h-5 w-5' />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
