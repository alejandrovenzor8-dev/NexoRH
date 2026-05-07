'use client'

interface DashboardHeaderProps {
  fullName: string
  email: string
  role: string
  onLogout: () => void
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-800',
  MANAGER: 'bg-blue-100 text-blue-800',
  USER: 'bg-green-100 text-green-800',
}

export default function DashboardHeader({ fullName, email, role, onLogout }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">NexoRH</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{fullName}</p>
              <p className="text-xs text-gray-500">{email}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[role] || 'bg-gray-100 text-gray-700'}`}>
              {role}
            </span>
            <button
              onClick={onLogout}
              className="text-sm text-gray-500 hover:text-red-600 transition-colors font-medium"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
