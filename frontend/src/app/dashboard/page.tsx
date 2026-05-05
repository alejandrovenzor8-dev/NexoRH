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
  { name: 'User Management', description: 'Manage team members, roles, and permissions.', icon: '👥', active: true },
  { name: 'Messaging', description: 'Real-time internal chat and notifications.', icon: '💬', active: false },
  { name: 'Dynamic Tables', description: 'Custom data management with flexible schemas.', icon: '📊', active: false },
  { name: 'Recruitment', description: 'Job postings, applications, and candidate tracking.', icon: '🎯', active: false },
  { name: 'Automation', description: 'Event-based workflows and automated actions.', icon: '⚡', active: false },
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
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
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
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-1">Welcome back, {user.fullName.split(' ')[0]}! 👋</h2>
          <p className="text-blue-100 text-sm">
            You are logged in as <strong>{user.role}</strong>. Here is your dashboard overview.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Total Employees</p>
            <p className="text-3xl font-bold text-gray-900">{users.length}</p>
            <p className="text-xs text-green-600 mt-1">In your company</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Active Users</p>
            <p className="text-3xl font-bold text-gray-900">
              {users.filter(u => u.status === 'active').length}
            </p>
            <p className="text-xs text-blue-600 mt-1">Currently active</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Modules</p>
            <p className="text-3xl font-bold text-gray-900">5</p>
            <p className="text-xs text-purple-600 mt-1">Available features</p>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-xl border border-gray-200 mb-8">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Team Members</h3>
            <p className="text-sm text-gray-500 mt-0.5">All users in your company</p>
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
              <p className="text-sm text-gray-400 text-center py-8">No team members found</p>
            )}
          </div>
        </div>

        {/* Modules */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Platform Modules</h3>
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
                      Coming Soon
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
