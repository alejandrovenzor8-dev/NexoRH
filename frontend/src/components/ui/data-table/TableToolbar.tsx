'use client'

import { useState } from 'react'
import {
  SearchIcon,
  SlidersHorizontalIcon,
  EyeIcon,
  EyeOffIcon,
  XIcon,
} from 'lucide-react'
import type { DataTableColumn, TableToolbarProps } from './types'

/**
 * Barra de herramientas para tabla
 * Incluye búsqueda, filtros y visibilidad de columnas
 */
export function TableToolbar<T extends Record<string, any> = Record<string, any>>({
  columns,
  filters = [],
  activeFilters = {},
  searchValue = '',
  visibleColumns,
  onSearchChange,
  onFiltersChange,
  onVisibleColumnsChange,
  searchPlaceholder = 'Buscar...',
}: TableToolbarProps<T>) {
  const [showFilters, setShowFilters] = useState(false)
  const [showColumnMenu, setShowColumnMenu] = useState(false)
  const activeFilterCount = Object.values(activeFilters).filter(
    (v) => v && (Array.isArray(v) ? v.length > 0 : v !== '')
  ).length

  const visibleColumnIds = visibleColumns || columns.map((c) => c.id)
  const hiddenColumnsCount = columns.filter(
    (c) => c.hideable && !visibleColumnIds.includes(c.id)
  ).length

  const handleClearSearch = () => {
    onSearchChange?.('')
  }

  const handleToggleColumn = (columnId: string) => {
    const newVisible = visibleColumnIds.includes(columnId)
      ? visibleColumnIds.filter((id) => id !== columnId)
      : [...visibleColumnIds, columnId]
    onVisibleColumnsChange?.(newVisible)
  }

  return (
    <div className="space-y-4 px-6 py-4 border-b border-gray-100 bg-gray-50/30">
      {/* Búsqueda y Filtros */}
      <div className="flex items-center gap-3">
        {/* Barra de búsqueda */}
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 placeholder-gray-400 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
          {searchValue && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <XIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Botón de filtros */}
        {filters.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-2.5 text-sm font-medium flex items-center gap-2 border rounded-lg transition-colors ${
              showFilters || activeFilterCount > 0
                ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <SlidersHorizontalIcon className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-blue-600 text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        )}

        {/* Botón de columnas */}
        <div className="relative">
          <button
            onClick={() => setShowColumnMenu(!showColumnMenu)}
            className={`px-3 py-2.5 text-sm font-medium flex items-center gap-2 border rounded-lg transition-colors ${
              hiddenColumnsCount > 0
                ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <EyeIcon className="w-4 h-4" />
            {hiddenColumnsCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-amber-600 text-white">
                {hiddenColumnsCount}
              </span>
            )}
          </button>

          {/* Menú de columnas */}
          {showColumnMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
                {columns
                  .filter((c) => c.hideable !== false)
                  .map((column) => {
                    const isVisible = visibleColumnIds.includes(column.id)
                    return (
                      <button
                        key={column.id}
                        onClick={() => handleToggleColumn(column.id)}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-left"
                      >
                        {isVisible ? (
                          <EyeIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        ) : (
                          <EyeOffIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                        <span className={isVisible ? 'font-medium' : ''}>
                          {column.label}
                        </span>
                      </button>
                    )
                  })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Panel de filtros */}
      {showFilters && filters.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-2 border-t border-gray-200">
          {filters.map((filter) => {
            const value = activeFilters[filter.id]
            const isActive = value && (Array.isArray(value) ? value.length > 0 : value !== '')

            if (filter.type === 'select' || filter.type === 'multi-select') {
              return (
                <div key={filter.id} className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    {filter.label}:
                  </label>
                  <select
                    multiple={filter.type === 'multi-select'}
                    value={Array.isArray(value) ? value : value ? [String(value)] : []}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions).map(
                        (opt) => opt.value
                      )
                      if (filter.type === 'select') {
                        onFiltersChange?.({
                          ...activeFilters,
                          [filter.id]: selected[0] || '',
                        })
                      } else {
                        onFiltersChange?.({
                          ...activeFilters,
                          [filter.id]: selected,
                        })
                      }
                    }}
                    className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Todos</option>
                    {filter.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )
            }

            if (filter.type === 'text') {
              return (
                <div key={filter.id} className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-600">
                    {filter.label}:
                  </label>
                  <input
                    type="text"
                    value={value || ''}
                    onChange={(e) =>
                      onFiltersChange?.({
                        ...activeFilters,
                        [filter.id]: e.target.value,
                      })
                    }
                    placeholder="Filtrar..."
                    className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  />
                </div>
              )
            }

            return null
          })}

          {/* Botón limpiar filtros */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                const cleared = Object.keys(activeFilters).reduce(
                  (acc, key) => ({ ...acc, [key]: '' }),
                  {}
                )
                onFiltersChange?.(cleared)
              }}
              className="text-sm px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  )
}
