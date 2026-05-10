'use client'

import { InboxIcon } from 'lucide-react'
import type { TableEmptyStateProps } from './types'

/**
 * Estado vacío para tabla
 * Muestra mensaje cuando no hay datos
 */
export function TableEmptyState({
  message = 'Sin resultados',
  icon = <InboxIcon className="w-12 h-12 text-gray-300" />,
  action,
}: TableEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="mb-4">{icon}</div>
      <p className="text-base font-medium text-gray-600 mb-1">{message}</p>
      <p className="text-sm text-gray-400 mb-6">
        Intenta ajustar los filtros o la búsqueda
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
