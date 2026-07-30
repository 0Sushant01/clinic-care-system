import React from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 mb-4 shadow-sm">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">404 — Page Not Found</h1>
      <p className="text-xs text-slate-500 max-w-sm mt-2 leading-relaxed">
        The application module or record page you requested does not exist or has been moved.
      </p>

      <div className="mt-6">
        <Link to="/dashboard">
          <Button variant="primary" size="md" icon={ArrowLeft}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
