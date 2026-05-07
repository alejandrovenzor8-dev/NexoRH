import { UsersRound } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'

interface EmployeeEmptyStateProps {
  filtered?: boolean
  onResetFilters?: () => void
  title?: string
  description?: string
}

export default function EmployeeEmptyState({
  filtered = false,
  onResetFilters,
  title = 'No hay empleados registrados',
  description = 'Agrega el primer colaborador para comenzar a gestionar tu equipo.',
}: EmployeeEmptyStateProps) {
  if (filtered) {
    return (
      <div className="rounded-xl border border-gray-200/80 bg-gray-50/50">
        <EmptyState
          icon={UsersRound}
          title="No hay resultados para esos filtros"
          description="Modifica la búsqueda o filtros para ver empleados nuevamente."
          action={onResetFilters ? { label: 'Limpiar filtros', onClick: onResetFilters } : undefined}
        />
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200/80 bg-gray-50/50">
      <EmptyState
        icon={UsersRound}
        title={title}
        description={description}
      />
    </div>
  )
}
