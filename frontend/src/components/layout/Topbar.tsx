'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, Search, ChevronDown, LogOut, User } from 'lucide-react'
import { logout } from '@/services/api'
import NotificationsDropdown from '@/components/notifications/NotificationsDropdown'
import { UserSession } from '@/types/auth'

interface Breadcrumb {
  label: string
  href?: string
}

interface TopbarProps {
  user: UserSession | null
  breadcrumbs?: Breadcrumb[]
  onMobileMenuOpen: () => void
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  USER: 'Usuario',
}

export default function Topbar({ user, breadcrumbs = [], onMobileMenuOpen }: TopbarProps) {
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const initials = user?.fullName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() ?? '?'

  const handleLogout = () => {
    logout()
    router.replace('/login')
  }

  return (
    <header className="bg-white border-b border-gray-200/80 sticky top-0 z-30 h-14 flex items-center px-4 sm:px-6 gap-4 shadow-sm">
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumbs */}
      <nav className="flex-1 min-w-0">
        {breadcrumbs.length > 0 ? (
          <ol className="flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-gray-300">/</span>}
                {crumb.href && i < breadcrumbs.length - 1 ? (
                  <button
                    onClick={() => router.push(crumb.href!)}
                    className="text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className={i === breadcrumbs.length - 1 ? 'font-semibold text-gray-900' : 'text-gray-500'}>
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        ) : null}
      </nav>

      {/* Right section */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Search */}
        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors w-44">
          <Search className="w-4 h-4 shrink-0" />
          <span className="truncate">Buscar...</span>
          <span className="ml-auto text-xs text-gray-400 bg-white rounded px-1 border border-gray-200">⌘K</span>
        </button>

        {/* Notifications */}
        <NotificationsDropdown role={user?.role} />

        {/* User dropdown */}
        <div className="relative ml-1">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-gray-900 leading-none mb-0.5">{user?.fullName}</p>
              <p className="text-[10px] text-gray-400 leading-none">{ROLE_LABELS[user?.role ?? ''] ?? user?.role}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl border border-gray-200 shadow-lg z-50 py-1 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => { setDropdownOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  Mi perfil
                </button>
                <div className="my-1 border-t border-gray-100" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
