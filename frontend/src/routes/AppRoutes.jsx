import { Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'

/**
 * Centralized route configuration.
 * All application routes are defined here for easy management.
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  )
}

export default AppRoutes
