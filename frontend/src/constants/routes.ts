/**
 * Constantes de rutas de la aplicación
 * Centraliza definiciones de rutas, paths y navegación
 */

/**
 * Rutas públicas (sin autenticación)
 */
export const PUBLIC_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
} as const

/**
 * Rutas de aplicación (requieren autenticación)
 */
export const APP_ROUTES = {
  // Raíz y dashboard
  ROOT: '/',
  DASHBOARD: '/dashboard',

  // Empleados
  EMPLOYEES: '/employees',
  EMPLOYEE_DETAIL: (id: string) => `/employees/${id}`,
  EMPLOYEE_EDIT: (id: string) => `/employees/${id}/edit`,
  EMPLOYEE_NEW: '/employees/new',

  // Permisos
  PERMISSIONS: '/permissions',
  PERMISSION_DETAIL: (id: string) => `/permissions/${id}`,

  // Reclutamiento (futuro)
  RECRUITMENT: '/reclutamiento',

  // Mensajes (futuro)
  MESSAGES: '/mensajes',

  // Tableros (futuro)
  BOARDS: '/tableros',

  // Archivos (futuro)
  FILES: '/archivos',

  // Configuración (futuro)
  SETTINGS: '/configuracion',
} as const

/**
 * Rutas disponibles por rol
 * Define qué rutas puede acceder cada rol
 */
export const ROUTES_BY_ROLE = {
  ADMIN: [
    APP_ROUTES.DASHBOARD,
    APP_ROUTES.EMPLOYEES,
    APP_ROUTES.PERMISSIONS,
    APP_ROUTES.RECRUITMENT,
    APP_ROUTES.MESSAGES,
    APP_ROUTES.BOARDS,
    APP_ROUTES.FILES,
    APP_ROUTES.SETTINGS,
  ],
  MANAGER: [
    APP_ROUTES.DASHBOARD,
    APP_ROUTES.EMPLOYEES,
    APP_ROUTES.PERMISSIONS,
    APP_ROUTES.MESSAGES,
    APP_ROUTES.BOARDS,
  ],
  USER: [APP_ROUTES.DASHBOARD, APP_ROUTES.PERMISSIONS, APP_ROUTES.MESSAGES],
} as const

/**
 * Rutas deshabilitadas en la navegación (no están implementadas aún)
 */
export const DISABLED_ROUTES = [
  APP_ROUTES.RECRUITMENT,
  APP_ROUTES.MESSAGES,
  APP_ROUTES.BOARDS,
  APP_ROUTES.FILES,
  APP_ROUTES.SETTINGS,
] as const

/**
 * Ruta por defecto después de login
 */
export const DEFAULT_REDIRECT_AFTER_LOGIN = APP_ROUTES.DASHBOARD

/**
 * Ruta de logout
 */
export const LOGOUT_REDIRECT = PUBLIC_ROUTES.LOGIN

/**
 * Rutas que requieren roles específicos
 */
export const ROLE_RESTRICTED_ROUTES: Record<
  string,
  string[] // Array de roles permitidos
> = {
  [APP_ROUTES.EMPLOYEES]: ['ADMIN', 'MANAGER'],
  [APP_ROUTES.PERMISSIONS]: ['ADMIN', 'MANAGER', 'USER'],
  [APP_ROUTES.RECRUITMENT]: ['ADMIN'],
  [APP_ROUTES.SETTINGS]: ['ADMIN'],
  [APP_ROUTES.FILES]: ['ADMIN'],
  [APP_ROUTES.BOARDS]: ['ADMIN', 'MANAGER'],
  [APP_ROUTES.MESSAGES]: ['ADMIN', 'MANAGER', 'USER'],
} as const

/**
 * Obtener rutas accesibles para un rol
 */
export function getAccessibleRoutes(role: string): string[] {
  const routes = ROUTES_BY_ROLE[role as keyof typeof ROUTES_BY_ROLE]
  return routes ? Array.from(routes) : []
}

/**
 * Verificar si una ruta está deshabilitada
 */
export function isRouteDisabled(route: string): boolean {
  return (DISABLED_ROUTES as readonly string[]).includes(route)
}

/**
 * Verificar si un usuario tiene acceso a una ruta
 */
export function canAccessRoute(role: string, route: string): boolean {
  const accessibleRoutes = getAccessibleRoutes(role)
  return accessibleRoutes.includes(route) || route === APP_ROUTES.DASHBOARD
}

/**
 * Obtener nombres amigables de rutas para breadcrumbs
 */
export const ROUTE_LABELS: Record<string, string> = {
  [APP_ROUTES.DASHBOARD]: 'Dashboard',
  [APP_ROUTES.EMPLOYEES]: 'Empleados',
  [APP_ROUTES.EMPLOYEE_NEW]: 'Nuevo Empleado',
  [APP_ROUTES.PERMISSIONS]: 'Permisos',
  [APP_ROUTES.RECRUITMENT]: 'Reclutamiento',
  [APP_ROUTES.MESSAGES]: 'Mensajes',
  [APP_ROUTES.BOARDS]: 'Tableros',
  [APP_ROUTES.FILES]: 'Archivos',
  [APP_ROUTES.SETTINGS]: 'Configuración',
} as const

/**
 * Obtener label de una ruta
 */
export function getRouteLabel(route: string): string {
  return ROUTE_LABELS[route as keyof typeof ROUTE_LABELS] || route
}
