'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Eye, MoreVertical, Pencil, UserCheck, UserX } from 'lucide-react'
import DataTable from '@/components/ui/DataTable'
import StatusBadge from '@/components/ui/StatusBadge'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { EmployeeRecord, EmployeeStatus } from './types'
import { EmployeeStatus as EmployeeStatusEnum } from '@/types/employee'

const PAGE_SIZE = 8

interface EmployeesTableProps {
  employees: EmployeeRecord[]
  onView: (id: string) => void
  onEdit: (id: string) => void
  onRequestToggle: (id: string, nextStatus: EmployeeStatus) => void
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

export default function EmployeesTable({ employees, onView, onEdit, onRequestToggle }: EmployeesTableProps) {
  const [page, setPage] = useState(1)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const totalPages = Math.max(1, Math.ceil(employees.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE

  const rows = useMemo(() => employees.slice(start, start + PAGE_SIZE), [employees, start])

  const columns = [
    {
      key: 'avatar',
      label: 'Avatar',
      className: 'w-[92px]',
      render: (row: EmployeeRecord) => (
        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold flex items-center justify-center" title={row.fullName}>
          {row.fullName.charAt(0).toUpperCase()}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Nombre',
      render: (row: EmployeeRecord) => <span className="font-medium text-gray-900">{row.fullName}</span>,
    },
    {
      key: 'email',
      label: 'Correo',
      render: (row: EmployeeRecord) => <span className="text-gray-600">{row.email}</span>,
    },
    {
      key: 'role',
      label: 'Rol',
      render: (row: EmployeeRecord) => <StatusBadge value={row.role} variant="role" />,
    },
    {
      key: 'status',
      label: 'Estado',
      render: (row: EmployeeRecord) => {
        if (row.status === EmployeeStatusEnum.TERMINATED) return <Badge variant="danger">Baja</Badge>
        return <StatusBadge value={row.status} variant="status" />
      },
    },
    {
      key: 'department',
      label: 'Departamento',
      render: (row: EmployeeRecord) => <span className="text-gray-600">{row.department}</span>,
    },
    {
      key: 'joinedAt',
      label: 'Fecha ingreso',
      render: (row: EmployeeRecord) => <span className="text-gray-600">{formatDate(row.createdAt)}</span>,
    },
    {
      key: 'actions',
      label: 'Acciones',
      className: 'text-right w-[90px]',
      render: (row: EmployeeRecord) => {
        const isOpen = openMenuId === row.id
        const canActivate = row.status === EmployeeStatusEnum.INACTIVE

        return (
          <div className="relative inline-flex justify-end w-full">
            <button
              onClick={() => setOpenMenuId(isOpen ? null : row.id)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title="Abrir menu"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {isOpen && (
              <div className="absolute right-0 top-9 z-20 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1">
                <button
                  className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  onClick={() => {
                    setOpenMenuId(null)
                    onView(row.id)
                  }}
                >
                  <Eye className="w-4 h-4" />
                  Ver perfil
                </button>
                <button
                  className="w-full px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  onClick={() => {
                    setOpenMenuId(null)
                    onEdit(row.id)
                  }}
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </button>
                {canActivate ? (
                  <button
                    className="w-full px-3 py-2 text-sm text-left text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
                    onClick={() => {
                      setOpenMenuId(null)
                      onRequestToggle(row.id, EmployeeStatusEnum.ACTIVE)
                    }}
                  >
                    <UserCheck className="w-4 h-4" />
                    Reactivar
                  </button>
                ) : (
                  <button
                    className="w-full px-3 py-2 text-sm text-left text-danger-600 hover:bg-danger-50 flex items-center gap-2"
                    onClick={() => {
                      setOpenMenuId(null)
                      onRequestToggle(row.id, EmployeeStatusEnum.INACTIVE)
                    }}
                    disabled={row.status === EmployeeStatusEnum.TERMINATED}
                  >
                    <UserX className="w-4 h-4" />
                    Desactivar
                  </button>
                )}
              </div>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <DataTable columns={columns} data={rows} keyField="id" emptyMessage="No hay empleados" />

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-gray-500">
          Mostrando <strong>{employees.length === 0 ? 0 : start + 1}</strong> a{' '}
          <strong>{Math.min(start + PAGE_SIZE, employees.length)}</strong> de <strong>{employees.length}</strong>
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
          <span className="text-sm text-gray-600 min-w-16 text-center">
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
    </div>
  )
}
