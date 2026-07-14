mport type { RouteObject } from 'react-router-dom'
import { lazy } from 'react'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import { ROUTES } from '@/utils/constants'

const LoginPage    = lazy(() => import('@/features/auth/pages/LoginPage'))
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'))
const ChatPage     = lazy(() => import('@/features/chat/pages/ChatPage'))
const ResearchPage = lazy(() => import('@/features/research/pages/ResearchPage'))
const ReportsPage  = lazy(() => import('@/features/reports/pages/ReportsPage'))
const FilesPage    = lazy(() => import('@/features/files/pages/FilesPage'))
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'))

export const routes: RouteObject[] = [
  {
    path: ROUTES.LOGIN,
    element: <PublicRoute><LoginPage /></PublicRoute>,
  },
  {
    path: ROUTES.DASHBOARD,
    element: <ProtectedRoute><DashboardPage /></ProtectedRoute>,
  },
  {
    path: ROUTES.CHAT,
    element: <ProtectedRoute><ChatPage /></ProtectedRoute>,
  },
  {
    path: ROUTES.RESEARCH,
    element: <ProtectedRoute><ResearchPage /></ProtectedRoute>,
  },
  {
    path: ROUTES.REPORTS,
    element: <ProtectedRoute><ReportsPage /></ProtectedRoute>,
  },
  {
    path: ROUTES.FILES,
    element: <ProtectedRoute><FilesPage /></ProtectedRoute>,
  },
  {
    path: ROUTES.SETTINGS,
    element: <ProtectedRoute><SettingsPage /></ProtectedRoute>,
  },
]
