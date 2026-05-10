/**
 * Constantes de configuración del sidebar y navegación
 * Centraliza definiciones de ítems del menú, orden y accesibilidad
 */

import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  UserSearch,
  MessageSquare,
  Table2,
  FolderOpen,
  Settings,
} from 'lucide-react'
import { EmployeeRole } from '@/types/employee'
import { APP_ROUTES } from './routes'

/**
 * Definición de un ítem de navegación
 */
export interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ElementType
  disabled?: boolean
  requiredRoles?: EmployeeRole[]
  children?: NavItem[]
}

/**
 * Ítems del sidebar ordenados
 * Orden determina el orden de aparición en el menú
 */
export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: APP_ROUTES.DASHBOARD,
    icon: LayoutDashboard,
    requiredRoles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER, EmployeeRole.USER],
  },
  {
    id: 'employees',
    label: 'Empleados',
    href: APP_ROUTES.EMPLOYEES,
    icon: Users,
    requiredRoles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER],
  },
  {
    id: 'permissions',
    label: 'Permisos',
    href: APP_ROUTES.PERMISSIONS,
    icon: CalendarCheck,
    requiredRoles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER, EmployeeRole.USER],
  },
  {
    id: 'recruitment',
    label: 'Reclutamiento',
    href: APP_ROUTES.RECRUITMENT,
    icon: UserSearch,
    disabled: true,
    requiredRoles: [EmployeeRole.ADMIN],
  },
  {
    id: 'messages',
    label: 'Mensajes',
    href: APP_ROUTES.MESSAGES,
    icon: MessageSquare,
    disabled: true,
    requiredRoles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER, EmployeeRole.USER],
  },
  {
    id: 'boards',
    label: 'Tableros',
    href: APP_ROUTES.BOARDS,
    icon: Table2,
    disabled: true,
    requiredRoles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER],
  },
  {
    id: 'files',
    label: 'Archivos',
    href: APP_ROUTES.FILES,
    icon: FolderOpen,
    disabled: true,
    requiredRoles: [EmployeeRole.ADMIN],
  },
  {
    id: 'settings',
    label: 'Configuración',
    href: APP_ROUTES.SETTINGS,
    icon: Settings,
    disabled: true,
    requiredRoles: [EmployeeRole.ADMIN],
  },
]

/**
 * Orden preferido de los ítems del sidebar
 * Usado para asegurar consistencia visual
 */
export const NAV_ITEM_ORDER = [
  'dashboard',
  'employees',
  'permissions',
  'recruitment',
  'messages',
  'boards',
  'files',
  'settings',
] as const

/**
 * Ítems del menú inferior (usuario, logout, etc)
 * Estos aparecen al final del sidebar
 */
export const BOTTOM_NAV_ITEMS = [
  // Estos se agregarían si fuera necesario
  // { id: 'profile', label: 'Mi Perfil', href: '/profile', icon: User }
  // { id: 'logout', label: 'Cerrar sesión', action: 'logout', icon: LogOut }
] as const

/**
 * Configuración visual del sidebar
 */
export const SIDEBAR_CONFIG = {
  // Ancho en pixels
  WIDTH_EXPANDED: 256,
  WIDTH_COLLAPSED: 72,

  // Colores
  BG_COLOR: 'bg-slate-900',
  TEXT_COLOR: 'text-slate-100',
  BORDER_COLOR: 'border-slate-800',
  HOVER_COLOR: 'hover:bg-slate-800',

  // Duración de animación de colapso
  ANIMATION_DURATION: 'duration-300',

  // Iconos
  ICON_SIZE: 'w-5 h-5',
  LOGO_SIZE: 'w-7 h-7',
} as const

/**
 * Obtener ítems del sidebar para un rol específico
 * Filtra y ordena los ítems según el rol del usuario
 */
export function getNavItemsByRole(role?: EmployeeRole): NavItem[] {
  if (!role) return []

  return NAV_ITEMS.filter((item) => {
    // Si no hay roles requeridos, está disponible para todos
    if (!item.requiredRoles || item.requiredRoles.length === 0) {
      return true
    }

    // Verificar si el rol actual está en los roles requeridos
    return item.requiredRoles.includes(role)
  }).sort((a, b) => {
    // Ordenar según NAV_ITEM_ORDER
    const indexA = (NAV_ITEM_ORDER as readonly string[]).indexOf(a.id)
    const indexB = (NAV_ITEM_ORDER as readonly string[]).indexOf(b.id)
    return indexA - indexB
  })
}

/**
 * Obtener un ítem de navegación por su ID
 */
export function getNavItemById(id: string): NavItem | undefined {
  return NAV_ITEMS.find((item) => item.id === id)
}

/**
 * Obtener un ítem de navegación por su ruta
 */
export function getNavItemByRoute(href: string): NavItem | undefined {
  return NAV_ITEMS.find((item) => item.href === href)
}

/**
 * Verificar si un usuario puede acceder a un ítem
 */
export function canAccessNavItem(item: NavItem, userRole?: EmployeeRole): boolean {
  if (!userRole) return false
  if (!item.requiredRoles || item.requiredRoles.length === 0) return true
  return item.requiredRoles.includes(userRole)
}

/**
 * Verificar si un ítem está disponible (no deshabilitado y accesible)
 */
export function isNavItemAvailable(item: NavItem, userRole?: EmployeeRole): boolean {
  return !item.disabled && canAccessNavItem(item, userRole)
}

/**
 * Obtener contador de ítems deshabilitados para un rol
 */
export function getDisabledNavItemCount(role?: EmployeeRole): number {
  if (!role) return 0
  const availableItems = getNavItemsByRole(role)
  return availableItems.filter((item) => item.disabled).length
}
