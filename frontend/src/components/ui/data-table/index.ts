/**
 * DATA TABLE ENTERPRISE - Barrel Export
 *
 * Componente reutilizable tipo Notion/Linear/Airtable/Clerk
 *
 * FEATURES:
 * - Sorting multi-columna
 * - Paginación
 * - Búsqueda global
 * - Filtros avanzados
 * - Visibilidad de columnas
 * - Row actions dropdown
 * - Row selection checkboxes
 * - Expandable rows
 * - Skeleton loading
 * - Empty states
 * - Responsive design
 * - Sticky headers
 * - Minimalista + mucho spacing
 * - Hover states suaves
 * - Badges modernas
 * - Typography limpia
 */

export { DataTable } from './DataTable'
export { TableToolbar } from './TableToolbar'
export { TablePagination } from './TablePagination'
export { TableEmptyState } from './TableEmptyState'
export { TableSkeleton } from './TableSkeleton'

export type {
  DataTableProps,
  DataTableColumn,
  DataTableFilter,
  DataTableSort,
  RowAction,
  TableToolbarProps,
  TablePaginationProps,
  TableEmptyStateProps,
  TableSkeletonProps,
} from './types'
