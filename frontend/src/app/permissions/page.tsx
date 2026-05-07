'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CalendarCheck,
  CalendarClock,
  CalendarX2,
  CheckCircle2,
  Clock3,
  Eye,
  Loader2,
  MoreVertical,
  Plus,
  ShieldAlert,
  XCircle,
} from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import DataTable from '@/components/ui/DataTable'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Modal from '@/components/ui/Modal'
import EmptyState from '@/components/ui/EmptyState'
import StatCard from '@/components/ui/StatCard'
import { getCurrentUser, getUsers, User } from '@/services/api'
import { mapUsersToEmployees } from '@/components/employees/employee-data'
import { EmployeeRecord } from '@/components/employees/types'

type PermissionStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'

type PermissionType =
  | 'Vacaciones'
  | 'Permiso personal'
  | 'Incapacidad'
  | 'Home office'

interface PermissionRequest {
  id: string
  employeeId: string
  employeeName: string
  employeeEmail: string
  department: string
  type: PermissionType
  startDate: string
  endDate: string
  duration: number
  status: PermissionStatus
  manager: string
  updatedAt: string
}

interface PermissionFilters {
  query: string
  status: 'all' | PermissionStatus
  type: 'all' | PermissionType
  department: 'all' | string
  date: string
  sort: 'updated-desc' | 'updated-asc' | 'start-desc' | 'start-asc'
}

interface NewRequestForm {
  employeeId: string
  type: PermissionType
  startDate: string
  endDate: string
}

const STATUS_BADGE: Record<PermissionStatus, React.ReactNode> = {
  pending: <Badge variant="warning">Pendiente</Badge>,
  approved: <Badge variant="success">Aprobada</Badge>,
  rejected: <Badge variant="danger">Rechazada</Badge>,
  cancelled: <Badge variant="muted">Cancelada</Badge>,
}

const REQUEST_TYPES: PermissionType[] = [
  'Vacaciones',
  'Permiso personal',
  'Incapacidad',
  'Home office',
]

const PAGE_SIZE = 8

function isoDateOffset(offsetDays: number) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

function humanDate(date: string) {
  return new Date(date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

function dayDiff(start: string, end: string) {
  const startMs = new Date(start).getTime()
  const endMs = new Date(end).getTime()
  return Math.max(1, Math.floor((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1)
}

function generateRequests(employees: EmployeeRecord[]): PermissionRequest[] {
  const managers = employees.filter((e) => e.role === 'ADMIN' || e.role === 'MANAGER')

  return employees.slice(0, 16).map((employee, index) => {
    const start = isoDateOffset(-index * 3)
    const end = isoDateOffset(-index * 3 + (index % 4) + 1)
    const statusCycle: PermissionStatus[] = ['pending', 'approved', 'rejected', 'cancelled']
    const type = REQUEST_TYPES[index % REQUEST_TYPES.length]
    const manager = managers[index % Math.max(1, managers.length)]

    return {
      id: `req-${employee.id.slice(0, 6)}-${index}`,
      employeeId: employee.id,
      employeeName: employee.fullName,
      employeeEmail: employee.email,
      department: employee.department,
      type,
      startDate: start,
      endDate: end,
      duration: dayDiff(start, end),
      status: statusCycle[index % statusCycle.length],
      manager: manager ? manager.fullName : 'Sin asignar',
      updatedAt: isoDateOffset(-index),
    }
  })
}

function PermissionsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm">
        <div className="h-7 w-64 bg-gray-100 rounded mb-2" />
        <div className="h-4 w-96 bg-gray-100 rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl border border-gray-200 bg-white" />
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg" />
          ))}
        </div>
        <div className="h-72 rounded-xl border border-gray-200 bg-gray-50" />
      </div>
    </div>
  )
}

