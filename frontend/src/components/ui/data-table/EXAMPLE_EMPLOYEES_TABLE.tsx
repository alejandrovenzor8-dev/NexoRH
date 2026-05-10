/**
 * EJEMPLO PRÁCTICO: Tabla de Empleados con DataTable Enterprise
 *
 * Este archivo muestra cómo integrar el DataTable con los hooks y tipos
 * existentes en NexoRH. Reemplaza la lógica de tabla dispersa en páginas.
 */

'use client'

import { useState, useMemo } from 'react'
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilter,
  type DataTableSort,
  type RowAction,
} from '@/components/ui/data-table'
import {
  EditIcon,
  Trash2Icon,
  EyeIcon,
  MoreVerticalIcon,
} from 'lucide-react'
import type { EmployeeRecord } from '@/types'
import { EmployeeStatus } from '@/types/employee'
import { ROLE_META, EMPLOYEE_STATUS_META } from '@/constants'

/**
 * Props del componente
 */
interface EmployeesTableProps {
  employees: EmployeeRecord[]
  loading?: boolean
  onEdit?: (employee: EmployeeRecord) => void
  onDelete?: (employee: EmployeeRecord) => void
  onView?: (employee: EmployeeRecord) => void
  onBulkDelete?: (ids: string[]) => void
}

/**
 * Tabla de Empleados Reutilizable
 */
