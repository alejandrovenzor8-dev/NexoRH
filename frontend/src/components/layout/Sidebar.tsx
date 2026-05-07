'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  UserSearch,
  MessageSquare,
  Table2,
  FolderOpen,
  Settings,
  ChevronLeft,
  LogOut,
} from 'lucide-react'
import { logout } from '@/services/api'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  disabled?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Empleados', href: '/employees', icon: Users },
  { label: 'Permisos', href: '/permissions', icon: CalendarCheck },
  { label: 'Reclutamiento', href: '/reclutamiento', icon: UserSearch, disabled: true },
  { label: 'Mensajes', href: '/mensajes', icon: MessageSquare, disabled: true },
  { label: 'Tableros', href: '/tableros', icon: Table2, disabled: true },
  { label: 'Archivos', href: '/archivos', icon: FolderOpen, disabled: true },
  { label: 'Configuración', href: '/configuracion', icon: Settings, disabled: true },
]

interface SidebarProps {
  user: { fullName: string; email: string; role: string } | null
  collapsed: boolean
  onCollapse: (v: boolean) => void
  mobileOpen: boolean
  onMobileClose: () => void
}

export default function Sidebar({
  user,
  collapsed,
  onCollapse,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.replace('/login')
  }

  const initials = user?.fullName
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() ?? '?'

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center h-16 px-4 border-b border-slate-800 shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-white font-bold text-base tracking-tight">NexoRH</span>
          </div>
        )}
        {collapsed && (
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={() => onCollapse(true)}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <button
              key={item.href}
              onClick={() => {
                if (!item.disabled) {
                  router.push(item.href)
                  onMobileClose()
                }
              }}
              disabled={item.disabled}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : item.disabled
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : ''}`} />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.disabled && (
                <span className="ml-auto text-[10px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-normal">
                  Pronto
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* User footer */}
      <div className={`shrink-0 border-t border-slate-800 p-3 ${collapsed ? 'flex justify-center' : ''}`}>
        {collapsed ? (
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-slate-900 h-screen sticky top-0 shrink-0 transition-all duration-300
          ${collapsed ? 'w-16' : 'w-60'}
        `}
      >
        {sidebarContent}
        {collapsed && (
          <button
            onClick={() => onCollapse(false)}
            className="absolute -right-3 top-20 w-6 h-6 bg-slate-700 border border-slate-600 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-colors shadow-md"
          >
            <ChevronLeft className="w-3 h-3 rotate-180" />
          </button>
        )}
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 z-50 lg:hidden flex flex-col transition-transform duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
