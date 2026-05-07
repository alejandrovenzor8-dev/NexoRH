'use client'

import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { EmployeeRole, EmployeeStatus } from './types'

export interface EmployeeFormValues {
  fullName: string
  email: string
  role: EmployeeRole
  status: EmployeeStatus
  department: string
  phone: string
  hiredAt: string
}

interface EmployeeFormProps {
  initialValues?: Partial<EmployeeFormValues>
  submitLabel?: string
  onCancel?: () => void
  onSubmit: (values: EmployeeFormValues) => Promise<void> | void
}

type FormErrors = Partial<Record<keyof EmployeeFormValues, string>>

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateField(name: keyof EmployeeFormValues, value: string): string {
  if (!value.trim()) {
    if (name === 'hiredAt') return 'Selecciona la fecha de contratacion'
    return 'Este campo es obligatorio'
  }

  if (name === 'fullName' && value.trim().length < 3) {
    return 'Ingresa al menos 3 caracteres'
  }

  if (name === 'email' && !isValidEmail(value)) {
    return 'Ingresa un correo valido'
  }

  if (name === 'phone' && value.replace(/\D/g, '').length < 10) {
    return 'Ingresa al menos 10 digitos'
  }

  return ''
}

export default function EmployeeForm({
  initialValues,
  submitLabel = 'Guardar cambios',
  onCancel,
  onSubmit,
}: EmployeeFormProps) {
  const [form, setForm] = useState<EmployeeFormValues>({
    fullName: initialValues?.fullName ?? '',
    email: initialValues?.email ?? '',
    role: initialValues?.role ?? 'USER',
    status: initialValues?.status ?? 'active',
    department: initialValues?.department ?? 'Operaciones',
    phone: initialValues?.phone ?? '',
    hiredAt: initialValues?.hiredAt ?? new Date().toISOString().slice(0, 10),
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof EmployeeFormValues, boolean>>>({})
  const [toast, setToast] = useState<{ tone: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 2500)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const setFieldValue = (name: keyof EmployeeFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }))

    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error || undefined }))
    }
  }

  const touchField = (name: keyof EmployeeFormValues) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name, form[name])
    setErrors((prev) => ({ ...prev, [name]: error || undefined }))
  }

  const isValid = useMemo(() => {
    const requiredFields: Array<keyof EmployeeFormValues> = [
      'fullName',
      'email',
      'phone',
      'department',
      'role',
      'status',
      'hiredAt',
    ]

    return requiredFields.every((field) => !validateField(field, form[field]))
  }, [form])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (saving) return

    const requiredFields: Array<keyof EmployeeFormValues> = [
      'fullName',
      'email',
      'phone',
      'department',
      'role',
      'status',
      'hiredAt',
    ]

    const nextErrors: FormErrors = {}
    for (const field of requiredFields) {
      const error = validateField(field, form[field])
      if (error) nextErrors[field] = error
    }

    setTouched({
      fullName: true,
      email: true,
      phone: true,
      department: true,
      role: true,
      status: true,
      hiredAt: true,
    })
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setToast({ tone: 'error', message: 'Revisa los campos marcados en el formulario.' })
      return
    }

    setSaving(true)
    try {
      await onSubmit(form)
      setToast({ tone: 'success', message: 'Cambios guardados correctamente.' })
    } catch (error) {
      setToast({
        tone: 'error',
        message: error instanceof Error ? error.message : 'No se pudo guardar el empleado.',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre completo"
          value={form.fullName}
          onChange={(e) => setFieldValue('fullName', e.target.value)}
          onBlur={() => touchField('fullName')}
          error={errors.fullName}
          placeholder="Ana Garcia"
          required
        />
        <Input
          type="email"
          label="Correo"
          value={form.email}
          onChange={(e) => setFieldValue('email', e.target.value)}
          onBlur={() => touchField('email')}
          error={errors.email}
          placeholder="ana@empresa.com"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Rol"
          value={form.role}
          onChange={(e) => setFieldValue('role', e.target.value)}
          onBlur={() => touchField('role')}
          error={errors.role}
          options={[
            { label: 'Admin', value: 'ADMIN' },
            { label: 'Manager', value: 'MANAGER' },
            { label: 'Usuario', value: 'USER' },
          ]}
        />
        <Select
          label="Estado"
          value={form.status}
          onChange={(e) => setFieldValue('status', e.target.value)}
          onBlur={() => touchField('status')}
          error={errors.status}
          options={[
            { label: 'Activo', value: 'active' },
            { label: 'Inactivo', value: 'inactive' },
            { label: 'Baja', value: 'baja' },
          ]}
        />
        <Input
          label="Departamento"
          value={form.department}
          onChange={(e) => setFieldValue('department', e.target.value)}
          onBlur={() => touchField('department')}
          error={errors.department}
          placeholder="Operaciones"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Telefono"
          value={form.phone}
          onChange={(e) => setFieldValue('phone', e.target.value)}
          onBlur={() => touchField('phone')}
          error={errors.phone}
          placeholder="+52 55 0000 0000"
          required
        />
        <Input
          type="date"
          label="Fecha contratacion"
          value={form.hiredAt}
          onChange={(e) => setFieldValue('hiredAt', e.target.value)}
          onBlur={() => touchField('hiredAt')}
          error={errors.hiredAt}
          required
        />
      </div>

      <div className="pt-2 flex items-center justify-end gap-2">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" disabled={!isValid || saving}>
          {saving ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Guardando...
            </span>
          ) : (
            submitLabel
          )}
        </Button>
      </div>

      {toast ? (
        <div className="fixed bottom-5 right-5 z-50">
          <div
            className={[
              'px-4 py-3 rounded-xl border text-sm font-medium shadow-lg flex items-center gap-2',
              toast.tone === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-rose-50 border-rose-200 text-rose-700',
            ].join(' ')}
          >
            {toast.tone === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {toast.message}
          </div>
        </div>
      ) : null}
    </form>
  )
}
