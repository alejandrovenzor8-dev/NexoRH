'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Notification, NotificationType } from '@/types/notification'
import { EmployeeRole } from '@/types/employee'
import { formatRelativeMinutes } from '@/components/notifications/notifications-data'

/**
 * Grouped notifications organized by type
 */
interface GroupedNotifications {
  [key: string]: Notification[]
}

/**
 * Notification statistics
 */
interface NotificationStats {
  total: number
  unread: number
  unreadByType: Record<NotificationType, number>
}

export interface UseNotificationsReturn {
  // Data state
  notifications: Notification[]
  loading: boolean
  error: string | null

  // Statistics
  unreadCount: number
  stats: NotificationStats

  // Grouped view
  grouped: GroupedNotifications
  groupOrder: NotificationType[]

  // Operations
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  markAsUnread: (notificationId: string) => void
  deleteNotification: (notificationId: string) => void
  clearAllNotifications: () => void

  // Utilities
  getRelativeTime: (isoDate: string) => string
  hasUnread: boolean

  // Future realtime API
  subscribe?: (callback: (notification: Notification) => void) => () => void
  unsubscribe?: () => void
}

const GROUP_ORDER: NotificationType[] = [
  NotificationType.NEW_REQUEST,
  NotificationType.REQUEST_APPROVED,
  NotificationType.REQUEST_REJECTED,
  NotificationType.NEW_MESSAGE,
  NotificationType.RECRUITMENT,
]

/**
 * Enterprise-grade global hook for notification management
 * Centralizes all notification operations: fetching, grouping, marking as read
 *
 * Features:
 * - Fetch notifications with role-based filtering
 * - Mark individual/all notifications as read
 * - Group notifications by type
 * - Unread counter and statistics
 * - Relative time formatting (e.g., "Hace 5 min")
 * - Error handling and loading states
 * - Prepared for real-time WebSocket/SSE integration
 * - Role-aware access control
 *
 * @example
 * const {
 *   notifications,
 *   unreadCount,
 *   grouped,
 *   markAsRead,
 *   markAllAsRead,
 *   deleteNotification,
 *   getRelativeTime,
 * } = useNotifications()
 */
