/**
 * DATA TABLE ENTERPRISE - GUÍA DE USO
 *
 * Componente reutilizable tipo Notion/Linear/Airtable/Clerk Admin
 *
 * ============================================================================
 * CARACTERÍSTICAS
 * ============================================================================
 *
 * ✅ Sorting multi-columna
 * ✅ Paginación completa (first, prev, next, last + page size)
 * ✅ Búsqueda global en tiempo real
 * ✅ Filtros avanzados (texto, select, multi-select, date ranges)
 * ✅ Visibilidad de columnas (mostrar/ocultar dinámicamente)
 * ✅ Row actions (dropdown de acciones por fila)
 * ✅ Row selection (checkboxes + select all)
 * ✅ Expandable rows (ver detalles sin navegar)
 * ✅ Skeleton loading (shimmer animado)
 * ✅ Empty states (UI minimalista cuando sin datos)
 * ✅ Responsive (scroll horizontal en móviles)
 * ✅ Sticky headers (encabezados fijos al scroll)
 * ✅ Minimalista + mucho spacing (diseño limpio)
 * ✅ Hover states suaves (transiciones)
 * ✅ Badges modernas (color, background, variants)
 * ✅ Typography limpia (Font weights, sizes, colors)
 * ✅ TypeScript strict (Fully typed)
 *
 * ============================================================================
 * ESTRUCTURA DE CARPETAS
 * ============================================================================
 *
 * src/components/ui/data-table/
 * ├── index.ts                  ← Barrel export (importar de aquí)
 * ├── types.ts                  ← Tipos reutilizables
 * ├── DataTable.tsx             ← Componente principal
 * ├── TableToolbar.tsx          ← Búsqueda, filtros, column visibility
 * ├── TablePagination.tsx       ← Controles de paginación
 * ├── TableEmptyState.tsx       ← Estado vacío
 * ├── TableSkeleton.tsx         ← Skeleton loading
 * └── USE_DATA_TABLE.md         ← Esta guía
 *
 * ============================================================================
 * EJEMPLO BÁSICO
 * ============================================================================
 *
 * 'use client'
 *
 * import { DataTable, type DataTableColumn } from '@/components/ui/data-table'
 * import { useEmployees } from '@/hooks'
 * import type { EmployeeRecord } from '@/types'
 *
 * export default function EmployeesPage() {
 *   const { employees, loading } = useEmployees()
 *
 *   const columns: DataTableColumn<EmployeeRecord>[] = [
 *     {
 *       id: 'name',
 *       label: 'Nombre',
 *       accessor: 'fullName',
 *       sortable: true,
 *       filterable: true,
 *     },
 *     {
 *       id: 'email',
 *       label: 'Email',
 *       accessor: 'email',
 *       sortable: true,
 *     },
 *     {
 *       id: 'role',
 *       label: 'Rol',
 *       accessor: 'role',
 *       sortable: true,
 *       render: (value) => (
 *         <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
 *           {value}
 *         </span>
 *       ),
 *     },
 *   ]
 *
 *   return (
 *     <DataTable
 *       columns={columns}
 *       data={employees}
 *       keyField="id"
 *       loading={loading}
 *     />
 *   )
 * }
 *
 * ============================================================================
 * EJEMPLO CON TODAS LAS FEATURES
 * ============================================================================
 *
 * 'use client'
 *
 * import { useState } from 'react'
 * import {
 *   DataTable,
 *   type DataTableColumn,
 *   type DataTableFilter,
 *   type RowAction,
 * } from '@/components/ui/data-table'
 * import { useEmployees } from '@/hooks'
 * import type { EmployeeRecord } from '@/types'
 * import { EditIcon, Trash2Icon, EyeIcon } from 'lucide-react'
 *
 * export default function EmployeesPage() {
 *   const { employees, loading, deleteEmployee } = useEmployees()
 *   const [page, setPage] = useState(1)
 *   const [pageSize, setPageSize] = useState(10)
 *   const [searchValue, setSearchValue] = useState('')
 *   const [activeFilters, setActiveFilters] = useState({})
 *   const [sort, setSort] = useState([])
 *   const [selectedRows, setSelectedRows] = useState([])
 *   const [visibleColumns, setVisibleColumns] = useState([
 *     'name',
 *     'email',
 *     'role',
 *     'status',
 *   ])
 *   const [expandedRows, setExpandedRows] = useState([])
 *
 *   // Definición de columnas
 *   const columns: DataTableColumn<EmployeeRecord>[] = [
 *     {
 *       id: 'name',
 *       label: 'Nombre',
 *       accessor: 'fullName',
 *       sortable: true,
 *       filterable: true,
 *       hideable: true,
 *     },
 *     {
 *       id: 'email',
 *       label: 'Email',
 *       accessor: 'email',
 *       sortable: true,
 *       filterable: true,
 *       hideable: true,
 *     },
 *     {
 *       id: 'role',
 *       label: 'Rol',
 *       accessor: 'role',
 *       sortable: true,
 *       filterable: true,
 *       hideable: true,
 *       render: (value) => (
 *         <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
 *           {value}
 *         </span>
 *       ),
 *     },
 *     {
 *       id: 'status',
 *       label: 'Estado',
 *       accessor: 'status',
 *       sortable: true,
 *       filterable: true,
 *       hideable: true,
 *       render: (value) => {
 *         const colors: Record<string, string> = {
 *           ACTIVE: 'bg-green-50 text-green-700',
 *           INACTIVE: 'bg-yellow-50 text-yellow-700',
 *           TERMINATED: 'bg-red-50 text-red-700',
 *         }
 *         return (
 *           <span
 *             className={`px-3 py-1 rounded-full text-sm font-medium ${
 *               colors[String(value)] || 'bg-gray-50 text-gray-700'
 *             }`}
 *           >
 *             {value}
 *           </span>
 *         )
 *       },
 *     },
 *     {
 *       id: 'department',
 *       label: 'Departamento',
 *       accessor: 'department',
 *       sortable: true,
 *       filterable: true,
 *       hideable: true,
 *     },
 *     {
 *       id: 'joinDate',
 *       label: 'Fecha de Ingreso',
 *       accessor: 'joinDate',
 *       sortable: true,
 *       hideable: true,
 *       render: (value) => new Date(String(value)).toLocaleDateString('es-ES'),
 *     },
 *   ]
 *
 *   // Filtros disponibles
 *   const filters: DataTableFilter[] = [
 *     {
 *       id: 'role',
 *       label: 'Rol',
 *       type: 'select',
 *       options: [
 *         { label: 'Admin', value: 'ADMIN' },
 *         { label: 'Manager', value: 'MANAGER' },
 *         { label: 'Usuario', value: 'USER' },
 *       ],
 *     },
 *     {
 *       id: 'status',
 *       label: 'Estado',
 *       type: 'select',
 *       options: [
 *         { label: 'Activo', value: 'ACTIVE' },
 *         { label: 'Inactivo', value: 'INACTIVE' },
 *         { label: 'Terminado', value: 'TERMINATED' },
 *       ],
 *     },
 *     {
 *       id: 'department',
 *       label: 'Departamento',
 *       type: 'multi-select',
 *       options: [
 *         { label: 'Ventas', value: 'SALES' },
 *         { label: 'IT', value: 'IT' },
 *         { label: 'HR', value: 'HR' },
 *       ],
 *     },
 *   ]
 *
 *   // Acciones de fila
 *   const rowActions: RowAction<EmployeeRecord>[] = [
 *     {
 *       id: 'view',
 *       label: 'Ver detalles',
 *       icon: <EyeIcon className="w-4 h-4" />,
 *       onClick: (row) => {
 *         window.location.href = `/employees/${row.id}`
 *       },
 *     },
 *     {
 *       id: 'edit',
 *       label: 'Editar',
 *       icon: <EditIcon className="w-4 h-4" />,
 *       onClick: (row) => {
 *         window.location.href = `/employees/${row.id}/edit`
 *       },
 *     },
 *     {
 *       id: 'delete',
 *       label: 'Eliminar',
 *       icon: <Trash2Icon className="w-4 h-4" />,
 *       variant: 'danger',
 *       onClick: (row) => {
 *         if (confirm('¿Estás seguro?')) {
 *           deleteEmployee(String(row.id))
 *         }
 *       },
 *       disabled: (row) => row.status === 'TERMINATED',
 *       divider: true,
 *     },
 *   ]
 *
 *   return (
 *     <DataTable
 *       // Datos y estructura
 *       columns={columns}
 *       data={employees}
 *       keyField="id"
 *
 *       // Loading
 *       loading={loading}
 *       emptyMessage="No hay empleados"
 *
 *       // Paginación
 *       pagination={{
 *         page,
 *         pageSize,
 *         total: employees.length,
 *         onPageChange: setPage,
 *         onPageSizeChange: setPageSize,
 *       }}
 *       showPagination={true}
 *
 *       // Búsqueda
 *       searchValue={searchValue}
 *       onSearchChange={setSearchValue}
 *       searchPlaceholder="Buscar por nombre, email..."
 *
 *       // Filtros
 *       filters={filters}
 *       activeFilters={activeFilters}
 *       onFiltersChange={setActiveFilters}
 *
 *       // Sorting
 *       sort={sort}
 *       onSortChange={setSort}
 *
 *       // Row actions
 *       rowActions={rowActions}
 *
 *       // Row selection
 *       selectable={true}
 *       selectedRows={selectedRows}
 *       onSelectedRowsChange={setSelectedRows}
 *
 *       // Column visibility
 *       visibleColumns={visibleColumns}
 *       onVisibleColumnsChange={setVisibleColumns}
 *
 *       // Expanded rows
 *       expandable={true}
 *       expandedRows={expandedRows}
 *       onExpandedRowsChange={setExpandedRows}
 *       expandedRowRender={(row) => (
 *         <div className="space-y-2">
 *           <p className="text-sm"><strong>Teléfono:</strong> {row.phone}</p>
 *           <p className="text-sm"><strong>Ubicación:</strong> {row.location}</p>
 *           <p className="text-sm"><strong>Reporta a:</strong> {row.managerName}</p>
 *         </div>
 *       )}
 *
 *       // Tamaño y apariencia
 *       size="md"
 *       rowHeight="md"
 *       striped={true}
 *       hoverable={true}
 *       showToolbar={true}
 *     />
 *   )
 * }
 *
 * ============================================================================
 * TIPOS PRINCIPALES
 * ============================================================================
 *
 * DataTableColumn<T>
 * ├── id: string                          ← ID único de columna
 * ├── label: string                       ← Etiqueta visible
 * ├── accessor?: keyof T | (row: T) => unknown
 * ├── render?: (value, row, index) => ReactNode
 * ├── width?: string                      ← '20%' o '200px'
 * ├── sortable?: boolean                  ← Permite click para sort
 * ├── filterable?: boolean                ← Aparece en filtros
 * ├── hideable?: boolean                  ← Puede ocultarse
 * ├── align?: 'left' | 'center' | 'right'
 * ├── className?: string                  ← Custom CSS
 * └── headerClassName?: string            ← Custom CSS header
 *
 * DataTableFilter
 * ├── id: string
 * ├── label: string
 * ├── type: 'text' | 'select' | 'multi-select' | 'date' | 'date-range'
 * ├── options?: { label, value }[]
 * └── value?: string | string[] | [string, string]
 *
 * DataTableSort
 * ├── id: string                          ← Column ID
 * └── desc: boolean                       ← true = descending
 *
 * RowAction<T>
 * ├── id: string
 * ├── label: string
 * ├── icon?: ReactNode
 * ├── onClick: (row: T) => void | Promise<void>
 * ├── variant?: 'default' | 'danger' | 'success'
 * ├── disabled?: (row: T) => boolean
 * └── divider?: boolean                   ← Agregar separador antes
 *
 * ============================================================================
 * CASOS DE USO
 * ============================================================================
 *
 * 1. LISTA SIMPLE DE EMPLEADOS
 *    └── Columnas básicas + sorting + paginación
 *
 * 2. TABLA CON FILTROS AVANZADOS
 *    └── Múltiples filtros por rol, estado, departamento
 *
 * 3. GESTIÓN CON ROW ACTIONS
 *    └── Editar, eliminar, cambiar estado desde dropdown
 *
 * 4. SELECCIÓN MASIVA
 *    └── Checkboxes para batch operations
 *
 * 5. EXPANDABLE ROWS
 *    └── Ver detalles sin navegar a otra página
 *
 * 6. TABLA DASHBOARD
 *    └── Datos en tiempo real + visibilidad columnas + column hide
 *
 * ============================================================================
 * ESTILOS
 * ============================================================================
 *
 * COLORES:
 * - Border: border-gray-200/50, border-gray-100
 * - Background: bg-white, bg-gray-50/30, bg-gray-50/40
 * - Hover: hover:bg-gray-50, hover:bg-blue-50/40
 * - Text: text-gray-700, text-gray-600, text-gray-400
 *
 * ESPACIADO:
 * - Header/Footer: px-6 py-4
 * - Celdas: px-6 py-3 (md), py-2 (sm), py-4 (lg)
 * - Entre elementos: gap-3, gap-4
 *
 * ROUNDED:
 * - Tabla: rounded-xl
 * - Botones: rounded-lg
 *
 * TRANSICIONES:
 * - transition-colors
 * - transition-opacity
 *
 * ============================================================================
 * PERFORMANCE
 * ============================================================================
 *
 * ✅ Rendering optimizado: useMemo para búsqueda, filtros, sort, paginación
 * ✅ Callbacks memoizados: useCallback para evitar re-renders innecesarios
 * ✅ Lazy menús: Dropdowns y modales se abren bajo demanda
 * ✅ Virtualized si necesario: Agregar react-window para 1000+ filas
 *
 * ============================================================================
 * INTEGRACIÓN CON HOOKS
 * ============================================================================
 *
 * El DataTable es agnóstico a cómo obtienes los datos.
 * Funciona perfectamente con los hooks enterprise:
 *
 * - useEmployees() → employees, loading, error
 * - usePermissions() → permissions, loading, error
 * - useNotifications() → notifications, loading, error
 *
 * El hook maneja:
 * ├── Estado (employees, permissions, etc)
 * ├── Loading y error
 * ├── CRUD básico (create, update, delete)
 *
 * La tabla maneja:
 * ├── Presentación
 * ├── Búsqueda, filtros, sort, paginación
 * ├── Selección y expansión
 * └── Acciones de usuario
 *
 * ============================================================================
 * PRÓXIMOS PASOS
 * ============================================================================
 *
 * 1. Reemplazar DataTable antigua en src/components/ui/DataTable.tsx
 * 2. Migrar tablas existentes a usar el DataTable enterprise
 * 3. Agregar más filtros (date range, numeric ranges, etc)
 * 4. Agregar export a CSV/Excel
 * 5. Agregar virtualization para grandes datasets (react-window)
 * 6. Agregar dark mode support
 * 7. Agregar drag-and-drop para reordenar columnas
 *
 */
