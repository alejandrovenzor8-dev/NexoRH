interface Column<T> {
  key: keyof T | string
  label: string
  render?: (row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyField: keyof T
  emptyMessage?: string
  loading?: boolean
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-3">
          <div className="h-4 bg-gray-100 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  )
}

export default function DataTable<T>({
  columns,
  data,
  keyField,
  emptyMessage = 'Sin resultados',
  loading = false,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200/80 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/60">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide ${col.className ?? ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <SkeletonRow key={i} cols={columns.length} />
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-5 py-12 text-center text-sm text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={String(row[keyField])} className="hover:bg-gray-50/60 transition-colors">
                {columns.map((col) => (
                  <td key={String(col.key)} className={`px-5 py-3 text-gray-700 ${col.className ?? ''}`}>
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[String(col.key)] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