export function useNotifications(userRole?: EmployeeRole): UseNotificationsReturn {
  // Data state
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Fetch notifications from API
   */
  const fetchNotifications = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem('token')
      if (!token) {
        setNotifications([])
        return
      }

      // Use real API
      const { notificationsService } = await import('@/services/notifications.service')
      const data = await notificationsService.getNotifications()
      setNotifications(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch notifications'
      setError(errorMessage)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [userRole])

  /**
   * Initialize notifications on mount
   */
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  /**
   * Calculate unread count
   */
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length
  }, [notifications])

  /**
   * Check if there are unread notifications
   */
  const hasUnread = unreadCount > 0

  /**
   * Calculate notification statistics
   */
  const stats = useMemo((): NotificationStats => {
    const unreadByType: Record<NotificationType, number> = {} as Record<NotificationType, number>

    // Initialize all types with 0
    for (const type of GROUP_ORDER) {
      unreadByType[type] = 0
    }

    // Count unread by type
    for (const notif of notifications) {
      if (!notif.read) {
        unreadByType[notif.type] = (unreadByType[notif.type] || 0) + 1
      }
    }

    return {
      total: notifications.length,
      unread: unreadCount,
      unreadByType,
    }
  }, [notifications, unreadCount])

  /**
   * Group notifications by type
   * Sorted by creation date (newest first)
   */
  const grouped = useMemo((): GroupedNotifications => {
    const bucket: Partial<Record<NotificationType, Notification[]>> = {}

    // Group by type
    for (const notif of notifications) {
      bucket[notif.type] = bucket[notif.type] ?? []
      bucket[notif.type]!.push(notif)
    }

    // Sort each group by date (newest first)
    for (const type of GROUP_ORDER) {
      if (bucket[type]) {
        bucket[type]!.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }
    }

    return bucket as GroupedNotifications
  }, [notifications])

  /**
   * Mark a single notification as read
   */
  const markAsRead = useCallback((notificationId: string): void => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif))
    )

    // TODO: Call API to persist read status
    // const token = localStorage.getItem('token')
    // if (!token) return
    // fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
    //   method: 'PATCH',
    //   headers: { Authorization: `Bearer ${token}` }
    // })
  }, [])

  /**
   * Mark all notifications as read
   */
  const markAllAsRead = useCallback((): void => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))

    // TODO: Call API to persist read status for all
    // const token = localStorage.getItem('token')
    // if (!token) return
    // fetch(`${API_URL}/api/notifications/read-all`, {
    //   method: 'PATCH',
    //   headers: { Authorization: `Bearer ${token}` }
    // })
  }, [])

  /**
   * Mark a notification as unread (for re-reading)
   */
  const markAsUnread = useCallback((notificationId: string): void => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === notificationId ? { ...notif, read: false } : notif))
    )

    // TODO: Call API to persist unread status
    // const token = localStorage.getItem('token')
    // if (!token) return
    // fetch(`${API_URL}/api/notifications/${notificationId}/unread`, {
    //   method: 'PATCH',
    //   headers: { Authorization: `Bearer ${token}` }
    // })
  }, [])

  /**
   * Delete a notification
   */
  const deleteNotification = useCallback((notificationId: string): void => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId))

    // TODO: Call API to persist deletion
    // const token = localStorage.getItem('token')
    // if (!token) return
    // fetch(`${API_URL}/api/notifications/${notificationId}`, {
    //   method: 'DELETE',
    //   headers: { Authorization: `Bearer ${token}` }
    // })
  }, [])

  /**
   * Clear all notifications (batch delete)
   */
  const clearAllNotifications = useCallback((): void => {
    setNotifications([])

    // TODO: Call API to clear all notifications
    // const token = localStorage.getItem('token')
    // if (!token) return
    // fetch(`${API_URL}/api/notifications/clear-all`, {
    //   method: 'DELETE',
    //   headers: { Authorization: `Bearer ${token}` }
    // })
  }, [])

  /**
   * Get relative time for display (e.g., "Hace 5 min")
   */
  const getRelativeTime = useCallback((isoDate: string): string => {
    return formatRelativeMinutes(isoDate)
  }, [])

  return {
    // Data state
    notifications,
    loading,
    error,

    // Statistics
    unreadCount,
    stats,

    // Grouped view
    grouped,
    groupOrder: GROUP_ORDER,

    // Operations
    markAsRead,
    markAllAsRead,
    markAsUnread,
    deleteNotification,
    clearAllNotifications,

    // Utilities
    getRelativeTime,
    hasUnread,

    // Future realtime API placeholders
    // subscribe: undefined, // Will be implemented with WebSocket/SSE
    // unsubscribe: undefined,
  }
}

/**
 * Hook for subscribing to real-time notifications
 * Prepare for future WebSocket/SSE integration
 *
 * @example
 * useRealtimeNotifications((newNotification) => {
 *   console.log('New notification:', newNotification)
 *   refetchNotifications()
 * })
 */
export function useRealtimeNotifications(
  onNotification?: (notification: Notification) => void
): {
  isConnected: boolean
  error: string | null
  disconnect: () => void
} {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const disconnect = useCallback((): void => {
    // TODO: Implement WebSocket/SSE disconnection
    // ws.close()
    setIsConnected(false)
  }, [])

  useEffect(() => {
    // TODO: Implement WebSocket/SSE connection
    // const token = localStorage.getItem('token')
    // if (!token) return
    //
    // const ws = new WebSocket(
    //   `${process.env.NEXT_PUBLIC_WS_URL}/notifications?token=${token}`
    // )
    //
    // ws.onopen = () => setIsConnected(true)
    // ws.onerror = () => setError('WebSocket connection failed')
    // ws.onmessage = (event) => {
    //   const notification = JSON.parse(event.data)
    //   onNotification?.(notification)
    // }
    // ws.onclose = () => setIsConnected(false)
    //
    // return () => ws.close()
  }, [onNotification])

  return {
    isConnected,
    error,
    disconnect,
  }
}
