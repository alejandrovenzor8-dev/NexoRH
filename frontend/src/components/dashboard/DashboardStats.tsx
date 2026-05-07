import { Users, UserCheck, LayoutGrid } from 'lucide-react'
import StatCard from '@/components/ui/StatCard'
import { User } from '@/services/api'

interface DashboardStatsProps {
  users: User[]
  loading?: boolean
}

function SkeletonStat() {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-3 w-24 bg-gray-100 rounded" />
        <div className="w-8 h-8 bg-gray-100 rounded-lg" />
      </div>
      <div className="h-8 w-16 bg-gray-100 rounded mt-2" />
      <div className="h-3 w-28 bg-gray-100 rounded mt-2" />
    </div>
  )
}

export default function DashboardStats({ users, loading }: DashboardStatsProps) {
  const activeUsers = users.filter((u) => u.status === 'active').length
  const admins = users.filter((u) => u.role === 'ADMIN').length

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <SkeletonStat />
        <SkeletonStat />
        <SkeletonStat />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <StatCard
        title="Total de empleados"
        value={users.length}
        subtitle="En tu empresa"
        icon={Users}
        iconColor="text-blue-600"
      />
      <StatCard
        title="Usuarios activos"
        value={activeUsers}
        subtitle="Actualmente activos"
        icon={UserCheck}
        iconColor="text-emerald-600"
      />
      <StatCard
        title="Módulos"
        value={5}
        subtitle="Funciones disponibles"
        icon={LayoutGrid}
        iconColor="text-purple-600"
      />
    </div>
  )
}