export default function PermissionsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [employees, setEmployees] = useState<EmployeeRecord[]>([])
  const [requests, setRequests] = useState<PermissionRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [detail, setDetail] = useState<PermissionRequest | null>(null)
  const [toast, setToast] = useState<{ tone: 'success' | 'error' | 'info'; message: string } | null>(null)
  const [pendingAction, setPendingAction] = useState<{ id: string; action: 'approve' | 'reject' | 'cancel' } | null>(null)
  const [newRequestOpen, setNewRequestOpen] = useState(false)
  const [newRequestSaving, setNewRequestSaving] = useState(false)
  const [newRequestForm, setNewRequestForm] = useState<NewRequestForm>({
    employeeId: '',
    type: 'Vacaciones',
    startDate: isoDateOffset(1),
    endDate: isoDateOffset(2),
  })

  const [filters, setFilters] = useState<PermissionFilters>({
    query: '',
    status: 'all',
    type: 'all',
    department: 'all',
    date: '',
    sort: 'updated-desc',
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
      return
    }

    Promise.all([getCurrentUser(token), getUsers(token)])
      .then(([currentUser, allUsers]) => {
        const mappedEmployees = mapUsersToEmployees(allUsers)
        setUser(currentUser)
        setEmployees(mappedEmployees)
        setRequests(generateRequests(mappedEmployees))
        setNewRequestForm((prev) => ({
          ...prev,
          employeeId: mappedEmployees[0]?.id ?? '',
        }))
      })
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.replace('/login')
      })
      .finally(() => setLoading(false))
  }, [router])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    setPage(1)
  }, [filters])

  const departmentOptions = useMemo(
    () => Array.from(new Set(employees.map((e) => e.department))).sort((a, b) => a.localeCompare(b)),
    [employees],
  )

  const filtered = useMemo(() => {
    const query = filters.query.trim().toLowerCase()

    const list = requests.filter((item) => {
      const matchesQuery =
        query.length === 0 ||
        item.employeeName.toLowerCase().includes(query) ||
        item.employeeEmail.toLowerCase().includes(query) ||
        item.manager.toLowerCase().includes(query)

      const matchesStatus = filters.status === 'all' || item.status === filters.status
      const matchesType = filters.type === 'all' || item.type === filters.type
      const matchesDepartment = filters.department === 'all' || item.department === filters.department
      const matchesDate =
        !filters.date ||
        item.startDate === filters.date ||
        item.endDate === filters.date

      return matchesQuery && matchesStatus && matchesType && matchesDepartment && matchesDate
    })

    return [...list].sort((a, b) => {
      if (filters.sort === 'updated-asc') return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      if (filters.sort === 'start-desc') return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      if (filters.sort === 'start-asc') return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }, [requests, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const paged = filtered.slice(startIndex, startIndex + PAGE_SIZE)

  const stats = useMemo(() => ({
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
    activeAbsences: requests.filter((r) => r.status === 'approved' && new Date(r.endDate) >= new Date()).length,
  }), [requests])

  const applyAction = () => {
    if (!pendingAction) return

    const nextStatus: Record<typeof pendingAction.action, PermissionStatus> = {
      approve: 'approved',
      reject: 'rejected',
      cancel: 'cancelled',
    }

    setRequests((prev) => prev.map((item) => (
      item.id === pendingAction.id
        ? { ...item, status: nextStatus[pendingAction.action], updatedAt: new Date().toISOString().slice(0, 10) }
        : item
    )))

    const labelMap: Record<typeof pendingAction.action, string> = {
      approve: 'Solicitud aprobada',
      reject: 'Solicitud rechazada',
      cancel: 'Solicitud cancelada',
    }

    setToast({ tone: 'success', message: `${labelMap[pendingAction.action]} correctamente.` })
    setPendingAction(null)
  }

  const createRequest = async () => {
    const employee = employees.find((e) => e.id === newRequestForm.employeeId)
    if (!employee) {
      setToast({ tone: 'error', message: 'Selecciona un empleado valido.' })
      return
    }

    if (!newRequestForm.startDate || !newRequestForm.endDate || newRequestForm.startDate > newRequestForm.endDate) {
      setToast({ tone: 'error', message: 'Verifica las fechas de la solicitud.' })
      return
    }

    setNewRequestSaving(true)

    window.setTimeout(() => {
      const managers = employees.filter((e) => e.role === 'ADMIN' || e.role === 'MANAGER')
      const manager = managers[0]?.fullName ?? 'Sin asignar'
      const newItem: PermissionRequest = {
        id: `req-new-${Date.now()}`,
        employeeId: employee.id,
        employeeName: employee.fullName,
        employeeEmail: employee.email,
        department: employee.department,
        type: newRequestForm.type,
        startDate: newRequestForm.startDate,
        endDate: newRequestForm.endDate,
        duration: dayDiff(newRequestForm.startDate, newRequestForm.endDate),
        status: 'pending',
        manager,
        updatedAt: new Date().toISOString().slice(0, 10),
      }

      setRequests((prev) => [newItem, ...prev])
      setNewRequestSaving(false)
      setNewRequestOpen(false)
      setToast({ tone: 'success', message: 'Solicitud creada exitosamente.' })
    }, 550)
  }

  const columns = [
    {
      key: 'employee',
      label: 'Empleado',
      render: (row: PermissionRequest) => (
        <div className="min-w-[180px]">
          <p className="font-medium text-gray-900">{row.employeeName}</p>
          <p className="text-xs text-gray-400">{row.employeeEmail}</p>
        </div>
      ),
    },
    { key: 'type', label: 'Tipo', render: (row: PermissionRequest) => <span className="text-gray-700">{row.type}</span> },
    { key: 'startDate', label: 'Fecha inicio', render: (row: PermissionRequest) => <span className="text-gray-700">{humanDate(row.startDate)}</span> },
    { key: 'endDate', label: 'Fecha fin', render: (row: PermissionRequest) => <span className="text-gray-700">{humanDate(row.endDate)}</span> },
    { key: 'duration', label: 'Duracion', render: (row: PermissionRequest) => <span className="text-gray-700">{row.duration} dia(s)</span> },
    { key: 'status', label: 'Estado', render: (row: PermissionRequest) => STATUS_BADGE[row.status] },
    { key: 'manager', label: 'Manager', render: (row: PermissionRequest) => <span title={row.manager}>{row.manager}</span> },
    { key: 'updatedAt', label: 'Ultima actualizacion', render: (row: PermissionRequest) => <span className="text-gray-700">{humanDate(row.updatedAt)}</span> },
    {
      key: 'actions',
      label: 'Acciones',
      className: 'text-right w-[90px]',
      render: (row: PermissionRequest) => {
        const open = openMenuId === row.id

        return (
          <div className="relative inline-flex justify-end w-full">
            <button
              title="Abrir acciones"
              onClick={() => setOpenMenuId(open ? null : row.id)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {open && (
              <div className="absolute right-0 top-9 z-20 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1">
                <button
                  className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  onClick={() => {
                    setOpenMenuId(null)
                    setDetail(row)
                  }}
                >
                  <Eye className="w-4 h-4" />
                  Ver detalle
                </button>
                <button
                  className="w-full px-3 py-2 text-sm text-left text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 disabled:text-gray-400 disabled:hover:bg-transparent"
                  onClick={() => {
                    setOpenMenuId(null)
                    setPendingAction({ id: row.id, action: 'approve' })
                  }}
                  disabled={row.status === 'approved' || row.status === 'cancelled'}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Aprobar
                </button>
                <button
                  className="w-full px-3 py-2 text-sm text-left text-rose-700 hover:bg-rose-50 flex items-center gap-2 disabled:text-gray-400 disabled:hover:bg-transparent"
                  onClick={() => {
                    setOpenMenuId(null)
                    setPendingAction({ id: row.id, action: 'reject' })
                  }}
                  disabled={row.status === 'rejected' || row.status === 'cancelled'}
                >
                  <XCircle className="w-4 h-4" />
                  Rechazar
                </button>
                <button
                  className="w-full px-3 py-2 text-sm text-left text-gray-600 hover:bg-gray-50 flex items-center gap-2 disabled:text-gray-400 disabled:hover:bg-transparent"
                  onClick={() => {
                    setOpenMenuId(null)
                    setPendingAction({ id: row.id, action: 'cancel' })
                  }}
                  disabled={row.status === 'cancelled'}
                >
                  <ShieldAlert className="w-4 h-4" />
                  Cancelar
                </button>
              </div>
            )}
          </div>
        )
      },
    },
  ]

  if (loading) {
    return (
      <AppLayout user={user} breadcrumbs={[{ label: 'NexoRH' }, { label: 'Permisos y Ausencias' }]}>
        <PermissionsSkeleton />
      </AppLayout>
    )
  }

  if (!user) return null

  return (
    <AppLayout
      user={user}
      breadcrumbs={[{ label: 'NexoRH', href: '/dashboard' }, { label: 'Permisos y Ausencias' }]}
    >
      <section className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md mb-6">
        <SectionHeader
          title="Permisos y Ausencias"
          description="Gestiona solicitudes, aprobaciones y ausencias del equipo"
          action={
            <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setNewRequestOpen(true)}>
              Nueva solicitud
            </Button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Pendientes" value={stats.pending} subtitle="Esperando revision" icon={Clock3} iconColor="text-amber-600" />
          <StatCard title="Aprobadas" value={stats.approved} subtitle="Solicitudes confirmadas" icon={CheckCircle2} iconColor="text-emerald-600" />
          <StatCard title="Rechazadas" value={stats.rejected} subtitle="Requieren seguimiento" icon={XCircle} iconColor="text-rose-600" />
          <StatCard title="Ausencias activas" value={stats.activeAbsences} subtitle="Hoy en curso" icon={CalendarClock} iconColor="text-blue-600" />
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3 mb-5">
          <div className="xl:col-span-2">
            <Input
              value={filters.query}
              onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
              placeholder="Buscar empleado, correo o manager..."
            />
          </div>
          <Select
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as PermissionFilters['status'] }))}
            options={[
              { label: 'Estado', value: 'all' },
              { label: 'Pendiente', value: 'pending' },
              { label: 'Aprobada', value: 'approved' },
              { label: 'Rechazada', value: 'rejected' },
              { label: 'Cancelada', value: 'cancelled' },
            ]}
          />
          <Select
            value={filters.type}
            onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value as PermissionFilters['type'] }))}
            options={[
              { label: 'Tipo', value: 'all' },
              ...REQUEST_TYPES.map((type) => ({ label: type, value: type })),
            ]}
          />
          <Select
            value={filters.department}
            onChange={(e) => setFilters((prev) => ({ ...prev, department: e.target.value }))}
            options={[
              { label: 'Departamento', value: 'all' },
              ...departmentOptions.map((d) => ({ label: d, value: d })),
            ]}
          />
          <Input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters((prev) => ({ ...prev, date: e.target.value }))}
          />
        </div>

        <div className="flex items-center justify-between gap-3 mb-4">
          <Select
            value={filters.sort}
            onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value as PermissionFilters['sort'] }))}
            options={[
              { label: 'Ultima actualizacion (reciente)', value: 'updated-desc' },
              { label: 'Ultima actualizacion (antigua)', value: 'updated-asc' },
              { label: 'Fecha inicio (reciente)', value: 'start-desc' },
              { label: 'Fecha inicio (antigua)', value: 'start-asc' },
            ]}
            className="max-w-xs"
          />
          <Button
            variant="ghost"
            onClick={() => setFilters({ query: '', status: 'all', type: 'all', department: 'all', date: '', sort: 'updated-desc' })}
          >
            Limpiar filtros
          </Button>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-gray-200/80 bg-gray-50/50">
            <EmptyState
              icon={CalendarCheck}
              title="No hay solicitudes registradas"
              description="Crea una nueva solicitud o ajusta los filtros para ver resultados."
            />
          </div>
        ) : (
          <>
            <DataTable columns={columns} data={paged} keyField="id" />
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-gray-500">
                Mostrando <strong>{startIndex + 1}</strong> a <strong>{Math.min(startIndex + PAGE_SIZE, filtered.length)}</strong> de <strong>{filtered.length}</strong> solicitudes
              </p>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  Anterior
                </Button>
                <span className="text-sm text-gray-600 min-w-16 text-center">{currentPage} / {totalPages}</span>
                <Button size="sm" variant="ghost" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                  Siguiente
                </Button>
              </div>
            </div>
          </>
        )}
      </section>

      <Modal
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title="Detalle de solicitud"
        description="Informacion completa de la ausencia seleccionada"
      >
        {detail ? (
          <div className="space-y-3 text-sm text-gray-700">
            <p><strong className="text-gray-900">Empleado:</strong> {detail.employeeName}</p>
            <p><strong className="text-gray-900">Tipo:</strong> {detail.type}</p>
            <p><strong className="text-gray-900">Rango:</strong> {humanDate(detail.startDate)} - {humanDate(detail.endDate)}</p>
            <p><strong className="text-gray-900">Duracion:</strong> {detail.duration} dia(s)</p>
            <p><strong className="text-gray-900">Manager:</strong> {detail.manager}</p>
            <p><strong className="text-gray-900">Estado:</strong> <span className="ml-1">{STATUS_BADGE[detail.status]}</span></p>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(pendingAction)}
        onClose={() => setPendingAction(null)}
        title="Confirmar accion"
        description="Esta accion actualizara el estado de la solicitud seleccionada."
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setPendingAction(null)}>Cancelar</Button>
            <Button onClick={applyAction}>Confirmar</Button>
          </div>
        }
      >
        <p className="text-sm text-gray-600">
          {pendingAction?.action === 'approve' && 'La solicitud sera marcada como aprobada.'}
          {pendingAction?.action === 'reject' && 'La solicitud sera marcada como rechazada.'}
          {pendingAction?.action === 'cancel' && 'La solicitud sera marcada como cancelada.'}
        </p>
      </Modal>

      <Modal
        open={newRequestOpen}
        onClose={() => setNewRequestOpen(false)}
        title="Nueva solicitud"
        description="Registra una nueva solicitud de permiso o ausencia"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setNewRequestOpen(false)} disabled={newRequestSaving}>Cancelar</Button>
            <Button onClick={createRequest} disabled={newRequestSaving}>
              {newRequestSaving ? (
                <span className="inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</span>
              ) : (
                'Crear solicitud'
              )}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Select
            label="Empleado"
            value={newRequestForm.employeeId}
            onChange={(e) => setNewRequestForm((prev) => ({ ...prev, employeeId: e.target.value }))}
            options={employees.map((e) => ({ label: `${e.fullName} - ${e.department}`, value: e.id }))}
          />
          <Select
            label="Tipo"
            value={newRequestForm.type}
            onChange={(e) => setNewRequestForm((prev) => ({ ...prev, type: e.target.value as PermissionType }))}
            options={REQUEST_TYPES.map((type) => ({ label: type, value: type }))}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              type="date"
              label="Fecha inicio"
              value={newRequestForm.startDate}
              onChange={(e) => setNewRequestForm((prev) => ({ ...prev, startDate: e.target.value }))}
            />
            <Input
              type="date"
              label="Fecha fin"
              value={newRequestForm.endDate}
              onChange={(e) => setNewRequestForm((prev) => ({ ...prev, endDate: e.target.value }))}
            />
          </div>
        </div>
      </Modal>

      {toast && (
        <div className="fixed bottom-5 right-5 z-50">
          <div
            className={[
              'px-4 py-3 rounded-xl border text-sm font-medium shadow-lg',
              toast.tone === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : toast.tone === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-blue-50 border-blue-200 text-blue-700',
            ].join(' ')}
          >
            {toast.message}
          </div>
        </div>
      )}
    </AppLayout>
  )
}
