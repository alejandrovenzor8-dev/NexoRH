'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'
import EmployeeForm, { EmployeeFormValues } from '@/components/employees/EmployeeForm'
import EmployeeSkeleton from '@/components/employees/EmployeeSkeleton'
import { getCurrentUser } from '@/services/api'
import { UserSession } from '@/types/auth'
import { useEmployees } from '@/hooks/useEmployees'

export default function NewEmployeePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { createEmployee } = useEmployees()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
      return
    }

    getCurrentUser(token)
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.replace('/login')
      })
      .finally(() => setLoading(false))
  }, [router])

  const handleSubmit = async (values: EmployeeFormValues) => {
    try {
      setSaving(true)
      setError(null)
      
      await createEmployee({
        fullName: values.fullName,
        email: values.email,
        role: values.role,
        status: values.status,
        department: values.department,
        phone: values.phone,
      })
      
      setSaved(true)
      window.setTimeout(() => {
        router.push('/employees?created=1')
      }, 700)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create employee'
      setError(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AppLayout user={user} breadcrumbs={[{ label: 'NexoRH' }, { label: 'Empleados' }, { label: 'Nuevo' }]}>
        <EmployeeSkeleton />
      </AppLayout>
    )
  }

  if (!user) return null

  return (
    <AppLayout
      user={user}
      breadcrumbs={[{ label: 'NexoRH', href: '/dashboard' }, { label: 'Empleados', href: '/employees' }, { label: 'Nuevo' }]}
    >
      <section className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md">
        <SectionHeader
          title="Nuevo empleado"
          description="Crea un nuevo perfil para tu equipo"
          action={<Button variant="ghost" onClick={() => router.push('/employees')}>Volver</Button>}
        />

        <EmployeeForm
          submitLabel={saving ? 'Guardando...' : saved ? 'Guardado' : 'Guardar empleado'}
          onCancel={() => router.push('/employees')}
          onSubmit={handleSubmit}
          disabled={saving}
        />

        {saved && (
          <p className="mt-3 text-sm text-emerald-600">Empleado creado correctamente. Redirigiendo...</p>
        )}
        
        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}
      </section>
    </AppLayout>
  )
}
