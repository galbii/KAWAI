'use client'

import { useEffect, useState } from 'react'

// Explicit color constants to avoid Payload theme conflicts
const toastColors = {
  white: '#ffffff',
  emerald500: '#10b981',
  red500: '#ef4444',
  blue500: '#3b82f6',
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

interface ToastProps {
  toast: ToastMessage
  onDismiss: (id: string) => void
}

function ToastItem({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id)
    }, 3000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  }

  const colorMap = {
    success: toastColors.emerald500,
    error: toastColors.red500,
    info: toastColors.blue500,
  }

  const bgMap = {
    success: 'rgba(46,196,160,0.12)',
    error: 'rgba(241,108,108,0.12)',
    info: 'rgba(99,102,241,0.12)',
  }
  const borderMap = {
    success: 'rgba(46,196,160,0.3)',
    error: 'rgba(241,108,108,0.3)',
    info: 'rgba(99,102,241,0.3)',
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '8px 12px 8px 10px',
        borderRadius: 8,
        background: bgMap[toast.type],
        border: `1px solid ${borderMap[toast.type]}`,
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(8px)',
        color: colorMap[toast.type],
        minWidth: 220,
        maxWidth: 340,
      }}
    >
      {icons[toast.type]}
      <span style={{ fontSize: 12.5, fontWeight: 500, flex: 1, color: '#ECECF2' }}>{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 18, height: 18, borderRadius: 4,
          background: 'transparent', border: 'none',
          color: '#4C4C68', cursor: 'pointer', outline: 'none', padding: 0,
          flexShrink: 0,
        }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-16 right-5 z-[10001] flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (type: ToastMessage['type'], message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    setToasts((prev) => [...prev, { id, type, message }])
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return {
    toasts,
    addToast,
    dismissToast,
    success: (message: string) => addToast('success', message),
    error: (message: string) => addToast('error', message),
    info: (message: string) => addToast('info', message),
  }
}
