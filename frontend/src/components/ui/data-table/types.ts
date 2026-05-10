/**
 * TIPOS PARA DATA TABLE ENTERPRISE
 */

import type { ReactNode } from 'react'

/**
 * Configuración de una columna en la tabla
 */
export interface DataTableColumn<T> {
  /** ID único de la columna */
  id: string
  /** Etiqueta visible en el header */
  label: string
  /** Campo de datos que renderiza */
  accessor?: keyof T | ((row: T) => unknown)
  /** Función de renderizado custom */
  render?: (value: unknown, row: T, index: number) => ReactNode
  /** Ancho de la columna (ej: '20%', '200px') */
  width?: string
  /** Permite sorting en esta columna */
  sortable?: boolean
  /** Permite filtrar esta columna */
  filterable?: boolean
  /** Puede ocultarse */
  hideable?: boolean
  /** Alineación del texto */
  align?: 'left' | 'center' | 'right'
  /** Classes CSS personalizadas */
  className?: string
  /** Header classes personalizadas */
  headerClassName?: string
}

/**
 * Configuración de un filtro
 */
export interface DataTableFilter {
  id: string
  label: string
  type: 'text' | 'select' | 'multi-select' | 'date' | 'date-range'
  options?: Array<{ label: string; value: string }>
  value?: string | string[] | [string, string]
}

/**
 * Configuración de sorting
 */
export interface DataTableSort {
  id: string
  desc: boolean
}

/**
 * Acción disponible en una fila
 */
export interface RowAction<T> {
  id: string
  label: string
  icon?: ReactNode
  onClick: (row: T) => void | Promise<void>
  variant?: 'default' | 'danger' | 'success'
  disabled?: (row: T) => boolean
  divider?: boolean
}

/**
 * Props del componente DataTable principal
 */
export interface DataTableProps<T extends Record<string, any> = Record<string, any>> {
  /** Definición de columnas */
  columns: DataTableColumn<T>[]
  /** Datos a mostrar */
  data: T[]
  /** Campo que actúa como clave única */
  keyField: keyof T
  /** Estado de carga */
  loading?: boolean
  /** Texto cuando no hay datos */
  emptyMessage?: string
  /** Ícono para el estado vacío */
  emptyIcon?: ReactNode
  /** Configuración de paginación */
  pagination?: {
    page: number
    pageSize: number
    total: number
    onPageChange?: (page: number) => void
    onPageSizeChange?: (pageSize: number) => void
  }
  /** Filtros disponibles */
  filters?: DataTableFilter[]
  /** Filtros activos */
  activeFilters?: Record<string, string | string[]>
  /** Callback cuando cambian los filtros */
  onFiltersChange?: (filters: Record<string, string | string[]>) => void
  /** Búsqueda global */
  searchValue?: string
  /** Callback de búsqueda */
  onSearchChange?: (value: string) => void
  /** Placeholder del search */
  searchPlaceholder?: string
  /** Sorting */
  sort?: DataTableSort[]
  /** Callback de sorting */
  onSortChange?: (sort: DataTableSort[]) => void
  /** Acciones de fila */
  rowActions?: RowAction<T>[]
  /** Permite seleccionar filas */
  selectable?: boolean
  /** Filas seleccionadas */
  selectedRows?: Array<T[keyof T]>
  /** Callback de selección */
  onSelectedRowsChange?: (rows: Array<T[keyof T]>) => void
  /** Permite seleccionar todas */
  selectAll?: boolean
  /** Callback de seleccionar todas */
  onSelectAllChange?: (selected: boolean) => void
  /** Columnas visibles (IDs) */
  visibleColumns?: string[]
  /** Callback de visibilidad */
  onVisibleColumnsChange?: (columns: string[]) => void
  /** Altura mínima de filas */
  rowHeight?: 'sm' | 'md' | 'lg'
  /** Permitir expansión de filas */
  expandable?: boolean
  /** Renderer para fila expandida */
  expandedRowRender?: (row: T) => ReactNode
  /** Filas expandidas */
  expandedRows?: Array<T[keyof T]>
  /** Callback de expansión */
  onExpandedRowsChange?: (rows: Array<T[keyof T]>) => void
  /** Tamaño de la tabla */
  size?: 'sm' | 'md' | 'lg'
  /** Mostrar barra de herramientas */
  showToolbar?: boolean
  /** Mostrar paginación */
  showPagination?: boolean
  /** Stripeds rows */
  striped?: boolean
  /** Hover effect */
  hoverable?: boolean
  /** Classes CSS personalizadas */
  containerClassName?: string
  /** Classes de la tabla */
  tableClassName?: string
}

/**
 * Props del componente TableToolbar
 */
export interface TableToolbarProps<T extends Record<string, any> = Record<string, any>> {
  columns: DataTableColumn<T>[]
  filters?: DataTableFilter[]
  activeFilters?: Record<string, string | string[]>
  searchValue?: string
  visibleColumns?: string[]
  onSearchChange?: (value: string) => void
  onFiltersChange?: (filters: Record<string, string | string[]>) => void
  onVisibleColumnsChange?: (columns: string[]) => void
  searchPlaceholder?: string
}

/**
 * Props del componente TablePagination
 */
export interface TablePaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  pageSizeOptions?: number[]
}

/**
 * Props del componente TableEmptyState
 */
export interface TableEmptyStateProps {
  message?: string
  icon?: ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Props del componente TableSkeleton
 */
export interface TableSkeletonProps {
  columns: number
  rows?: number
  showPagination?: boolean
}
