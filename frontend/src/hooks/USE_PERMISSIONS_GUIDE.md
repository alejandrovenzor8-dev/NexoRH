/**
 * GUÍA DE USO: usePermissions Hook
 * 
 * El hook `usePermissions` centraliza toda la lógica de solicitudes de permisos.
 * Proporciona: datos, filtrado, búsqueda, paginación, y operaciones de aprobación.
 * 
 * ============================================================================
 * IMPORTACIÓN
 * ============================================================================
 * 
 * import { usePermissions } from '@/hooks'
 * 
 * ============================================================================
 * USO BÁSICO
 * ============================================================================
 * 
 * 'use client'
 * 
 * import { usePermissions } from '@/hooks'
 * 
 * export function PermissionsPage() {
 *   const {
 *     permissions,           // PermissionRequest[] - solicitudes paginadas
 *     loading,               // boolean - estado de carga
 *     error,                 // string | null - mensaje de error
 *     pagination,            // { page, pageSize, total, totalPages }
 *     filters,               // PermissionFilters - filtros actuales
 *     search,                // string - término de búsqueda actual
 *     departmentOptions,     // string[] - departamentos disponibles
 *     fetchPermissions,      // () => Promise<void> - obtener solicitudes (fetch inicial)
 *     refetch,               // () => Promise<void> - refetch manual
 *     approvePermission,     // (id: string, comment?: string) => Promise<void>
 *     rejectPermission,      // (id: string, comment?: string) => Promise<void>
 *     cancelPermission,      // (id: string, comment?: string) => Promise<void>
 *     setFilters,            // (next: PermissionFilters) => void
 *     setSearch,             // (query: string) => void
 *     setPage,               // (page: number) => void
 *   } = usePermissions()
 * 
 *   if (loading) return <div>Cargando...</div>
 *   if (error) return <div>Error: {error}</div>
 * 
 *   return (
 *     <div>
 *       <PermissionFilters
 *         filters={filters}
 *         search={search}
 *         onFiltersChange={setFilters}
 *         onSearchChange={setSearch}
 *       />
 * 
 *       <PermissionsTable permissions={permissions} />
 * 
 *       <Pagination
 *         current={pagination.page}
 *         total={pagination.totalPages}
 *         onChange={setPage}
 *       />
 *     </div>
 *   )
 * }
 * 
 * ============================================================================
 * OPERACIONES DE APROBACIÓN
 * ============================================================================
 * 
 * // APROBAR SOLICITUD
 * const handleApprove = async (permissionId: string) => {
 *   try {
 *     await approvePermission(permissionId, 'Se aprueba la solicitud')
 *     showSuccessToast('Solicitud aprobada exitosamente')
 *   } catch (err) {
 *     showErrorToast(err.message)
 *   }
 * }
 * 
 * // RECHAZAR SOLICITUD
 * const handleReject = async (permissionId: string) => {
 *   try {
 *     await rejectPermission(permissionId, 'No es posible aprobar en este momento')
 *     showSuccessToast('Solicitud rechazada')
 *   } catch (err) {
 *     showErrorToast(err.message)
 *   }
 * }
 * 
 * // CANCELAR SOLICITUD
 * const handleCancel = async (permissionId: string) => {
 *   try {
 *     await cancelPermission(permissionId, 'Cancelado por solicitud del empleado')
 *     showSuccessToast('Solicitud cancelada')
 *   } catch (err) {
 *     showErrorToast(err.message)
 *   }
 * }
 * 
 * ============================================================================
 * FILTRADO Y BÚSQUEDA
 * ============================================================================
 * 
 * // Cambiar filtros
 * setFilters({
 *   query: '',
 *   status: PermissionStatus.PENDING,     // o 'all'
 *   type: PermissionType.VACATION,       // o 'all'
 *   department: 'Tecnologia',            // o 'all'
 *   date: '',                            // fecha ISO para filtrar por rango
 *   sort: 'updated-desc'                 // 'updated-asc' | 'updated-desc' | 'start-asc' | 'start-desc'
 * })
 * 
 * // Buscar por nombre o email del empleado
 * setSearch('Juan')
 * 
 * ============================================================================
 * PAGINACIÓN
 * ============================================================================
 * 
 * // Cambiar página
 * setPage(2)
 * 
 * // Información de paginación
 * console.log(pagination.page)        // página actual (1-indexed)
 * console.log(pagination.pageSize)    // 8 solicitudes por página
 * console.log(pagination.total)       // total de solicitudes filtradas
 * console.log(pagination.totalPages)  // total de páginas
 * 
 * ============================================================================
 * MANEJO DE ERRORES
 * ============================================================================
 * 
 * // El hook maneja automáticamente:
 * // - Errores de autenticación (redirige a login)
 * // - Errores de API (disponibles en el estado 'error')
 * // - Validación de datos
 * 
 * if (error) {
 *   return <ErrorAlert message={error} onRetry={refetch} />
 * }
 * 
 * ============================================================================
 * REFETCH MANUAL
 * ============================================================================
 * 
 * // Obtener datos nuevamente desde la API
 * const handleRefresh = async () => {
 *   await refetch()
 * }
 * 
 * ============================================================================
 * CARACTERÍSTICAS
 * ============================================================================
 * 
 * ✅ TypeScript estricto - Sin 'any', totalmente tipado
 * ✅ Autenticación - Obtiene token de localStorage automáticamente
 * ✅ Control de acceso - ADMIN ve todo, MANAGER ve su departamento, USER ve propias
 * ✅ Búsqueda completa - Busca en nombre y email del empleado
 * ✅ Filtrado múltiple - Estado, tipo, departamento, fecha, orden
 * ✅ Paginación - 8 solicitudes por página (configurable)
 * ✅ Manejo de errores - Captura y reporta errores automáticamente
 * ✅ Loading states - Estados de carga claros
 * ✅ Refetch - Actualizar datos en cualquier momento
 * ✅ Memoización - Optimizado para re-renders
 * ✅ Escalable - Fácil de extender con nuevas operaciones
 * ✅ Independiente de UI - Lógica pura sin componentes
 * ✅ Operaciones completas - Aprobar, rechazar, cancelar con comentarios opcionales
 * 
 * ============================================================================
 * FILTRADO POR ESTADO
 * ============================================================================
 * 
 * // Estados disponibles
 * - PermissionStatus.PENDING     'pending'   - Pendiente de aprobación
 * - PermissionStatus.APPROVED    'approved'  - Aprobada
 * - PermissionStatus.REJECTED    'rejected'  - Rechazada
 * - PermissionStatus.CANCELLED   'cancelled' - Cancelada
 * 
 * ============================================================================
 * FILTRADO POR TIPO DE PERMISO
 * ============================================================================
 * 
 * // Tipos disponibles
 * - PermissionType.VACATION      'Vacaciones'        - Solicitud de vacaciones
 * - PermissionType.PERSONAL      'Permiso personal'  - Permiso personal
 * - PermissionType.MEDICAL       'Incapacidad'       - Incapacidad/reposo médico
 * - PermissionType.REMOTE        'Home office'       - Trabajo remoto
 * 
 * ============================================================================
 * INTEGRACIÓN CON COMPONENTES EXISTENTES
 * ============================================================================
 * 
 * El hook está diseñado para funcionar con:
 * - PermissionFilters: Pasa setFilters y setSearch
 * - PermissionsTable: Pasa permissions y funciones de acción
 * - Pagination: Pasa pagination y setPage
 * - Modales de aprobación/rechazo: Usa refetch después de operaciones
 * 
 * ============================================================================
 * CONTROL DE ACCESO BASADO EN ROLES
 * ============================================================================
 * 
 * El hook automáticamente filtra solicitudes basado en el rol:
 * 
 * ADMIN:
 * - Ve todas las solicitudes del sistema
 * - Puede aprobar/rechazar cualquier solicitud
 * 
 * MANAGER:
 * - Ve solo solicitudes de su departamento
 * - Puede aprobar/rechazar solicitudes de su departamento
 * 
 * USER:
 * - Ve solo sus propias solicitudes
 * - Solo ve historial de sus solicitudes (no puede aprobar)
 * 
 * ============================================================================
 * API ENDPOINTS REQUERIDOS (Para integración completa)
 * ============================================================================
 * 
 * El hook está listo para integración completa cuando estén disponibles:
 * 
 * GET    /api/permissions              - Obtener todas las solicitudes
 * POST   /api/permissions/:id/approve  - Aprobar solicitud
 * POST   /api/permissions/:id/reject   - Rechazar solicitud
 * POST   /api/permissions/:id/cancel   - Cancelar solicitud
 * 
 * Busca las líneas con "TODO:" en el archivo usePermissions.ts para ver
 * dónde agregar las llamadas a estos endpoints.
 * 
 */
