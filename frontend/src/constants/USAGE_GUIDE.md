/**
 * GUÍA DE USO: Constantes Centralizadas (src/constants)
 * 
 * Los archivos de constantes eliminan strings hardcodeados del código.
 * Proporciona una única fuente de verdad para configuraciones reutilizables.
 * 
 * ============================================================================
 * ESTRUCTURA
 * ============================================================================
 * 
 * src/constants/
 * ├── index.ts           - Barrel export de todas las constantes
 * ├── roles.ts           - Metadatos de roles y permisos
 * ├── statuses.ts        - Estados de empleados y permisos
 * ├── permissions.ts     - Tipos de permisos y reglas
 * ├── routes.ts          - Rutas de la aplicación
 * └── sidebar.ts         - Configuración del sidebar/navegación
 * 
 * ============================================================================
 * IMPORTACIÓN
 * ============================================================================
 * 
 * // Importar constantes
 * import {
 *   ROLE_META,
 *   APP_ROUTES,
 *   EMPLOYEE_STATUS_META,
 *   PERMISSION_TYPE_META,
 *   SIDEBAR_CONFIG,
 *   getNavItemsByRole,
 *   getRoleLabel,
 *   getPermissionTypeLabel,
 *   ...
 * } from '@/constants'
 * 
 * // O importar de un módulo específico
 * import { ROLE_META, isAdminRole } from '@/constants/roles'
 * import { APP_ROUTES } from '@/constants/routes'
 * 
 * ============================================================================
 * EJEMPLO 1: Roles y Metadatos
 * ============================================================================
 * 
 * import { ROLE_META, getRoleLabel } from '@/constants'
 * 
 * // Obtener información de un rol
 * const adminMeta = ROLE_META[EmployeeRole.ADMIN]
 * console.log(adminMeta.label)        // 'Administrador'
 * console.log(adminMeta.color)        // 'text-red-600'
 * console.log(adminMeta.permissions)  // ['manage_employees', ...]
 * 
 * // Usar helpers
 * const label = getRoleLabel(EmployeeRole.MANAGER)  // 'Gerente'
 * const isAdmin = isAdminRole(userRole)             // boolean
 * 
 * ============================================================================
 * EJEMPLO 2: Rutas
 * ============================================================================
 * 
 * import { APP_ROUTES, canAccessRoute, getRouteLabel } from '@/constants'
 * 
 * // Obtener rutas
 * const dashboardRoute = APP_ROUTES.DASHBOARD     // '/dashboard'
 * const employeeRoute = APP_ROUTES.EMPLOYEE_DETAIL('emp-123')
 * 
 * // Verificar acceso
 * const canAccess = canAccessRoute(userRole, '/employees')
 * 
 * // Obtener labels para breadcrumbs
 * const label = getRouteLabel(APP_ROUTES.EMPLOYEES)  // 'Empleados'
 * 
 * ============================================================================
 * EJEMPLO 3: Estados
 * ============================================================================
 * 
 * import {
 *   EMPLOYEE_STATUS_META,
 *   PERMISSION_STATUS_META,
 *   getEmployeeStatusLabel,
 *   isEmployeeActive
 * } from '@/constants'
 * 
 * // Estados de empleados
 * const activeMeta = EMPLOYEE_STATUS_META[EmployeeStatus.ACTIVE]
 * console.log(activeMeta.label)        // 'Activo'
 * console.log(activeMeta.badgeVariant) // 'success'
 * 
 * // Estados de permisos
 * const pendingMeta = PERMISSION_STATUS_META[PermissionStatus.PENDING]
 * console.log(pendingMeta.label)       // 'Pendiente'
 * console.log(pendingMeta.color)       // 'text-blue-600'
 * 
 * // Helpers
 * const label = getEmployeeStatusLabel(EmployeeStatus.INACTIVE)
 * const active = isEmployeeActive(status)
 * 
 * ============================================================================
 * EJEMPLO 4: Tipos de Permisos
 * ============================================================================
 * 
 * import {
 *   PERMISSION_TYPE_META,
 *   REQUIRES_ATTACHMENT,
 *   MAX_DAYS_BY_TYPE,
 *   getPermissionTypeLabel,
 *   permissionRequiresAttachment
 * } from '@/constants'
 * 
 * // Información de un tipo de permiso
 * const vacationMeta = PERMISSION_TYPE_META[PermissionType.VACATION]
 * console.log(vacationMeta.label)  // 'Vacaciones'
 * console.log(vacationMeta.icon)   // '🏖️'
 * 
 * // Reglas de negocio
 * const needsAttach = permissionRequiresAttachment(PermissionType.MEDICAL)
 * const maxDays = MAX_DAYS_BY_TYPE[PermissionType.PERSONAL]  // 5
 * 
 * ============================================================================
 * EJEMPLO 5: Sidebar y Navegación
 * ============================================================================
 * 
 * import {
 *   NAV_ITEMS,
 *   getNavItemsByRole,
 *   getNavItemById,
 *   isNavItemAvailable,
 *   SIDEBAR_CONFIG
 * } from '@/constants'
 * 
 * // Obtener items del sidebar para un rol
 * const navItems = getNavItemsByRole(EmployeeRole.ADMIN)
 * 
 * // Renderizar navegación
 * navItems.forEach((item) => {
 *   if (isNavItemAvailable(item, userRole)) {
 *     const Icon = item.icon
 *     return (
 *       <a href={item.href} key={item.id}>
 *         <Icon className={SIDEBAR_CONFIG.ICON_SIZE} />
 *         {item.label}
 *       </a>
 *     )
 *   }
 * })
 * 
 * ============================================================================
 * VENTAJAS
 * ============================================================================
 * 
 * ✅ Single Source of Truth - Una única ubicación para cada configuración
 * ✅ Sin Magic Strings - Evita strings hardcodeados en el código
 * ✅ Reutilizable - Acceso desde cualquier componente o servicio
 * ✅ Tipo-seguro - TypeScript valida el acceso a constantes
 * ✅ Fácil de mantener - Cambios centralizados
 * ✅ Escalable - Fácil agregar nuevas configuraciones
 * ✅ Testing - Fácil de mockear en tests
 * ✅ Consistencia - Mismo formato y estructura en toda la app
 * 
 * ============================================================================
 * PATRONES COMUNES
 * ============================================================================
 * 
 * // Patrón 1: Badge con color correcto
 * <Badge variant={ROLE_META[role].badgeVariant}>
 *   {getRoleLabel(role)}
 * </Badge>
 * 
 * // Patrón 2: Navegar según rol
 * const navItems = getNavItemsByRole(userRole)
 * navItems.forEach(item => handleNavigation(item.href))
 * 
 * // Patrón 3: Validar acción permitida
 * if (canAccessRoute(userRole, nextRoute)) {
 *   router.push(nextRoute)
 * }
 * 
 * // Patrón 4: Mostrar información contextual
 * <div className={PERMISSION_TYPE_META[type].bgColor}>
 *   <span>{getPermissionTypeLabel(type)}</span>
 * </div>
 * 
 * // Patrón 5: Validar reglas de negocio
 * if (permissionRequiresManagerApproval(permissionType)) {
 *   submitToManager()
 * }
 * 
 * ============================================================================
 * QÚEÉ ARCHIVOS INCLUYEN
 * ============================================================================
 * 
 * roles.ts:
 * - ROLE_META: Metadatos de cada rol (label, color, permisos)
 * - AVAILABLE_ROLES: Lista de todos los roles
 * - APPROVAL_ROLES: Roles que pueden aprobar
 * - Funciones helper: getRoleLabel, isAdminRole, canApprovePermissions, etc.
 * 
 * statuses.ts:
 * - EMPLOYEE_STATUS_META: Estados de empleados con colores y badges
 * - PERMISSION_STATUS_META: Estados de permisos
 * - ACTIVE_EMPLOYEE_STATUSES: Estados activos
 * - FINAL_PERMISSION_STATUSES: Estados terminales de permisos
 * - Funciones helper: getEmployeeStatusLabel, isEmployeeActive, etc.
 * 
 * permissions.ts:
 * - PERMISSION_TYPE_META: Tipos de permisos con metadata
 * - AVAILABLE_PERMISSION_TYPES: Lista ordenada de tipos
 * - MAX_DAYS_BY_TYPE: Límite de días por tipo
 * - REQUIRES_ATTACHMENT: Qué tipos necesitan documento
 * - REQUIRES_MANAGER_APPROVAL: Qué tipos necesitan aprobación
 * - Funciones helper: getPermissionTypeLabel, permissionRequiresAttachment, etc.
 * 
 * routes.ts:
 * - PUBLIC_ROUTES: Rutas sin autenticación (/login, /register)
 * - APP_ROUTES: Rutas de aplicación (/dashboard, /employees, etc.)
 * - ROUTES_BY_ROLE: Rutas accesibles por cada rol
 * - ROLE_RESTRICTED_ROUTES: Rutas con restricción de rol
 * - Funciones helper: getAccessibleRoutes, canAccessRoute, isRouteDisabled, etc.
 * 
 * sidebar.ts:
 * - NAV_ITEMS: Lista de items del sidebar
 * - SIDEBAR_CONFIG: Configuración visual (colores, anchos, etc)
 * - Funciones helper: getNavItemsByRole, isNavItemAvailable, etc.
 * 
 * ============================================================================
 * CUÁNDO AGREGAR NUEVAS CONSTANTES
 * ============================================================================
 * 
 * Agrega una constante cuando:
 * - Mismo valor se usa en múltiples lugares
 * - String o número hardcodeado en componentes
 * - Configuración que puede cambiar (colores, límites, etc)
 * - Opciones de un select o radio button
 * - Etiquetas o labels que se repiten
 * - URLs o rutas hardcodeadas
 * - Valores que necesitan validación o reglas de negocio
 * 
 * ============================================================================
 * MIGRACIÓN PROGRESIVA
 * ============================================================================
 * 
 * No necesitas cambiar todo el código existente de una vez.
 * Las constantes están listas para usar inmediatamente en código nuevo.
 * 
 * Plan de migración recomendado:
 * 1. Usar constantes en código nuevo
 * 2. Actualizar componentes existentes gradualmente
 * 3. Cuando refactorices un componente, reemplaza strings con constantes
 * 4. Prioriza componentes compartidos y de uso frecuente
 * 
 */
