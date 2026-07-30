import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ title, message, variant = 'info', duration = 4000 }) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, title, message, variant }])

    setTimeout(() => {
      removeToast(id)
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const success = (title, message) => addToast({ title, message, variant: 'success' })
  const error = (title, message) => addToast({ title, message, variant: 'error' })
  const warning = (title, message) => addToast({ title, message, variant: 'warning' })
  const info = (title, message) => addToast({ title, message, variant: 'info' })

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

const ToastItem = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
  }

  const borders = {
    success: 'border-emerald-200 bg-white',
    error: 'border-red-200 bg-white',
    warning: 'border-amber-200 bg-white',
    info: 'border-blue-200 bg-white',
  }

  return (
    <div
      className={`pointer-events-auto p-4 rounded-xl border shadow-lg flex items-start gap-3 transition-all animate-scale-in ${
        borders[toast.variant]
      }`}
    >
      {icons[toast.variant]}
      <div className="flex-1 min-w-0">
        {toast.title && <h4 className="text-xs font-bold text-slate-900 leading-tight">{toast.title}</h4>}
        {toast.message && <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{toast.message}</p>}
      </div>
      <button
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export default ToastProvider
