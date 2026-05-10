import { Users } from 'lucide-react'
import DataTable from '@/components/ui/DataTable'
import StatusBadge from '@/components/ui/StatusBadge'
import SectionHeader from '@/components/ui/SectionHeader'
import EmptyState from '@/components/ui/EmptyState'
import { UserSession } from '@/types/auth'
import { EmployeeStatus } from '@/types/employee'

interface TeamMembersCardProps {
  users: UserSession[]
  loading?: boolean
}

const columns = [
  {
    key: 'fullName',
    label: 'Nombre',
    render: (u: UserSession) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm shrink-0">
          {u.fullName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-gray-900 text-sm">{u.fullName}</p>
          <p className="text-xs text-gray-400">{u.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'role',
    label: 'Rol',
    render: (u: UserSession) => <StatusBadge value={u.role} variant="role" />,
  },
  {
    key: 'status',
    label: 'Estado',
    render: (u: UserSession) => <StatusBadge value={u.status || EmployeeStatus.ACTIVE} variant="status" />,
  },
]

export default function TeamMembersCard({ users, loading }: TeamMembersCardProps) {
  return (
    <div className="mb-8">
      <SectionHeader
        title="Miembros del equipo"
        description="Todos los usuarios de tu empresa"
      />
      {!loading && users.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm">
          <EmptyState
            icon={Users}
            title="Sin miembros"
            description="No se encontraron usuarios en tu empresa."
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          keyField="id"
          loading={loading}
          emptyMessage="No se encontraron miembros del equipo"
        />
      )}
    </div>
  )
}
