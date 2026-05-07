'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'
import EmployeeForm, { EmployeeFormValues } from '@/components/employees/EmployeeForm'
import EmployeeSkeleton from '@/components/employees/EmployeeSkeleton'
import EmployeeEmptyState from '@/components/employees/EmployeeEmptyState'
import { getCurrentUser, getUsers, User } from '@/services/api'
import { mapUsersToEmployees } from '@/components/employees/employee-data'

export default function EmployeeEditPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [employees, setEmployees] = useState<ReturnType<typeof mapUsersToEmployees>>([])
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
      return
    }

    Promise.all([getCurrentUser(token), getUsers(token)])
      .then(([currentUser, allUsers]) => {
        setUser(currentUser)
        setEmployees(mapUsersToEmployees(allUsers))
      })
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.replace('/login')
      })
      .finally(() => setLoading(false))
  }, [router])

  const employee = useMemo(
    () => employees.find((e) => e.id === params.id),
    [employees, params.id],
  )

  const handleSubmit = async (_values: EmployeeFormValues) => {
    setSaved(true)
    window.setTimeout(() => {
      router.push(`/employees/${params.id}`)
    }, 700)
  }

  if (loading) {
    return (
      <AppLayout user={user} breadcrumbs={[{ label: 'NexoRH' }, { label: 'Empleados' }, { label: 'Editar' }]}>
        <EmployeeSkeleton />
      </AppLayout>
    )
  }

  if (!user) return null

  return (
    <AppLayout
      user={user}
      breadcrumbs={[{ label: 'NexoRH', href: '/dashboard' }, { label: 'Empleados', href: '/employees' }, { label: employee?.fullName ?? 'Editar' }]}
    >
      {!employee ? (
        <EmployeeEmptyState />
      ) : (
        <section className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md">
          <SectionHeader
            title="Editar empleado"
            description="Actualiza la informacion principal del colaborador"
            action={<Button variant="ghost" onClick={() => router.push(`/employees/${employee.id}`)}>Cancelar</Button>}
          />

          <EmployeeForm
            initialValues={{
              fullName: employee.fullName,
              email: employee.email,
              role: employee.role,
              status: employee.status,
              department: employee.department,
              phone: employee.phone || '',
            }}
            submitLabel={saved ? 'Actualizado' : 'Guardar cambios'}
            onSubmit={handleSubmit}
          />

          {saved && (
            <p className="mt-3 text-sm text-emerald-600">Cambios guardados. Redirigiendo al perfil...</p>
          )}
        </section>
      )}
    </AppLayout>
  )
}