export function EmployeesTable({
  employees,
  loading = false,
  onEdit,
  onDelete,
  onView,
  onBulkDelete,
}: EmployeesTableProps) {
  // ============================================================================
  // ESTADO
  // ============================================================================

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchValue, setSearchValue] = useState('')
  const [activeFilters, setActiveFilters] = useState<
    Record<string, string | string[]>
  >({})
  const [sort, setSort] = useState<DataTableSort[]>([])
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'name',
    'email',
    'role',
    'status',
    'department',
  ])

  // ============================================================================
  // COLUMNAS
  // ============================================================================

  const columns: DataTableColumn<EmployeeRecord>[] = [
    {
      id: 'name',
      label: 'Nombre',
      accessor: 'fullName',
      sortable: true,
      filterable: true,
      hideable: true,
      width: '200px',
    },
    {
      id: 'email',
      label: 'Email',
      accessor: 'email',
      sortable: true,
      hideable: true,
      width: '220px',
    },
    {
      id: 'phone',
      label: 'Teléfono',
      accessor: 'phone',
      sortable: false,
      hideable: true,
      width: '140px',
    },
    {
      id: 'role',
      label: 'Rol',
      accessor: 'role',
      sortable: true,
      filterable: true,
      hideable: true,
      width: '140px',
      render: (value): React.ReactNode => {
        const roleStr = String(value)
        const meta = ROLE_META[roleStr as keyof typeof ROLE_META]
        if (!meta) return <span>{roleStr}</span>
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap`}
            style={{
              backgroundColor: meta.bgColor,
              color: meta.color,
            }}
          >
            {meta.label}
          </span>
        )
      },
    },
    {
      id: 'status',
      label: 'Estado',
      accessor: 'status',
      sortable: true,
      filterable: true,
      hideable: true,
      width: '130px',
      render: (value): React.ReactNode => {
        const statusStr = String(value)
        const meta = EMPLOYEE_STATUS_META[statusStr as keyof typeof EMPLOYEE_STATUS_META]
        if (!meta) return <span>{statusStr}</span>
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap`}
            style={{
              backgroundColor: meta.bgColor,
              color: meta.color,
            }}
          >
            {meta.label}
          </span>
        )
      },
    },
    {
      id: 'department',
      label: 'Departamento',
      accessor: 'department',
      sortable: true,
      filterable: true,
      hideable: true,
      width: '150px',
    },
    {
      id: 'createdAt',
      label: 'Fecha de Registro',
      accessor: 'createdAt',
      sortable: true,
      hideable: true,
      width: '140px',
      align: 'center',
      render: (value): React.ReactNode => {
        if (!value) return '-'
        return new Date(String(value)).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      },
    },
  ]

  // ============================================================================
  // FILTROS
  // ============================================================================

  const filters: DataTableFilter[] = [
    {
      id: 'role',
      label: 'Rol',
      type: 'select',
      options: [
        { label: 'Admin', value: 'ADMIN' },
        { label: 'Manager', value: 'MANAGER' },
        { label: 'Usuario', value: 'USER' },
      ],
    },
    {
      id: 'status',
      label: 'Estado',
      type: 'select',
      options: [
        { label: 'Activo', value: 'ACTIVE' },
        { label: 'Inactivo', value: 'INACTIVE' },
        { label: 'Terminado', value: 'TERMINATED' },
      ],
    },
  ]

  // ============================================================================
  // ACCIONES DE FILA
  // ============================================================================

  const rowActions: RowAction<EmployeeRecord>[] = [
    {
      id: 'view',
      label: 'Ver detalles',
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: (row) => onView?.(row),
    },
    {
      id: 'edit',
      label: 'Editar',
      icon: <EditIcon className="w-4 h-4" />,
      onClick: (row) => onEdit?.(row),
    },
    {
      id: 'delete',
      label: 'Eliminar',
      icon: <Trash2Icon className="w-4 h-4" />,
      variant: 'danger',
      onClick: (row) => {
        if (confirm(`¿Eliminar a ${row.fullName}?`)) {
          onDelete?.(row)
        }
      },
      disabled: (row) => row.status === EmployeeStatus.TERMINATED,
      divider: true,
    },
  ]

  // ============================================================================
  // CÁLCULOS DERIVADOS
  // ============================================================================

  const totalPages = useMemo(() => {
    return Math.ceil(employees.length / pageSize)
  }, [employees.length, pageSize])

  const canSelectAll = useMemo(() => {
    return employees.length > 0 && selectedRows.length === employees.length
  }, [employees.length, selectedRows.length])

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-4">
      {/* Selección masiva info */}
      {selectedRows.length > 0 && (
        <div className="px-6 py-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900">
            {selectedRows.length} empleado{selectedRows.length !== 1 ? 's' : ''} seleccionado{selectedRows.length !== 1 ? 's' : ''}
          </span>
          {onBulkDelete && (
            <button
              onClick={() => {
                if (confirm('¿Eliminar los empleados seleccionados?')) {
                  onBulkDelete(selectedRows)
                }
              }}
              className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            >
              Eliminar seleccionados
            </button>
          )}
        </div>
      )}

      {/* DataTable Enterprise */}
      <DataTable<EmployeeRecord>
        // Datos y estructura
        columns={columns}
        data={employees}
        keyField="id"
        size="md"
        rowHeight="md"

        // Loading
        loading={loading}
        emptyMessage="No hay empleados registrados"

        // Paginación
        pagination={{
          page,
          pageSize,
          total: employees.length,
          onPageChange: setPage,
          onPageSizeChange: (newSize) => {
            setPageSize(newSize)
            setPage(1) // Reset a primera página
          },
        }}
        showPagination={true}

        // Búsqueda
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Buscar por nombre, email o teléfono..."

        // Filtros
        filters={filters}
        activeFilters={activeFilters}
        onFiltersChange={setActiveFilters}

        // Sorting
        sort={sort}
        onSortChange={setSort}

        // Row actions
        rowActions={rowActions}

        // Row selection
        selectable={true}
        selectedRows={selectedRows as Array<EmployeeRecord[keyof EmployeeRecord]>}
        onSelectedRowsChange={(rows) => {
          setSelectedRows(rows as string[])
        }}

        // Column visibility
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns}

        // Apariencia
        striped={true}
        hoverable={true}
        showToolbar={true}
      />
    </div>
  )
}

/**
 * ============================================================================
 * CÓMO USAR EN UNA PÁGINA
 * ============================================================================
 *
 * export default function EmployeesPage() {
 *   const { employees, loading, deleteEmployee, updateEmployee } = useEmployees()
 *   const router = useRouter()
 *
 *   return (
 *     <div className="space-y-6">
 *       <SectionHeader title="Empleados" />
 *
 *       <EmployeesTable
 *         employees={employees}
 *         loading={loading}
 *         onView={(emp) => router.push(`/employees/${emp.id}`)}
 *         onEdit={(emp) => router.push(`/employees/${emp.id}/edit`)}
 *         onDelete={(emp) => deleteEmployee(String(emp.id))}
 *         onBulkDelete={(ids) => {
 *           ids.forEach(id => deleteEmployee(id))
 *         }}
 *       />
 *     </div>
 *   )
 * }
 *
 * ============================================================================
 */
