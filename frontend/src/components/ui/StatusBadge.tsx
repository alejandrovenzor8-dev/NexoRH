interface StatusBadgeProps {
  value: string
  variant?: 'role' | 'status' | 'module'
}

const ROLE_STYLES: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-700 ring-purple-200',
  MANAGER: 'bg-blue-100 text-blue-700 ring-blue-200',
  USER: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  inactive: 'bg-gray-100 text-gray-500 ring-gray-200',
  pending: 'bg-amber-100 text-amber-700 ring-amber-200',
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  USER: 'Usuario',
}

export default function StatusBadge({ value, variant = 'role' }: StatusBadgeProps) {
  const styles =
    variant === 'role'
      ? ROLE_STYLES[value] ?? 'bg-gray-100 text-gray-600 ring-gray-200'
      : STATUS_STYLES[value] ?? 'bg-gray-100 text-gray-600 ring-gray-200'

  const label = variant === 'role' ? (ROLE_LABELS[value] ?? value) : value

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ring-1 ring-inset ${styles}`}
    >
      {label}
    </span>
  )
}
