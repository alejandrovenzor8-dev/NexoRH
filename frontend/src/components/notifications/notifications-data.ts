import {
  Notification,
  NotificationType,
  NotificationTypeMetaMap,
} from '@/types/notification'
import { EmployeeRole } from '@/types/employee'

export type InAppNotification = Notification
export { NotificationType } from '@/types/notification'

export const NOTIFICATION_TYPE_META: NotificationTypeMetaMap = {
  [NotificationType.NEW_REQUEST]: {
    label: 'Nueva solicitud',
    accent: 'text-blue-600',
    subtleBg: 'bg-blue-50',
  },
  [NotificationType.REQUEST_APPROVED]: {
    label: 'Solicitud aprobada',
    accent: 'text-emerald-600',
    subtleBg: 'bg-emerald-50',
  },
  [NotificationType.REQUEST_REJECTED]: {
    label: 'Solicitud rechazada',
    accent: 'text-rose-600',
    subtleBg: 'bg-rose-50',
  },
  [NotificationType.NEW_MESSAGE]: {
    label: 'Nuevo mensaje',
    accent: 'text-indigo-600',
    subtleBg: 'bg-indigo-50',
  },
  [NotificationType.RECRUITMENT]: {
    label: 'Reclutamiento',
    accent: 'text-amber-600',
    subtleBg: 'bg-amber-50',
  },
}

export function formatRelativeMinutes(isoDate: string): string {
  const date = new Date(isoDate).getTime()
  const diffMs = Date.now() - date
  const minutes = Math.max(1, Math.floor(diffMs / 60000))

  if (minutes < 60) return `Hace ${minutes} min`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `Hace ${hours} h`

  const days = Math.floor(hours / 24)
  return `Hace ${days} d`
}

export function getSeedNotifications(role?: EmployeeRole): InAppNotification[] {
  const base: InAppNotification[] = [
    {
      id: 'notif-1',
      type: NotificationType.NEW_REQUEST,
      title: 'Nueva solicitud de permiso',
      body: 'Carlos Mendez envio una solicitud de vacaciones.',
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      read: false,
      href: '/permissions',
    },
    {
      id: 'notif-2',
      type: NotificationType.REQUEST_APPROVED,
      title: 'Solicitud aprobada',
      body: 'Tu solicitud de dia personal fue aprobada por RRHH.',
      createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
      read: false,
      href: '/permissions',
    },
    {
      id: 'notif-3',
      type: NotificationType.REQUEST_REJECTED,
      title: 'Solicitud rechazada',
      body: 'La solicitud de ausencia del 12/05 requiere ajustes.',
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      read: true,
      href: '/permissions',
    },
    {
      id: 'notif-4',
      type: NotificationType.NEW_MESSAGE,
      title: 'Nuevo mensaje de Operaciones',
      body: 'Tienes un mensaje pendiente en el canal interno.',
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      read: false,
      href: '/dashboard',
    },
    {
      id: 'notif-5',
      type: NotificationType.RECRUITMENT,
      title: 'Nuevo candidato aplicado',
      body: 'Se registro una postulacion para Frontend Developer.',
      createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      read: true,
      href: '/dashboard',
    },
  ]

  if (role === EmployeeRole.USER) {
    return base.filter((n) => n.type !== NotificationType.RECRUITMENT && n.type !== NotificationType.NEW_REQUEST)
  }

  if (role === EmployeeRole.MANAGER) {
    return base.filter((n) => n.type !== NotificationType.RECRUITMENT)
  }

  return base
}
