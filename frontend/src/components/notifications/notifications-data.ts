export type NotificationType =
  | 'new_request'
  | 'request_approved'
  | 'request_rejected'
  | 'new_message'
  | 'recruitment'

export interface InAppNotification {
  id: string
  type: NotificationType
  title: string
  body: string
  createdAt: string
  read: boolean
  href?: string
}

export const NOTIFICATION_TYPE_META: Record<
  NotificationType,
  { label: string; accent: string; subtleBg: string }
> = {
  new_request: {
    label: 'Nueva solicitud',
    accent: 'text-blue-600',
    subtleBg: 'bg-blue-50',
  },
  request_approved: {
    label: 'Solicitud aprobada',
    accent: 'text-emerald-600',
    subtleBg: 'bg-emerald-50',
  },
  request_rejected: {
    label: 'Solicitud rechazada',
    accent: 'text-rose-600',
    subtleBg: 'bg-rose-50',
  },
  new_message: {
    label: 'Nuevo mensaje',
    accent: 'text-indigo-600',
    subtleBg: 'bg-indigo-50',
  },
  recruitment: {
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

export function getSeedNotifications(role?: string): InAppNotification[] {
  const base: InAppNotification[] = [
    {
      id: 'notif-1',
      type: 'new_request',
      title: 'Nueva solicitud de permiso',
      body: 'Carlos Mendez envio una solicitud de vacaciones.',
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      read: false,
      href: '/permissions',
    },
    {
      id: 'notif-2',
      type: 'request_approved',
      title: 'Solicitud aprobada',
      body: 'Tu solicitud de dia personal fue aprobada por RRHH.',
      createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
      read: false,
      href: '/permissions',
    },
    {
      id: 'notif-3',
      type: 'request_rejected',
      title: 'Solicitud rechazada',
      body: 'La solicitud de ausencia del 12/05 requiere ajustes.',
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      read: true,
      href: '/permissions',
    },
    {
      id: 'notif-4',
      type: 'new_message',
      title: 'Nuevo mensaje de Operaciones',
      body: 'Tienes un mensaje pendiente en el canal interno.',
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      read: false,
      href: '/dashboard',
    },
    {
      id: 'notif-5',
      type: 'recruitment',
      title: 'Nuevo candidato aplicado',
      body: 'Se registro una postulacion para Frontend Developer.',
      createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      read: true,
      href: '/dashboard',
    },
  ]

  if (role === 'USER') {
    return base.filter((n) => n.type !== 'recruitment' && n.type !== 'new_request')
  }

  if (role === 'MANAGER') {
    return base.filter((n) => n.type !== 'recruitment')
  }

  return base
}
