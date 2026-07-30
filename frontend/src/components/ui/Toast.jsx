import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

/**
 * Clinic Care System — Toast Notification System
 * Includes ToastContext, ToastProvider, useToast hook, and ToastContainer
 */

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback(({ title, message, type = 'info', duration = 4000 }) => {
    const id = Date.now() + Math.random()
    const newToast = { id, title, message, type, duration }

    setToasts((prev) => [...prev, newToast])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }, [removeToast])

  const toast = useCallback(
    {
      success: (title, message, duration) => addToast({ title, message, type: 'success', duration }),
      error: (title, message, duration) => addToast({ title, message, type: 'error', duration }),
      warning: (title, message, duration) => addToast({ title, message, type: 'warning', duration }),
      info: (title, message, duration) => addToast({ title, message, type: 'info', duration }),
      dismiss: removeToast,
    },
    [addToast, removeToast]
  )

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastContainer = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => onClose(toast.id)} />
      ))}
    </div>
  )
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    iconColor: 'text-emerald-400',
    bgColor: 'bg-slate-900/95',
    borderColor: 'border-emerald-500/40',
    shadowGlow: 'shadow-emerald-500/10',
  },
  error: {
    icon: AlertCircle,
    iconColor: 'text-rose-400',
    bgColor: 'bg-slate-900/95',
    borderColor: 'border-rose-500/40',
    shadowGlow: 'shadow-rose-500/10',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-amber-400',
    bgColor: 'bg-slate-900/95',
    borderColor: 'border-amber-500/40',
    shadowGlow: 'shadow-amber-500/10',
  },
  info: {
    icon: Info,
    iconColor: 'text-sky-400',
    bgColor: 'bg-slate-900/95',
    borderColor: 'border-sky-500/40',
    shadowGlow: 'shadow-sky-500/10',
  },
}

export const ToastItem = ({ toast, onClose }) => {
  const config = toastConfig[toast.type] || toastConfig.info
  const Icon = config.icon

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${config.bgColor} ${config.borderColor} shadow-xl ${config.shadowGlow} backdrop-blur-md animate-slide-up transition-all duration-200`}
      role="alert"
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="flex-1 min-w-0">
        {toast.title && <h5 className="text-sm font-semibold text-white tracking-tight">{toast.title}</h5>}
        {toast.message && <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>}
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default ToastProvider
