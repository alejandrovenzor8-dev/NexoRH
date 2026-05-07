'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getUsers, logout } from '@/services/api'

interface UserInfo {
  id: string
  fullName: string
  email: string
  role: string
  companyId: string
  status?: string
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-purple-100 text-purple-800',
  MANAGER: 'bg-blue-100 text-blue-800',
  USER: 'bg-green-100 text-green-800',
}

const modules = [
  { name: 'Gestión de usuarios', description: 'Administra miembros del equipo, roles y permisos.', icon: '👥', active: true },
  { name: 'Mensajería', description: 'Chat interno y notificaciones en tiempo real.', icon: '💬', active: false },
  { name: 'Tablas dinámicas', description: 'Gestión de datos personalizada con esquemas flexibles.', icon: '📊', active: false },
  { name: 'Reclutamiento', description: 'Ofertas de trabajo, postulaciones y seguimiento de candidatos.', icon: '🎯', active: false },
  { name: 'Automatización', description: 'Flujos de trabajo basados en eventos y acciones automatizadas.', icon: '⚡', active: false },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [users, setUsers] = useState<UserInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
      return
    }

    const fetchData = async () => {
      try {
        const [currentUser, allUsers] = await Promise.all([
          getCurrentUser(token),
          getUsers(token),
        ])
        setUser(currentUser)
        setUsers(allUsers)
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.replace('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = () => {
    logout()
    router.replace('/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Cargando panel...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
                <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[user.role] || 'bg-gray-100 text-gray-700'}`}>
                {user.role}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors font-medium"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-1">¡Bienvenido, {user.fullName.split(' ')[0]}! 👋</h2>
          <p className="text-blue-100 text-sm">
            Has iniciado sesión como <strong>{user.role}</strong>. Aquí está el resumen de tu panel.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Total de empleados</p>
            <p className="text-3xl font-bold text-gray-900">{users.length}</p>
            <p className="text-xs text-green-600 mt-1">En tu empresa</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Usuarios activos</p>
            <p className="text-3xl font-bold text-gray-900">
              {users.filter(u => u.status === 'active').length}
            </p>
            <p className="text-xs text-blue-600 mt-1">Actualmente activos</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Módulos</p>
            <p className="text-3xl font-bold text-gray-900">5</p>
            <p className="text-xs text-purple-600 mt-1">Funciones disponibles</p>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-xl border border-gray-200 mb-8">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Miembros del equipo</h3>
            <p className="text-sm text-gray-500 mt-0.5">Todos los usuarios de tu empresa</p>
          </div>
          <div className="divide-y divide-gray-50">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                    {u.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{u.fullName}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[u.role] || 'bg-gray-100 text-gray-600'}`}>
                  {u.role}
                </span>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">No se encontraron miembros del equipo</p>
            )}
          </div>
        </div>

        {/* Modules */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Módulos de la plataforma</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod) => (
              <div
                key={mod.name}
                className={`bg-white rounded-xl border p-5 transition-shadow ${
                  mod.active ? 'border-blue-200 hover:shadow-md cursor-pointer' : 'border-gray-200 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{mod.icon}</span>
                  {!mod.active && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                      Próximamente
                    </span>
                  )}
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{mod.name}</h4>
                <p className="text-xs text-gray-500">{mod.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
