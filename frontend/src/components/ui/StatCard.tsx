import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  trend?: {
    value: string
    positive?: boolean
  }
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-600',
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className={`p-2 rounded-lg bg-gray-50 ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
      {subtitle && (
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      )}
      {trend && (
        <p className={`text-xs mt-2 font-medium ${trend.positive ? 'text-emerald-600' : 'text-red-500'}`}>
          {trend.positive ? '↑' : '↓'} {trend.value}
        </p>
      )}
    </div>
  )
}
