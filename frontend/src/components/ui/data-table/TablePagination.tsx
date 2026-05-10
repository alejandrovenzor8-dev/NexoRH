'use client'

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react'
import type { TablePaginationProps } from './types'

/**
 * Controles de paginación para tabla
 * Incluye navegación y selector de tamaño de página
 */
export function TablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}: TablePaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  const startIndex = (page - 1) * pageSize + 1
  const endIndex = Math.min(page * pageSize, total)

  const handlePreviousPage = () => {
    if (page > 1) onPageChange?.(page - 1)
  }

  const handleNextPage = () => {
    if (page < totalPages) onPageChange?.(page + 1)
  }

  const handleFirstPage = () => {
    onPageChange?.(1)
  }

  const handleLastPage = () => {
    onPageChange?.(totalPages)
  }

  return (
    <div className="flex items-center justify-between gap-8 px-6 py-4 border-t border-gray-100 bg-gray-50/30">
      {/* Tamaño de página */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Filas por página:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Información de paginación */}
      <div className="text-sm text-gray-600">
        {total > 0 ? (
          <>
            Mostrando <span className="font-medium">{startIndex}</span> a{' '}
            <span className="font-medium">{endIndex}</span> de{' '}
            <span className="font-medium">{total}</span> resultados
          </>
        ) : (
          <span>Sin resultados</span>
        )}
      </div>

      {/* Controles de navegación */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleFirstPage}
          disabled={page === 1 || totalPages === 0}
          className="p-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-200 transition-colors"
          title="Primera página"
        >
          <ChevronsLeftIcon className="w-4 h-4" />
        </button>

        <button
          onClick={handlePreviousPage}
          disabled={page === 1 || totalPages === 0}
          className="p-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-200 transition-colors"
          title="Página anterior"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>

        <div className="text-sm text-gray-600 px-3">
          <span className="font-medium">{page}</span>
          <span className="text-gray-400"> / </span>
          <span className="font-medium">{totalPages || 1}</span>
        </div>

        <button
          onClick={handleNextPage}
          disabled={page >= totalPages || totalPages === 0}
          className="p-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-200 transition-colors"
          title="Próxima página"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>

        <button
          onClick={handleLastPage}
          disabled={page >= totalPages || totalPages === 0}
          className="p-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-200 transition-colors"
          title="Última página"
        >
          <ChevronsRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
