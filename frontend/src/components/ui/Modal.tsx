'use client'

import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import Button from './Button'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: ModalProps) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <button
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        onClick={onClose}
        aria-label="Cerrar modal"
      />

      <div className="relative w-full max-w-xl rounded-modal bg-card border border-slate-200 shadow-modal">
        <div className="px-lg pt-lg pb-md border-b border-slate-100 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {description ? <p className="text-sm text-muted mt-1">{description}</p> : null}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Cerrar">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-lg">{children}</div>

        {footer ? <div className="px-lg pb-lg pt-md border-t border-slate-100">{footer}</div> : null}
      </div>
    </div>
  )
}
