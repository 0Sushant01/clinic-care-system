/**
 * Centralized Role-Based Access Control (RBAC) Permissions Utility.
 * Single source of truth for all frontend authorization logic.
 */

export const ROLES = {
  ADMIN: 'admin',
  RECEPTIONIST: 'receptionist',
  THERAPIST: 'therapist',
}

/** Check if user is Administrator */
export const isAdmin = (user) => user?.role === ROLES.ADMIN

/** Check if user is Receptionist */
export const isReceptionist = (user) => user?.role === ROLES.RECEPTIONIST

/** Check if user is Therapist */
export const isTherapist = (user) => user?.role === ROLES.THERAPIST

/** Check if user can manage staff accounts (Admin Only) */
export const canManageStaff = (user) => isAdmin(user)

/** Check if user can create or edit patient demographics (Admin, Receptionist, Therapist) */
export const canCreatePatients = (user) => !!user

/** Check if user can access clinical performance reports (Admin & Therapist) */
export const canViewReports = (user) => isAdmin(user) || isTherapist(user)

/** Check if user can access a specific sidebar route */
export const canAccessModule = (user, path) => {
  if (!user) return false

  switch (path) {
    case '/staff':
    case '/therapists':
    case '/settings':
      return isAdmin(user)
    case '/reports':
      return canViewReports(user)
    case '/dashboard':
    case '/patients':
    case '/appointments':
    case '/profile':
      return true
    default:
      return true
  }
}
