# Frontend Architecture & Guidelines

## Overview

The frontend is a single-page React application built with Vite, Tailwind CSS, TanStack React Query, and Lucide icons.

## Architecture & Layout

1. **State & Auth Management**:
   - `AuthContext`: Manages logged-in user state using cookie-based authentication via `api.get('/auth/me/')`.
   - `ToastContext`: Enterprise toast alert notifications.
2. **Routing & Role Guards**:
   - `AppRoutes`: Wraps routes in `ProtectedRoute` and role-based guards (`AdminRoute`, `TherapistRoute`).
3. **UI Components & Modals**:
   - Enterprise modals (`Modal.jsx`, `AppointmentModalForm.jsx`, `CompleteAppointmentModal.jsx`, `CancelAppointmentModal.jsx`, `AppointmentDetailsModal.jsx`).
   - Slot availability banner displays occupied time slots during appointment booking.
