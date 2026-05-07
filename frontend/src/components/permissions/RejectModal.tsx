'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface RejectModalProps {
  open: boolean
  onClose: () => void
  onReject: (reason: string) => Promise<void> | void
  requestLabel?: string
}

type ToastState = {
  tone: 'success' | 'error'
  message: string
}

const MIN_REASON_LENGTH = 10

export default function RejectModal({
  open,
  onClose,
  onReject,
  requestLabel,
}: RejectModalProps) {
  const [reason, setReason] = useState('')
  const [touched, setTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const reasonRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => {
      reasonRef.current?.focus()
    }, 30)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!open) {
      setReason('')
      setTouched(false)
      setSubmitting(false)
      setToast(null)
      setConfirmed(false)
    }
  }, [open])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2400)
    return () => window.clearTimeout(timer)
  }, [toast])

  const error = useMemo(() => {
    const clean = reason.trim()
    if (!touched && clean.length === 0) return ''
    if (clean.length < MIN_REASON_LENGTH) {
      return `Ingresa al menos ${MIN_REASON_LENGTH} caracteres para justificar el rechazo.`
    }
    return ''
  }, [reason, touched])

  const canSubmit = reason.trim().length >= MIN_REASON_LENGTH && confirmed && !submitting

  const handleReject = async () => {
    setTouched(true)
    if (!canSubmit) {
      setToast({ tone: 'error', message: 'Completa los campos requeridos antes de continuar.' })
      return
    }

    try {
      setSubmitting(true)
      await onReject(reason.trim())
      setToast({ tone: 'success', message: 'Solicitud rechazada correctamente.' })
      window.setTimeout(() => onClose(), 500)
    } catch (err) {
      setToast({
        tone: 'error',
        message: err instanceof Error ? err.message : 'No se pudo rechazar la solicitud.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Rechazar solicitud"
      description={requestLabel ? `Solicitud: ${requestLabel}` : 'Esta accion requiere un motivo obligatorio.'}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleReject} disabled={!canSubmit}>
            {submitting ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Rechazando...
              </span>
            ) : (
              'Rechazar solicitud'
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-800 inline-flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>Esta accion notificara al colaborador y quedara registrada en el historial.</p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="reject-reason" className="text-sm font-medium text-slate-700">
            Motivo del rechazo
          </label>
          <textarea
            ref={reasonRef}
            id="reject-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onBlur={() => setTouched(true)}
            rows={4}
            className={[
              'w-full rounded-button border bg-card px-3 py-2 text-sm text-slate-900 shadow-card transition-all resize-y min-h-[110px]',
              'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              error ? 'border-danger-500' : 'border-slate-200',
            ].join(' ')}
            placeholder="Explica claramente por que la solicitud no puede ser aprobada..."
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'reject-reason-error' : undefined}
          />
          {error ? (
            <p id="reject-reason-error" className="text-xs text-danger-600">
              {error}
            </p>
          ) : (
            <p className="text-xs text-slate-400">Minimo {MIN_REASON_LENGTH} caracteres.</p>
          )}
        </div>

        <label className="flex items-start gap-2 text-sm text-slate-600 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
          />
          Confirmo que revise la solicitud y deseo rechazarla.
        </label>

        {toast ? (
          <div
            className={[
              'rounded-xl border px-3 py-2 text-sm font-medium inline-flex items-center gap-2',
              toast.tone === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-rose-200 bg-rose-50 text-rose-700',
            ].join(' ')}
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 className="w-4 h-4" />
            {toast.message}
          </div>
        ) : null}
      </div>
    </Modal>
  )
}
