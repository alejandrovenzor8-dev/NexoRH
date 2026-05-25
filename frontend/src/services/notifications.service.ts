/**
 * Notifications Service - Capa de servicios para operaciones con notificaciones
 * Encapsula toda la lógica de API relacionada con notificaciones globales
 */

import { BaseService } from './base.service'
import { Notification } from '@/types/notification'

/**
 * Servicio empresarial para operaciones con notificaciones
 * Proporciona métodos para obtener, marcar como leída y gestionar notificaciones
 */
export class NotificationsService extends BaseService {
  /**
   * Obtener todas las notificaciones del usuario
   * GET /api/notifications
   */
  async getNotifications(): Promise<Notification[]> {
    return this.get<Notification[]>('/notifications')
  }

  /**
   * Marcar una notificación como leída
   * PATCH /api/notifications/:id/read
   */
  async markAsRead(notificationId: string): Promise<void> {
    await this.patch(`/notifications/${notificationId}/read`, {})
  }

  /**
   * Marcar una notificación como no leída
   * PATCH /api/notifications/:id/unread
   */
  async markAsUnread(notificationId: string): Promise<void> {
    // TODO: Implementar endpoint en backend si es necesario
    console.warn('markAsUnread not implemented in backend yet')
  }

  /**
   * Marcar todas las notificaciones como leídas
   * PATCH /api/notifications/read-all
   */
  async markAllAsRead(): Promise<void> {
    await this.patch('/notifications/read-all', {})
  }

  /**
   * Eliminar una notificación
   * DELETE /api/notifications/:id
   */
  async deleteNotification(notificationId: string): Promise<void> {
    // TODO: Implementar endpoint en backend si es necesario
    console.warn('deleteNotification not implemented in backend yet')
  }

  /**
   * Limpiar todas las notificaciones
   * DELETE /api/notifications/clear-all
   */
  async clearAllNotifications(): Promise<void> {
    // TODO: Implementar endpoint en backend si es necesario
    console.warn('clearAllNotifications not implemented in backend yet')
  }

  /**
   * Obtener notificaciones no leídas
   * GET /api/notifications?read=false
   */
  async getUnreadNotifications(): Promise<Notification[]> {
    const all = await this.getNotifications()
    return all.filter((n) => !n.read)
  }
}

/**
 * Instancia singleton del servicio de notificaciones
 */
export const notificationsService = new NotificationsService()
  }

  /**
   * Obtener notificaciones leídas
   * 
   * @returns Notificaciones leídas
   * 
   * TODO: Implementar cuando API esté disponible
   * GET /api/notifications?read=true
   */
  async getReadNotifications(): Promise<Notification[]> {
    // TODO: Reemplazar con búsqueda en API cuando esté disponible
    const all = await this.getNotifications()
    return all.filter((n) => n.read)
  }

  /**
   * Obtener contador de no leídas
   * 
   * @returns Cantidad de notificaciones sin leer
   */
  async getUnreadCount(): Promise<number> {
    // TODO: Optimizar con endpoint específico cuando API esté disponible
    // GET /api/notifications/unread/count
    const unread = await this.getUnreadNotifications()
    return unread.length
  }
}

/**
 * Instancia singleton del servicio de notificaciones
 */
export const notificationsService = new NotificationsService()
