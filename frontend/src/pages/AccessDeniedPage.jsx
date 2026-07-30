import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldAlert, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function AccessDeniedPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in">
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mb-4 shadow-sm">
        <ShieldAlert className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">403 Access Denied</h1>
      <p className="text-xs text-slate-500 max-w-sm mt-2 leading-relaxed">
        You do not have permission to access this page. Please contact your clinic administrator if you believe this is an error.
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

export default AccessDeniedPage
