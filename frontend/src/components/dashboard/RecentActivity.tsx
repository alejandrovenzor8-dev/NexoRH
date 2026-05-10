import { Activity } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import EmptyState from '@/components/ui/EmptyState'
import { DashboardActivityItem, DashboardActivityType } from '@/types/dashboard'

// Placeholder — en el futuro conectar con API de actividad
const MOCK_ACTIVITY: DashboardActivityItem[] = []

const TYPE_COLORS: Record<DashboardActivityType, string> = {
  [DashboardActivityType.USER]: 'bg-blue-400',
  [DashboardActivityType.SYSTEM]: 'bg-purple-400',
  [DashboardActivityType.AUTH]: 'bg-emerald-400',
}

export default function RecentActivity() {
  return (
    <section>
      <SectionHeader title="Actividad reciente" description="Últimas acciones en la plataforma" />
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 sm:p-6 transition-all duration-300 hover:shadow-md">
        {MOCK_ACTIVITY.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="Sin actividad reciente"
            description="Las acciones realizadas en la plataforma aparecerán aquí."
          />
        ) : (
          <ul className="divide-y divide-gray-50">
            {MOCK_ACTIVITY.map((item) => (
              <li key={item.id} className="flex items-start gap-3 py-3.5">
                <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${TYPE_COLORS[item.type]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{item.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
