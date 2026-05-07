'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'
import EmployeeForm, { EmployeeFormValues } from '@/components/employees/EmployeeForm'
import EmployeeSkeleton from '@/components/employees/EmployeeSkeleton'
import { getCurrentUser, User } from '@/services/api'

export default function NewEmployeePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

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

  const handleSubmit = async (_values: EmployeeFormValues) => {
    setSaved(true)
    window.setTimeout(() => {
      router.push('/employees?created=1')
    }, 700)
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

        <EmployeeForm submitLabel={saved ? 'Guardado' : 'Guardar empleado'} onSubmit={handleSubmit} />

        {saved && (
          <p className="mt-3 text-sm text-emerald-600">Empleado creado correctamente. Redirigiendo...</p>
        )}
      </section>
    </AppLayout>
  )
}
