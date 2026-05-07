import { Building2, LayoutGrid, UserCheck, Users } from 'lucide-react'
import StatCard from '@/components/ui/StatCard'
import { User } from '@/services/api'

interface StatsGridProps {
  users: User[]
}

export default function StatsGrid({ users }: StatsGridProps) {
  const activeUsers = users.filter((u) => (u.status ?? 'active') === 'active').length
  const admins = users.filter((u) => u.role === 'ADMIN').length

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total de empleados"
          value={users.length}
          subtitle="En tu organización"
          icon={Users}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Usuarios activos"
          value={activeUsers}
          subtitle="Con actividad reciente"
          icon={UserCheck}
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Administradores"
          value={admins}
          subtitle="Con permisos elevados"
          icon={Building2}
          iconColor="text-indigo-600"
        />
        <StatCard
          title="Módulos habilitados"
          value={5}
          subtitle="Capacidades disponibles"
          icon={LayoutGrid}
          iconColor="text-purple-600"
        />
      </div>
    </section>
  )
}
