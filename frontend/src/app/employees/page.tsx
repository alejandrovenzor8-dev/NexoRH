'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Search,
  Slash,
  UserX,
  Users,
  MoreVertical,
} from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import SectionHeader from '@/components/ui/SectionHeader'
import DataTable from '@/components/ui/DataTable'
import StatusBadge from '@/components/ui/StatusBadge'
import EmptyState from '@/components/ui/EmptyState'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { getCurrentUser, getUsers, User } from '@/services/api'

interface EmployeeRow {
  id: string
  avatar: string
  name: string
  email: string
  role: string
  status: string
  joinedAt: string
}

const PAGE_SIZE = 8

function formatDate(date: string) {
  const d = new Date(date)
  return d.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

export default function EmployeesPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

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
        setUsers(allUsers)
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

  const rows = useMemo<EmployeeRow[]>(() => {
    return users.map((u) => ({
      id: u.id,
      avatar: u.fullName.charAt(0).toUpperCase(),
      name: u.fullName,
      email: u.email,
      role: u.role,
      status: u.status || 'active',
      joinedAt: formatDate(u.createdAt),
    }))
  }, [users])

  const filteredRows = useMemo(() => {
    const search = query.trim().toLowerCase()
    return rows.filter((row) => {
      const matchesSearch =
        search.length === 0 ||
        row.name.toLowerCase().includes(search) ||
        row.email.toLowerCase().includes(search)

      const matchesRole = roleFilter === 'all' || row.role === roleFilter
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [rows, query, roleFilter, statusFilter])

  useEffect(() => {
    setPage(1)
  }, [query, roleFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const paginatedRows = filteredRows.slice(start, start + PAGE_SIZE)

  const columns = [
    {
      key: 'avatar',
      label: 'Avatar',
      render: (row: EmployeeRow) => (
        <div
          title={`Avatar de ${row.name}`}
          className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm flex items-center justify-center"
        >
          {row.avatar}
        </div>
      ),
      className: 'w-[90px]',
    },
    {
      key: 'name',
      label: 'Nombre',
      render: (row: EmployeeRow) => <span className="font-medium text-gray-900">{row.name}</span>,
    },
    {
      key: 'email',
      label: 'Correo',
      render: (row: EmployeeRow) => <span className="text-gray-600">{row.email}</span>,
    },
    {
      key: 'role',
      label: 'Rol',
      render: (row: EmployeeRow) => <StatusBadge value={row.role} variant="role" />,
    },
    {
      key: 'status',
      label: 'Estado',
      render: (row: EmployeeRow) => <StatusBadge value={row.status} variant="status" />,
    },
    {
      key: 'joinedAt',
      label: 'Fecha ingreso',
      render: (row: EmployeeRow) => <span className="text-gray-600">{row.joinedAt}</span>,
    },
    {
      key: 'actions',
      label: 'Acciones',
      className: 'text-right',
      render: (row: EmployeeRow) => {
        const isOpen = openMenuId === row.id
        return (
          <div className="relative inline-flex justify-end w-full">
            <button
              title="Abrir acciones"
              onClick={() => setOpenMenuId(isOpen ? null : row.id)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isOpen && (
              <div className="absolute right-0 top-9 z-20 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1">
                <button
                  className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  onClick={() => setOpenMenuId(null)}
                >
                  <Eye className="w-4 h-4" />
                  Ver perfil
                </button>
                <button
                  className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  onClick={() => setOpenMenuId(null)}
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </button>
                <button
                  className="w-full px-3 py-2 text-sm text-left text-danger-600 hover:bg-danger-50 flex items-center gap-2"
                  onClick={() => setOpenMenuId(null)}
                >
                  <UserX className="w-4 h-4" />
                  Desactivar
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
      <AppLayout
        user={user}
        breadcrumbs={[{ label: 'NexoRH' }, { label: 'Empleados' }]}
      >
        <section className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-sm animate-pulse">
          <div className="h-7 w-44 bg-gray-100 rounded mb-2" />
          <div className="h-4 w-72 bg-gray-100 rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            <div className="h-10 bg-gray-100 rounded-lg" />
            <div className="h-10 bg-gray-100 rounded-lg" />
            <div className="h-10 bg-gray-100 rounded-lg" />
          </div>
          <DataTable columns={columns} data={[]} keyField="id" loading />
        </section>
      </AppLayout>
    )
  }

  if (!user) return null

  return (
    <AppLayout
      user={user}
      breadcrumbs={[{ label: 'NexoRH', href: '/dashboard' }, { label: 'Empleados' }]}
    >
      <section className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md">
        <SectionHeader
          title="Empleados"
          description="Gestiona el equipo con búsquedas avanzadas, filtros y acciones por colaborador"
          action={<Badge variant="primary">{filteredRows.length} resultados</Badge>}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div className="md:col-span-1">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre o correo"
            />
          </div>
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { label: 'Todos los roles', value: 'all' },
              { label: 'Admin', value: 'ADMIN' },
              { label: 'Manager', value: 'MANAGER' },
              { label: 'Usuario', value: 'USER' },
            ]}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: 'Todos los estados', value: 'all' },
              { label: 'Activo', value: 'active' },
              { label: 'Inactivo', value: 'inactive' },
              { label: 'Pendiente', value: 'pending' },
            ]}
          />
        </div>

        {filteredRows.length === 0 ? (
          <div className="rounded-xl border border-gray-200/80 bg-gray-50/40">
            <EmptyState
              icon={users.length === 0 ? Users : Slash}
              title={users.length === 0 ? 'No hay empleados registrados' : 'Sin coincidencias'}
              description={
                users.length === 0
                  ? 'Invita a tu primer colaborador para comenzar a gestionar tu equipo.'
                  : 'Ajusta la búsqueda o los filtros para encontrar empleados.'
              }
              action={{
                label: 'Limpiar filtros',
                onClick: () => {
                  setQuery('')
                  setRoleFilter('all')
                  setStatusFilter('all')
                },
              }}
            />
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              data={paginatedRows}
              keyField="id"
              emptyMessage="No hay empleados para esta página"
            />

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-gray-500">
                Mostrando <strong>{start + 1}</strong> a <strong>{Math.min(start + PAGE_SIZE, filteredRows.length)}</strong> de <strong>{filteredRows.length}</strong> empleados
              </p>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-600 min-w-20 text-center">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </>
        )}
      </section>
    </AppLayout>
  )
}
