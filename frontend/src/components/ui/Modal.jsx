import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle } from 'lucide-react'
import { Button } from './Button'

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'max-w-4xl',
  icon: Icon,
  className = '',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const modalMarkup = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-6 overflow-hidden select-none">
        {/* Semi-transparent dark overlay covering entire viewport */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/45 backdrop-blur-md z-40"
        />

        {/* Centered Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className={`relative z-50 w-full sm:w-[92vw] lg:w-[960px] ${maxWidth} bg-white border border-slate-200 rounded-none sm:rounded-[18px] shadow-[0_30px_80px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden my-auto max-h-full sm:max-h-[90vh] ${className}`}
        >
          {/* Sticky Header */}
          {(title || subtitle) && (
            <div className="p-5 sm:px-8 sm:py-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/90 shrink-0">
              <div className="flex items-center gap-3">
                {Icon && (
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                )}
                <div>
                  {title && (
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
                      {title}
                    </h3>
                  )}
                  {subtitle && <p className="text-xs text-slate-500 mt-0.5 font-medium">{subtitle}</p>}
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors shrink-0"
                title="Close Modal (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Independent Scrollable Body */}
          <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8 select-text">
            {children}
          </div>

          {/* Sticky Footer */}
          {footer && (
            <div className="p-4 sm:px-8 sm:py-5 border-t border-slate-100 bg-slate-50/90 flex items-center justify-end gap-3 shrink-0">
              {footer}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )

  // Use React.createPortal directly at body root level
  return ReactDOM.createPortal(modalMarkup, document.body)
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      title={
        <span className="flex items-center gap-2 text-slate-900 font-bold">
          <AlertTriangle className={`w-5 h-5 ${variant === 'danger' ? 'text-red-600' : 'text-amber-600'}`} />
          {title}
        </span>
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose} isDisabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} isLoading={isLoading}>
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="text-xs text-slate-600 leading-relaxed">{message}</p>
    </Modal>
  )
}

export default Modal
