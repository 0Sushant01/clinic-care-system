import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FullPageLoader } from '../components/ui/Loading'
import { canManageStaff } from '../utils/permissions'
import AppLayout from '../layouts/AppLayout'

// Lazy-loaded page components for route code-splitting
const LoginPage = lazy(() => import('../pages/LoginPage'))
const DashboardPage = lazy(() => import('../pages/DashboardPage'))
const PatientsPage = lazy(() => import('../pages/PatientsPage'))
const PatientDetailPage = lazy(() => import('../pages/PatientDetailPage'))
const AppointmentsPage = lazy(() => import('../pages/AppointmentsPage'))
const StaffManagementPage = lazy(() => import('../pages/StaffManagementPage'))
const ReportsPage = lazy(() => import('../pages/ReportsPage'))
const ProfilePage = lazy(() => import('../pages/ProfilePage'))
const SettingsPage = lazy(() => import('../pages/SettingsPage'))
const AccessDeniedPage = lazy(() => import('../pages/AccessDeniedPage'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'))

/** Guard for protected routes requiring authentication */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <FullPageLoader label="Checking session authentication..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children || <AppLayout />
}

/** Guard for public auth routes */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <FullPageLoader label="Connecting to Clinic Care..." />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

/** Guard for Admin-only routes (/staff, /settings) */
const AdminRoute = ({ children }) => {
  const { user } = useAuth()

  if (!canManageStaff(user)) {
    return <AccessDeniedPage />
  }

  return children
}

export function AppRoutes() {
  return (
    <Suspense fallback={<FullPageLoader label="Loading module view..." />}>
      <Routes>
        {/* Public Auth Route */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected AppLayout Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/patients/:id" element={<PatientDetailPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />

          {/* Admin Only Staff Management */}
          <Route
            path="/staff"
            element={
              <AdminRoute>
                <StaffManagementPage />
              </AdminRoute>
            }
          />
          <Route path="/therapists" element={<Navigate to="/staff" replace />} />
          <Route path="/session-notes" element={<Navigate to="/appointments" replace />} />

          <Route path="/reports" element={<ReportsPage />} />

          {/* Personal Profile for all authenticated staff */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Admin-Only System Settings */}
          <Route
            path="/settings"
            element={
              <AdminRoute>
                <SettingsPage />
              </AdminRoute>
            }
          />

          <Route path="/access-denied" element={<AccessDeniedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
