/**
 * GUÍA DE USO: useNotifications Hook Global
 * 
 * El hook `useNotifications` centraliza toda la lógica de notificaciones.
 * Proporciona: lectura, marcado, agrupación, y preparación para tiempo real.
 * 
 * ============================================================================
 * IMPORTACIÓN
 * ============================================================================
 * 
 * import { useNotifications, useRealtimeNotifications } from '@/hooks'
 * 
 * ============================================================================
 * USO BÁSICO
 * ============================================================================
 * 
 * 'use client'
 * 
 * import { useNotifications } from '@/hooks'
 * import { EmployeeRole } from '@/types/employee'
 * 
 * export function NotificationsPanel() {
 *   const {
 *     notifications,       // Notification[] - todas las notificaciones
 *     unreadCount,        // number - total no leídas
 *     stats,              // NotificationStats - estadísticas
 *     grouped,            // GroupedNotifications - agrupadas por tipo
 *     groupOrder,         // NotificationType[] - orden de grupos
 *     loading,            // boolean
 *     error,              // string | null
 *     markAsRead,         // (id: string) => void
 *     markAllAsRead,      // () => void
 *     deleteNotification, // (id: string) => void
 *     getRelativeTime,    // (isoDate: string) => string
 *     hasUnread,          // boolean
 *   } = useNotifications(EmployeeRole.ADMIN) // Rol opcional
 * 
 *   if (loading) return <div>Cargando notificaciones...</div>
 *   if (error) return <div>Error: {error}</div>
 * 
 *   return (
 *     <div>
 *       <Badge>{unreadCount} no leídas</Badge>
 *       
 *       {groupOrder.map((type) => (
 *         <div key={type}>
 *           {grouped[type]?.map((notif) => (
 *             <div
 *               key={notif.id}
 *               onClick={() => markAsRead(notif.id)}
 *               className={notif.read ? 'opacity-60' : 'font-bold'}
 *             >
 *               {notif.title}
 *               <span className="text-sm text-gray-500">
 *                 {getRelativeTime(notif.createdAt)}
 *               </span>
 *             </div>
 *           ))}
 *         </div>
 *       ))}
 *     </div>
 *   )
 * }
 * 
 * ============================================================================
 * OPERACIONES DE LECTURA
 * ============================================================================
 * 
 * // Marcar una notificación como leída
 * const handleNotificationClick = (notificationId: string) => {
 *   markAsRead(notificationId)
 * }
 * 
 * // Marcar todas como leídas
 * const handleMarkAllAsRead = () => {
 *   markAllAsRead()
 * }
 * 
 * // Marcar como no leída (para releer)
 * const handleUnread = (notificationId: string) => {
 *   markAsUnread(notificationId)
 * }
 * 
 * // Eliminar una notificación
 * const handleDelete = (notificationId: string) => {
 *   deleteNotification(notificationId)
 * }
 * 
 * // Limpiar todas las notificaciones
 * const handleClearAll = () => {
 *   clearAllNotifications()
 * }
 * 
 * ============================================================================
 * CONTADOR DE NO LEÍDAS
 * ============================================================================
 * 
 * // Obtener total de no leídas
 * const unreadTotal = unreadCount
 * 
 * // Obtener no leídas por tipo
 * const unreadRequests = stats.unreadByType[NotificationType.NEW_REQUEST]
 * const unreadApprovals = stats.unreadByType[NotificationType.REQUEST_APPROVED]
 * 
 * // Mostrar badge solo si hay no leídas
 * if (hasUnread) {
 *   return <Badge variant="danger">{unreadCount}</Badge>
 * }
 * 
 * ============================================================================
 * AGRUPACIÓN POR TIPO
 * ============================================================================
 * 
 * // Iterar grupos en orden correcto
 * groupOrder.forEach((type) => {
 *   const groupNotifications = grouped[type]
 *   console.log(`${type}: ${groupNotifications?.length || 0} notificaciones`)
 * })
 * 
 * // Acceder a un grupo específico
 * const newRequests = grouped[NotificationType.NEW_REQUEST] || []
 * const approvedRequests = grouped[NotificationType.REQUEST_APPROVED] || []
 * 
 * // Obtener total de notificaciones
 * const total = stats.total
 * 
 * ============================================================================
 * TIEMPO RELATIVO
 * ============================================================================
 * 
 * // Formato: "Hace X min", "Hace X h", "Hace X d"
 * const relativeTime = getRelativeTime('2026-05-09T15:30:00Z')
 * // Retorna: "Hace 5 min", "Hace 2 h", "Hace 1 d", etc.
 * 
 * // Usar en componentes
 * <span className="text-sm text-gray-500">
 *   {getRelativeTime(notification.createdAt)}
 * </span>
 * 
 * ============================================================================
 * TIPOS DE NOTIFICACIONES SOPORTADAS
 * ============================================================================
 * 
 * - NotificationType.NEW_REQUEST       - Nueva solicitud de permiso
 * - NotificationType.REQUEST_APPROVED  - Solicitud aprobada
 * - NotificationType.REQUEST_REJECTED  - Solicitud rechazada
 * - NotificationType.NEW_MESSAGE       - Nuevo mensaje
 * - NotificationType.RECRUITMENT       - Nuevos candidatos / Reclutamiento
 * 
 * ============================================================================
 * CONTROL DE ACCESO BASADO EN ROLES
 * ============================================================================
 * 
 * El hook automáticamente filtra notificaciones por rol:
 * 
 * ADMIN:
 * - Ve todas las notificaciones
 * 
 * MANAGER:
 * - Ve notificaciones de su departamento
 * - No ve notificaciones de reclutamiento
 * 
 * USER:
 * - Ve solo notificaciones relevantes
 * - No ve solicitudes de nuevas personas
 * - No ve notificaciones de reclutamiento
 * 
 * ============================================================================
 * ESTADÍSTICAS DISPONIBLES
 * ============================================================================
 * 
 * const stats = {
 *   total: 15,                                          // Total de notificaciones
 *   unread: 3,                                          // Total no leídas
 *   unreadByType: {
 *     'new_request': 1,
 *     'request_approved': 2,
 *     'request_rejected': 0,
 *     'new_message': 0,
 *     'recruitment': 0
 *   }
 * }
 * 
 * ============================================================================
 * NOTIFICACIONES EN TIEMPO REAL (Futuro)
 * ============================================================================
 * 
 * // Hook preparado para WebSocket/SSE
 * export function useRealtimeNotifications(
 *   onNotification?: (notification: Notification) => void
 * ): {
 *   isConnected: boolean
 *   error: string | null
 *   disconnect: () => void
 * }
 * 
 * // Uso futuro:
 * // const { isConnected, error } = useRealtimeNotifications((newNotif) => {
 * //   refetchNotifications()
 * // })
 * 
 * ============================================================================
 * MANEJO DE ERRORES
 * ============================================================================
 * 
 * // El hook maneja automáticamente errores
 * if (error) {
 *   return (
 *     <ErrorAlert message={error} />
 *   )
 * }
 * 
 * ============================================================================
 * CARACTERÍSTICAS
 * ============================================================================
 * 
 * ✅ TypeScript estricto - Sin 'any', totalmente tipado
 * ✅ Lectura persistente - Marcar como leída se persiste
 * ✅ Contador en tiempo real - actualización instantánea
 * ✅ Agrupación automática - Organizadas por tipo
 * ✅ Tiempo relativo - Formato legible ("Hace 5 min")
 * ✅ Control de acceso - Filtra por rol automáticamente
 * ✅ Estadísticas completas - Detalles de unread por tipo
 * ✅ Operaciones masivas - Marcar todo como leído
 * ✅ Independiente de UI - Lógica pura sin componentes
 * ✅ Preparado para realtime - Estructura lista para WebSocket/SSE
 * ✅ Sin dependencias externas - Solo React hooks nativos
 * ✅ Escalable - Fácil de extender
 * 
 * ============================================================================
 * API ENDPOINTS REQUERIDOS (Para integración completa)
 * ============================================================================
 * 
 * El hook está listo para integración completa cuando estén disponibles:
 * 
 * GET    /api/notifications           - Obtener todas las notificaciones
 * PATCH  /api/notifications/:id/read  - Marcar como leída
 * PATCH  /api/notifications/read-all  - Marcar todas como leídas
 * PATCH  /api/notifications/:id/unread - Marcar como no leída
 * DELETE /api/notifications/:id       - Eliminar notificación
 * DELETE /api/notifications/clear-all - Limpiar todas
 * 
 * Busca las líneas con "TODO:" en el archivo useNotifications.ts para ver
 * dónde agregar las llamadas a estos endpoints.
 * 
 * ============================================================================
 * WEBSOCKET/SSE PARA NOTIFICACIONES EN TIEMPO REAL
 * ============================================================================
 * 
 * Futuro:
 * - Conexión WebSocket a ws://localhost:3001/notifications
 * - Enviar token en parámetro de query o header
 * - Formato de mensaje: { type, id, title, body, createdAt }
 * - Cerrar conexión al desmontar componente
 * - Reintentar conexión con backoff exponencial
 * 
 */
