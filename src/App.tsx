import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import ProtectedRoute from '@/routes/ProtectedRoute'
import PublicRoute from '@/routes/PublicRoute'
import { ROUTES } from '@/utils/constants'

const LoginPage    = lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'))
const ChatPage      = lazy(() => import('@/features/chat/pages/ChatPage'))
const ResearchPage  = lazy(() => import('@/features/research/pages/ResearchPage'))
const ReportsPage   = lazy(() => import('@/features/reports/pages/ReportsPage'))
const FilesPage     = lazy(() => import('@/features/files/pages/FilesPage'))
const SettingsPage  = lazy(() => import('@/features/settings/pages/SettingsPage'))
const NotFoundPage     = lazy(() => import('@/pages/NotFoundPage'))
const ComponentsPage   = lazy(() => import('@/pages/ComponentsPage'))

function PageLoader() {
  return (
    <div className='flex h-full min-h-[200px] items-center justify-center'>
      <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent' />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />

        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN}    element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          </Route>
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.CHAT}      element={<ChatPage />} />
            <Route path={ROUTES.RESEARCH}  element={<ResearchPage />} />
            <Route path={ROUTES.REPORTS}   element={<ReportsPage />} />
            <Route path={ROUTES.FILES}     element={<FilesPage />} />
            <Route path={ROUTES.SETTINGS}  element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
        <Route path="/components" element={<ComponentsPage />} />
      </Routes>
    </Suspense>
  )
}
