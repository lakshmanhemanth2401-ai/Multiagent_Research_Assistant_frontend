import { forwardRef, useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { cn } from '@/utils/helpers'

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  hint?: string
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const [visible, setVisible] = useState(false)
    const inputId = id ?? 'password-input'

    return (
      <div className='flex flex-col gap-1'>
        {label && (
          <label
            htmlFor={inputId}
            className='block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            {label}
            {props.required && (
              <span className='ml-0.5 text-red-500' aria-hidden='true'>
                *
              </span>
            )}
          </label>
        )}

        <div className='relative flex items-center'>
          <span
            className='pointer-events-none absolute left-3 text-gray-400'
            aria-hidden='true'
          >
            <Lock className='h-4 w-4' />
          </span>

          <input
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            className={cn(
              'w-full rounded-lg border bg-white text-sm text-gray-900 transition-shadow',
              'placeholder:text-gray-400 dark:bg-gray-900 dark:text-white',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'pl-9 pr-10 py-2',
              error
                ? 'border-red-400 focus:ring-red-400 focus:border-red-400 dark:border-red-500'
                : 'border-gray-300 dark:border-gray-600',
              className,
            )}
            {...props}
          />

          <button
            type='button'
            tabIndex={-1}
            aria-label={visible ? 'Hide password' : 'Show password'}
            onClick={() => setVisible((v) => !v)}
            className='absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none'
          >
            {visible ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
          </button>
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            role='alert'
            className='text-xs text-red-600 dark:text-red-400'
          >
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className='text-xs text-gray-500 dark:text-gray-400'>
            {hint}
          </p>
        )}
      </div>
    )
  },
)

PasswordInput.displayName = 'PasswordInput'
export default PasswordInput
