'use client'

import type { TableSkeletonProps } from './types'

/**
 * Skeleton loading para tabla
 * Muestra shimmer animado mientras se cargan los datos
 */
export function TableSkeleton({
  columns,
  rows = 5,
  showPagination = true,
}: TableSkeletonProps) {
  return (
    <div className="w-full space-y-4">
      <div className="overflow-x-auto rounded-xl border border-gray-200/50 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/40">
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50/40">
                {Array.from({ length: columns }).map((_, colIdx) => (
                  <td
                    key={`${rowIdx}-${colIdx}`}
                    className="px-6 py-4"
                  >
                    <div className="h-4 w-32 rounded bg-gray-150 animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination && (
        <div className="flex items-center justify-between">
          <div className="h-4 w-48 rounded bg-gray-200 animate-pulse" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-8 w-8 rounded bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
