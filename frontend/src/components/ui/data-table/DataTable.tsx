'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MoreHorizontalIcon,
  CheckIcon,
} from 'lucide-react'
import type { DataTableProps, DataTableSort, RowAction } from './types'
import { TableToolbar } from './TableToolbar'
import { TablePagination } from './TablePagination'
import { TableSkeleton } from './TableSkeleton'
import { TableEmptyState } from './TableEmptyState'

/**
 * DataTable Enterprise - Componente principal reutilizable
 *
 * Características:
 * - Sorting multi-columna
 * - Paginación
 * - Búsqueda global
 * - Filtros avanzados
 * - Visibilidad de columnas
 * - Row actions
 * - Row selection
 * - Responsive
 * - Sticky headers
 * - Estados de carga
 */
export function DataTable<T extends Record<string, any> = Record<string, any>>({
  columns,
  data,
  keyField,
  loading = false,
  emptyMessage,
  emptyIcon,
  pagination,
  filters,
  activeFilters = {},
  onFiltersChange,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Buscar en tabla...',
  sort = [],
  onSortChange,
  rowActions,
  selectable = false,
  selectedRows = [],
  onSelectedRowsChange,
  selectAll = false,
  onSelectAllChange,
  visibleColumns,
  onVisibleColumnsChange,
  rowHeight = 'md',
  expandable = false,
  expandedRowRender,
  expandedRows = [],
  onExpandedRowsChange,
  size = 'md',
  showToolbar = true,
  showPagination = true,
  striped = true,
  hoverable = true,
  containerClassName = '',
  tableClassName = '',
}: DataTableProps<T>) {
  const [openActionsMenu, setOpenActionsMenu] = useState<unknown>(null)
  const [openRowActionsId, setOpenRowActionsId] = useState<unknown>(null)

  // Columnas visibles
  const visibleColumnList = useMemo(() => {
    if (!visibleColumns) return columns
    return columns.filter((c) => visibleColumns.includes(c.id))
  }, [columns, visibleColumns])

  // Aplicar búsqueda
  const searchedData = useMemo(() => {
    if (!searchValue.trim()) return data

    const query = searchValue.toLowerCase()
    return data.filter((row) =>
      visibleColumnList.some((col) => {
        let value: unknown
        if (col.accessor && typeof col.accessor === 'function') {
          value = col.accessor(row)
        } else if (col.accessor) {
          value = row[col.accessor]
        } else {
          return false
        }
        return String(value || '').toLowerCase().includes(query)
      })
    )
  }, [data, searchValue, visibleColumnList])

  // Aplicar filtros
  const filteredData = useMemo(() => {
    if (!activeFilters || Object.keys(activeFilters).length === 0) {
      return searchedData
    }

    return searchedData.filter((row) => {
      return filters?.every((filter) => {
        const filterValue = activeFilters[filter.id]
        if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) {
          return true
        }

        const rowValue = row[filter.id as keyof T]
        if (Array.isArray(filterValue)) {
          return filterValue.includes(String(rowValue))
        }
        return String(rowValue) === String(filterValue)
      })
    })
  }, [searchedData, activeFilters, filters])

  // Aplicar sorting
  const sortedData = useMemo(() => {
    if (!sort || sort.length === 0) return filteredData

    let sorted = [...filteredData]
    sort.forEach((s) => {
      sorted.sort((a, b) => {
        const col = columns.find((c) => c.id === s.id)
        if (!col) return 0

        let aVal: unknown
        let bVal: unknown

        if (col.accessor && typeof col.accessor === 'function') {
          aVal = col.accessor(a)
          bVal = col.accessor(b)
        } else if (col.accessor) {
          aVal = a[col.accessor]
          bVal = b[col.accessor]
        }

        if (aVal === null || aVal === undefined) return 1
        if (bVal === null || bVal === undefined) return -1

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return s.desc
            ? bVal.localeCompare(aVal)
            : aVal.localeCompare(bVal)
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return s.desc ? bVal - aVal : aVal - bVal
        }

        return 0
      })
    })
    return sorted
  }, [filteredData, sort, columns])

  // Aplicar paginación
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData

    const start = (pagination.page - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    return sortedData.slice(start, end)
  }, [sortedData, pagination])

  // Handlers
  const handleToggleSort = useCallback(
    (columnId: string) => {
      if (!onSortChange) return

      const existingSort = sort.find((s) => s.id === columnId)

      if (!existingSort) {
        // Agregar nuevo sort
        onSortChange([{ id: columnId, desc: false }])
      } else if (!existingSort.desc) {
        // Cambiar a descending
        onSortChange(sort.map((s) =>
          s.id === columnId ? { ...s, desc: true } : s
        ))
      } else {
        // Remover sort
        onSortChange(sort.filter((s) => s.id !== columnId))
      }
    },
    [sort, onSortChange]
  )

  const handleToggleRow = useCallback(
    (rowKey: unknown) => {
      if (!onSelectedRowsChange) return

      const key = rowKey as T[keyof T]
      const newSelected = selectedRows.includes(key)
        ? selectedRows.filter((k) => k !== key)
        : [...selectedRows, key]

      onSelectedRowsChange(newSelected)
    },
    [selectedRows, onSelectedRowsChange]
  )

  const handleToggleSelectAll = useCallback(
    (checked: boolean) => {
      if (!onSelectAllChange || !onSelectedRowsChange) return

      if (checked) {
        const allRowKeys = paginatedData.map((row) => row[keyField])
        onSelectedRowsChange(allRowKeys)
      } else {
        onSelectedRowsChange([])
      }

      onSelectAllChange(checked)
    },
    [paginatedData, keyField, onSelectAllChange, onSelectedRowsChange]
  )

  const handleToggleExpanded = useCallback(
    (rowKey: unknown) => {
      if (!onExpandedRowsChange) return

      const key = rowKey as T[keyof T]
      const newExpanded = expandedRows.includes(key)
        ? expandedRows.filter((k) => k !== key)
        : [...expandedRows, key]

      onExpandedRowsChange(newExpanded)
    },
    [expandedRows, onExpandedRowsChange]
  )

  // Getters de size
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs'
      case 'lg':
        return 'text-base'
      default:
        return 'text-sm'
    }
  }

  const getRowHeightClasses = () => {
    switch (rowHeight) {
      case 'sm':
        return 'py-2'
      case 'lg':
        return 'py-4'
      default:
        return 'py-3'
    }
  }

  // Estados vacíos
  if (loading && data.length === 0) {
    return (
      <TableSkeleton
        columns={visibleColumnList.length + (selectable ? 1 : 0)}
        rows={pagination?.pageSize || 5}
        showPagination={showPagination}
      />
    )
  }

  return (
    <div className={`space-y-4 ${containerClassName}`}>
      {/* Toolbar */}
      {showToolbar && (
        <TableToolbar
          columns={columns}
          filters={filters}
          activeFilters={activeFilters}
          searchValue={searchValue}
          visibleColumns={visibleColumns}
          onSearchChange={onSearchChange}
          onFiltersChange={onFiltersChange}
          onVisibleColumnsChange={onVisibleColumnsChange}
          searchPlaceholder={searchPlaceholder}
        />
      )}

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-gray-200/50 bg-white shadow-sm">
        <table className={`w-full ${getSizeClasses()} ${tableClassName}`}>
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/40">
              {/* Checkbox de selección */}
              {selectable && (
                <th className="px-6 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                    onChange={(e) => handleToggleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border border-gray-300 cursor-pointer"
                  />
                </th>
              )}

              {/* Columnas */}
              {visibleColumnList.map((column) => (
                <th
                  key={column.id}
                  className={`px-6 py-3 text-left font-semibold text-gray-600 ${
                    column.headerClassName || ''
                  } ${column.sortable ? 'cursor-pointer select-none hover:bg-gray-100/50' : ''}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleToggleSort(column.id)}
                >
                  <div className="flex items-center gap-2 group">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                        {sort.find((s) => s.id === column.id) ? (
                          sort.find((s) => s.id === column.id)?.desc ? (
                            <ChevronDownIcon className="w-4 h-4 text-blue-600" />
                          ) : (
                            <ChevronUpIcon className="w-4 h-4 text-blue-600" />
                          )
                        ) : (
                          <div className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}

              {/* Columna de acciones */}
              {rowActions && rowActions.length > 0 && (
                <th className="px-6 py-3 w-12 text-center">
                  <span className="text-gray-600 font-semibold">Acciones</span>
                </th>
              )}

              {/* Columna de expansión */}
              {expandable && (
                <th className="px-6 py-3 w-12" />
              )}
            </tr>
          </thead>

          <tbody className={`divide-y divide-gray-50 ${striped ? 'bg-white' : ''}`}>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    visibleColumnList.length +
                    (selectable ? 1 : 0) +
                    (rowActions?.length ? 1 : 0) +
                    (expandable ? 1 : 0)
                  }
                  className="px-6 py-12"
                >
                  <TableEmptyState
                    message={emptyMessage}
                    icon={emptyIcon}
                  />
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const rowKey = row[keyField]
                const isSelected = selectedRows.includes(rowKey)
                const isExpanded = expandedRows.includes(rowKey)

                return (
                  <tbody key={String(rowKey)}>
                    <tr
                      className={`
                        transition-colors
                        ${striped && rowIndex % 2 === 1 ? 'bg-gray-50/30' : ''}
                        ${hoverable ? 'hover:bg-blue-50/40' : ''}
                        ${isSelected ? 'bg-blue-50/60' : ''}
                      `}
                    >
                      {/* Checkbox de selección */}
                      {selectable && (
                        <td className="px-6 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleRow(rowKey)}
                            className="w-4 h-4 rounded border border-gray-300 cursor-pointer"
                          />
                        </td>
                      )}

                      {/* Celdas de datos */}
                      {visibleColumnList.map((column) => {
                        let cellValue: unknown

                        if (column.accessor && typeof column.accessor === 'function') {
                          cellValue = column.accessor(row)
                        } else if (column.accessor) {
                          cellValue = row[column.accessor]
                        }

                        const rendered = (column.render
                          ? column.render(cellValue, row, rowIndex)
                          : cellValue) as React.ReactNode

                        return (
                          <td
                            key={column.id}
                            className={`px-6 ${getRowHeightClasses()} text-gray-700 ${
                              column.className || ''
                            }`}
                            style={{ width: column.width }}
                          >
                            <div className="flex items-center gap-2">
                              {rendered}
                            </div>
                          </td>
                        )
                      })}

                      {/* Acciones */}
                      {rowActions && rowActions.length > 0 && (
                        <td className="px-6 py-3 text-center">
                          <div className="relative">
                            <button
                              onClick={() =>
                                setOpenRowActionsId(
                                  openRowActionsId === rowKey ? null : rowKey
                                )
                              }
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <MoreHorizontalIcon className="w-4 h-4 text-gray-500" />
                            </button>

                            {openRowActionsId === rowKey && (
                              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                {rowActions.map((action, idx) => (
                                  <div key={action.id}>
                                    {action.divider && idx > 0 && (
                                      <div className="border-t border-gray-100" />
                                    )}
                                    <button
                                      onClick={() => {
                                        action.onClick(row)
                                        setOpenRowActionsId(null)
                                      }}
                                      disabled={action.disabled?.(row)}
                                      className={`
                                        w-full px-4 py-2.5 text-sm text-left font-medium transition-colors
                                        ${action.disabled?.(row)
                                          ? 'opacity-50 cursor-not-allowed'
                                          : action.variant === 'danger'
                                          ? 'text-red-600 hover:bg-red-50'
                                          : action.variant === 'success'
                                          ? 'text-green-600 hover:bg-green-50'
                                          : 'text-gray-700 hover:bg-gray-50'
                                        }
                                      `}
                                    >
                                      <div className="flex items-center gap-2">
                                        {action.icon}
                                        <span>{action.label}</span>
                                      </div>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      )}

                      {/* Botón de expansión */}
                      {expandable && (
                        <td className="px-6 py-3">
                          <button
                            onClick={() => handleToggleExpanded(rowKey)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUpIcon className="w-4 h-4 text-gray-600" />
                            ) : (
                              <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                        </td>
                      )}
                    </tr>

                    {/* Fila expandida */}
                    {expandable && isExpanded && expandedRowRender && (
                      <tr className="bg-gray-50/40">
                        <td
                          colSpan={
                            visibleColumnList.length +
                            (selectable ? 1 : 0) +
                            (rowActions?.length ? 1 : 0) +
                            1
                          }
                          className="px-6 py-4"
                        >
                          {expandedRowRender(row)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {showPagination && pagination && (
        <TablePagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
        />
      )}
    </div>
  )
}
