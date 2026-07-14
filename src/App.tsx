import { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '@/utils/constants'

function Loader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <div className="flex h-screen items-center justify-center">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-primary-600">Research Assistant</h1>
                <p className="mt-2 text-gray-500">Foundation ready — features coming soon</p>
              </div>
            </div>
          }
        />
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
