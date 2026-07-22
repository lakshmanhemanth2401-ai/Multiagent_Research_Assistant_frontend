export const APP_NAME = import.meta.env.VITE_APP_NAME
export const APP_VERSION = import.meta.env.VITE_APP_VERSION
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
export const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL

export const ROUTES = {
  HOME:             '/',
  LOGIN:            '/login',
  REGISTER:         '/register',
  FORGOT_PASSWORD:  '/forgot-password',
  RESET_PASSWORD:   '/reset-password',
  VERIFY_EMAIL:     '/verify-email',
  SESSION_EXPIRED:  '/session-expired',
  DASHBOARD:        '/dashboard',
  CHAT:             '/chat',
  RESEARCH:           '/research',
  RESEARCH_NEW:       '/research/new',
  RESEARCH_WORKSPACE: '/research/:sessionId',
  REPORTS:            '/reports',
  FILES:            '/files',
  SETTINGS:         '/settings',
} as const

export const QUERY_KEYS = {
  USER:                ['user'],
  CONVERSATIONS:       ['conversations'],
  RESEARCH_SESSIONS:   ['research-sessions'],
  REPORTS:             ['reports'],
  FILES:               ['files'],
  DASHBOARD_STATS:     ['dashboard', 'stats'],
  DASHBOARD_SESSIONS:  ['dashboard', 'sessions'],
  DASHBOARD_REPORTS:   ['dashboard', 'reports'],
  DASHBOARD_ACTIVITY:  ['dashboard', 'activity'],
  DASHBOARD_PROGRESS:  ['dashboard', 'progress'],
  DASHBOARD_NOTIFS:    ['dashboard', 'notifications'],
} as const

export const STORAGE_KEYS = {
  ACCESS_TOKEN:  'access_token',
  REFRESH_TOKEN: 'refresh_token',
  THEME:         'theme',
  SETTINGS:      'settings',
} as const

export const MAX_FILE_SIZE_MB = 50
export const SUPPORTED_FILE_TYPES = ['pdf', 'docx', 'txt', 'md', 'csv'] as const
