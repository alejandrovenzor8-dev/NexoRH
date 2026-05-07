'use client'

import { useMemo, useState } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { EmployeeRecord, EmployeeRole, EmployeeStatus } from './types'

export interface EmployeeFormValues {
  fullName: string
  email: string
  role: EmployeeRole
  status: EmployeeStatus
  department: string
  phone: string
}

interface EmployeeFormProps {
  initialValues?: Partial<EmployeeFormValues>
  submitLabel?: string
  onSubmit: (values: EmployeeFormValues) => Promise<void> | void
}

export default function EmployeeForm({ initialValues, submitLabel = 'Guardar', onSubmit }: EmployeeFormProps) {
  const [form, setForm] = useState<EmployeeFormValues>({
    fullName: initialValues?.fullName ?? '',
    email: initialValues?.email ?? '',
    role: initialValues?.role ?? 'USER',
    status: initialValues?.status ?? 'active',
    department: initialValues?.department ?? 'Operaciones',
    phone: initialValues?.phone ?? '',
  })
  const [saving, setSaving] = useState(false)

  const isValid = useMemo(() => form.fullName.trim().length > 2 && form.email.includes('@'), [form])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid || saving) return

    setSaving(true)
    try {
      await onSubmit(form)
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
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          placeholder="Ana Garcia"
          required
        />
        <Input
          type="email"
          label="Correo"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="ana@empresa.com"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Rol"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value as EmployeeRole })}
          options={[
            { label: 'Admin', value: 'ADMIN' },
            { label: 'Manager', value: 'MANAGER' },
            { label: 'Usuario', value: 'USER' },
          ]}
        />
        <Select
          label="Estado"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as EmployeeStatus })}
          options={[
            { label: 'Activo', value: 'active' },
            { label: 'Inactivo', value: 'inactive' },
            { label: 'Baja', value: 'baja' },
          ]}
        />
        <Input
          label="Departamento"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          placeholder="Operaciones"
          required
        />
      </div>

      <Input
        label="Telefono"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="+52 55 0000 0000"
      />

      <div className="pt-2 flex items-center justify-end gap-2">
        <Button type="submit" disabled={!isValid || saving}>
          {saving ? 'Guardando...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
