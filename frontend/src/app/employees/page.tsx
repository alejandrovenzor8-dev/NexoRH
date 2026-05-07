'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import { getCurrentUser, getUsers, User } from '@/services/api'
import EmployeeStats from '@/components/employees/EmployeeStats'
import EmployeeFilters from '@/components/employees/EmployeeFilters'
import EmployeesTable from '@/components/employees/EmployeesTable'
import EmployeeSkeleton from '@/components/employees/EmployeeSkeleton'
import EmployeeEmptyState from '@/components/employees/EmployeeEmptyState'
import { EmployeeRecord, EmployeesFiltersValue, EmployeeStatus } from '@/components/employees/types'
import { getDepartmentOptions, mapUsersToEmployees } from '@/components/employees/employee-data'

interface ToastState {
  tone: 'success' | 'info'
  message: string
}

export default function EmployeesPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [employees, setEmployees] = useState<EmployeeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<EmployeesFiltersValue>({
    query: '',
    role: 'all',
    status: 'all',
    department: 'all',
    sort: 'name-asc',
  })
  const [toast, setToast] = useState<ToastState | null>(null)
  const [pendingStatusChange, setPendingStatusChange] = useState<{ id: string; nextStatus: EmployeeStatus } | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
      return
    }

    const fetchData = async () => {
      try {
        const [currentUser, allUsers] = await Promise.all([
          getCurrentUser(token),
          getUsers(token),
        ])
        setUser(currentUser)
        setEmployees(mapUsersToEmployees(allUsers))
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.replace('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2400)
    return () => window.clearTimeout(timer)
  }, [toast])

  const filteredEmployees = useMemo(() => {
    const search = filters.query.trim().toLowerCase()

    const filtered = employees.filter((row) => {
      const matchesSearch =
        search.length === 0 ||
        row.fullName.toLowerCase().includes(search) ||
        row.email.toLowerCase().includes(search)

      const matchesRole = filters.role === 'all' || row.role === filters.role
      const matchesStatus = filters.status === 'all' || row.status === filters.status
      const matchesDepartment = filters.department === 'all' || row.department === filters.department

      return matchesSearch && matchesRole && matchesStatus && matchesDepartment
    })

    const sorted = [...filtered].sort((a, b) => {
      if (filters.sort === 'name-asc') return a.fullName.localeCompare(b.fullName)
      if (filters.sort === 'name-desc') return b.fullName.localeCompare(a.fullName)
      if (filters.sort === 'date-asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return sorted
  }, [employees, filters])

  const departments = useMemo(() => getDepartmentOptions(employees), [employees])

  const handleRequestToggle = (id: string, nextStatus: EmployeeStatus) => {
    setPendingStatusChange({ id, nextStatus })
  }

  const applyStatusChange = () => {
    if (!pendingStatusChange) return

    setEmployees((prev) => prev.map((employee) => (
      employee.id === pendingStatusChange.id ? { ...employee, status: pendingStatusChange.nextStatus } : employee
    )))

    setToast({
      tone: 'success',
      message: pendingStatusChange.nextStatus === 'active' ? 'Empleado reactivado correctamente' : 'Empleado desactivado correctamente',
    })
    setPendingStatusChange(null)
  }

  if (loading) {
    return (
      <AppLayout
        user={user}
        breadcrumbs={[{ label: 'NexoRH' }, { label: 'Empleados' }]}
      >
        <EmployeeSkeleton />
      </AppLayout>
    )
  }

  if (!user) return null

  return (
    <AppLayout
      user={user}
      breadcrumbs={[{ label: 'NexoRH', href: '/dashboard' }, { label: 'Empleados' }]}
    >
      <section className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md mb-6">
        <SectionHeader
          title="Empleados"
          description="Gestiona el equipo con filtros avanzados, acciones por fila y vistas de perfil"
          action={
            <div className="flex items-center gap-2">
              <Badge variant="primary">{filteredEmployees.length} resultados</Badge>
              <Button onClick={() => router.push('/employees/new')}>+ Nuevo empleado</Button>
            </div>
          }
        />

        <EmployeeStats employees={employees} />
      </section>

      <section className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md">
        <EmployeeFilters
          value={filters}
          departments={departments}
          onChange={setFilters}
          onReset={() => setFilters({ query: '', role: 'all', status: 'all', department: 'all', sort: 'name-asc' })}
        />

        {filteredEmployees.length === 0 ? (
          <EmployeeEmptyState filtered={employees.length > 0} onResetFilters={() => setFilters({ query: '', role: 'all', status: 'all', department: 'all', sort: 'name-asc' })} />
        ) : (
          <EmployeesTable
            employees={filteredEmployees}
            onView={(id) => router.push(`/employees/${id}`)}
            onEdit={(id) => router.push(`/employees/${id}/edit`)}
            onRequestToggle={handleRequestToggle}
          />
        )}
      </section>

      <Modal
        open={Boolean(pendingStatusChange)}
        onClose={() => setPendingStatusChange(null)}
        title={pendingStatusChange?.nextStatus === 'active' ? 'Confirmar reactivacion' : 'Confirmar desactivacion'}
        description="Este cambio afecta el acceso del empleado al sistema."
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setPendingStatusChange(null)}>Cancelar</Button>
            <Button onClick={applyStatusChange}>{pendingStatusChange?.nextStatus === 'active' ? 'Reactivar' : 'Desactivar'}</Button>
          </div>
        }
      >
        <p className="text-sm text-gray-600">
          {pendingStatusChange?.nextStatus === 'active'
            ? 'El empleado volvera a tener acceso inmediato a su cuenta.'
            : 'El empleado no podra iniciar sesion hasta ser reactivado.'}
        </p>
      </Modal>

      {toast && (
        <div className="fixed bottom-5 right-5 z-50">
          <div className={`px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-[fadeIn_.2s_ease-out] ${toast.tone === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
            {toast.message}
          </div>
        </div>
      )}
    </AppLayout>
  )
}
