'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import EmployeeProfile from '@/components/employees/EmployeeProfile'
import EmployeeSkeleton from '@/components/employees/EmployeeSkeleton'
import EmployeeEmptyState from '@/components/employees/EmployeeEmptyState'
import { getCurrentUser, getUsers } from '@/services/api'
import { UserSession } from '@/types/auth'
import { mapUsersToEmployees } from '@/components/employees/employee-data'

export default function EmployeeProfilePage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [user, setUser] = useState<UserSession | null>(null)
  const [employees, setEmployees] = useState<ReturnType<typeof mapUsersToEmployees>>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return (
      <AppLayout user={user} breadcrumbs={[{ label: 'NexoRH' }, { label: 'Empleados' }, { label: 'Perfil' }]}>
        <EmployeeSkeleton />
      </AppLayout>
    )
  }

  if (!user) return null

  return (
    <AppLayout
      user={user}
      breadcrumbs={[{ label: 'NexoRH', href: '/dashboard' }, { label: 'Empleados', href: '/employees' }, { label: employee?.fullName ?? 'Perfil' }]}
    >
      {!employee ? (
        <EmployeeEmptyState
          title="Empleado no encontrado"
          description="No existe un perfil con este identificador o no tienes acceso a el."
        />
      ) : (
        <EmployeeProfile employee={employee} onEdit={() => router.push(`/employees/${employee.id}/edit`)} />
      )}
    </AppLayout>
  )
}
