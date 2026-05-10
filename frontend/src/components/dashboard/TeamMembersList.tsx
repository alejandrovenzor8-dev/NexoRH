import { Mail, Phone, Users } from 'lucide-react'
import DataTable from '@/components/ui/DataTable'
import EmptyState from '@/components/ui/EmptyState'
import SectionHeader from '@/components/ui/SectionHeader'
import StatusBadge from '@/components/ui/StatusBadge'
import { UserSession } from '@/types/auth'
import { EmployeeStatus } from '@/types/employee'

interface TeamMembersListProps {
  users: UserSession[]
}

const columns = [
  {
    key: 'fullName',
    label: 'Colaborador',
    render: (u: UserSession) => (
      <div className="flex items-center gap-3">
        <div
          title={`Perfil de ${u.fullName}`}
          className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold shrink-0"
        >
          {u.fullName.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-gray-900 text-sm truncate">{u.fullName}</p>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Mail className="w-3.5 h-3.5" />
            <span className="truncate">{u.email}</span>
          </div>
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
  {
    key: 'phone',
    label: 'Teléfono',
    render: (u: UserSession) => (
      <span className="inline-flex items-center gap-1.5 text-sm text-gray-500" title={u.phone || 'Sin teléfono'}>
        <Phone className="w-3.5 h-3.5" />
        {u.phone || 'No registrado'}
      </span>
    ),
  },
]

export default function TeamMembersList({ users }: TeamMembersListProps) {
  return (
    <section className="xl:col-span-2">
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 sm:p-6 transition-all duration-300 hover:shadow-md">
        <SectionHeader
          title="Equipo"
          description="Vista consolidada de colaboradores, roles y estado"
        />

        {users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Aún no hay colaboradores"
            description="Invita usuarios para comenzar a gestionar tu equipo desde este panel."
          />
        ) : (
          <DataTable
            columns={columns}
            data={users}
            keyField="id"
            emptyMessage="No se encontraron miembros"
          />
        )}
      </div>
    </section>
  )
}
