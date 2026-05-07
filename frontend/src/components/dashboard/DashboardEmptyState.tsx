import { FolderSearch } from 'lucide-react'

interface DashboardEmptyStateProps {
  title?: string
  description?: string
}

export default function DashboardEmptyState({
  title = 'No hay datos para mostrar',
  description = 'Cuando agregues información en tu cuenta, el panel mostrará métricas y actividad automáticamente.',
}: DashboardEmptyStateProps) {
  return (
    <section className="rounded-2xl border border-dashed border-gray-300 bg-white/80 p-8 sm:p-12 text-center shadow-sm">
      <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
        <FolderSearch className="w-6 h-6" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-1">{title}</h2>
      <p className="text-sm text-gray-500 max-w-xl mx-auto">{description}</p>
    </section>
  )
}
