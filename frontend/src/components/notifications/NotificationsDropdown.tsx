'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell,
  BriefcaseBusiness,
  Check,
  CheckCheck,
  CheckCircle2,
  FilePlus2,
  MessageSquare,
  XCircle,
} from 'lucide-react'
import {
  formatRelativeMinutes,
  getSeedNotifications,
  InAppNotification,
  NOTIFICATION_TYPE_META,
} from './notifications-data'
import { NotificationType } from '@/types/notification'
import { EmployeeRole } from '@/types/employee'

interface NotificationsDropdownProps {
  role?: EmployeeRole
}

const GROUP_ORDER: NotificationType[] = [
  NotificationType.NEW_REQUEST,
  NotificationType.REQUEST_APPROVED,
  NotificationType.REQUEST_REJECTED,
  NotificationType.NEW_MESSAGE,
  NotificationType.RECRUITMENT,
]

const TYPE_ICONS: Record<NotificationType, React.ElementType> = {
  [NotificationType.NEW_REQUEST]: FilePlus2,
  [NotificationType.REQUEST_APPROVED]: CheckCircle2,
  [NotificationType.REQUEST_REJECTED]: XCircle,
  [NotificationType.NEW_MESSAGE]: MessageSquare,
  [NotificationType.RECRUITMENT]: BriefcaseBusiness,
}

export default function NotificationsDropdown({ role }: NotificationsDropdownProps) {
  const router = useRouter()
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<InAppNotification[]>(() => getSeedNotifications(role))

  useEffect(() => {
    setNotifications(getSeedNotifications(role))
  }, [role])

  useEffect(() => {
    if (!open) return

    const onMouseDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (panelRef.current?.contains(target)) return
      if (buttonRef.current?.contains(target)) return
      setOpen(false)
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onEscape)

    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onEscape)
    }
  }, [open])

  const unreadCount = notifications.filter((n) => !n.read).length

  const grouped = useMemo(() => {
    const bucket: Partial<Record<NotificationType, InAppNotification[]>> = {}

    for (const item of notifications) {
      bucket[item.type] = bucket[item.type] ?? []
      bucket[item.type]!.push(item)
    }

    for (const type of GROUP_ORDER) {
      bucket[type]?.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    }

    return bucket
  }, [notifications])

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })))
  }

  const handleNotificationClick = (notification: InAppNotification) => {
    markAsRead(notification.id)
    setOpen(false)

    if (notification.href) {
      router.push(notification.href)
    }
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
        aria-label="Abrir notificaciones"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-slate-900 text-white text-[10px] leading-[18px] text-center px-1 font-semibold shadow-md animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full mt-2 w-[360px] max-w-[calc(100vw-1.5rem)] bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden origin-top-right animate-[fadeIn_.16s_ease-out]"
        >
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">Notificaciones</p>
              <p className="text-xs text-gray-500">Actividad reciente de NexoRH</p>
            </div>
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Marcar todo
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto p-2 space-y-2">
            {GROUP_ORDER.map((type) => {
              const groupItems = grouped[type] ?? []
              if (groupItems.length === 0) return null

              const meta = NOTIFICATION_TYPE_META[type]
              const Icon = TYPE_ICONS[type]

              return (
                <section key={type} className="rounded-xl border border-gray-100 overflow-hidden">
                  <header className="flex items-center justify-between px-3 py-2 bg-gray-50/80 border-b border-gray-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-6 h-6 rounded-md ${meta.subtleBg} flex items-center justify-center`}>
                        <Icon className={`w-3.5 h-3.5 ${meta.accent}`} />
                      </span>
                      <p className="text-xs font-semibold text-gray-700 truncate">{meta.label}</p>
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium">{groupItems.length}</span>
                  </header>

                  <ul className="divide-y divide-gray-100">
                    {groupItems.map((notification) => (
                      <li key={notification.id}>
                        <button
                          onClick={() => handleNotificationClick(notification)}
                          className={`w-full text-left px-3 py-2.5 transition-colors duration-200 hover:bg-gray-50 ${
                            notification.read ? 'bg-white' : 'bg-slate-50/70'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span
                              className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                                notification.read ? 'bg-gray-200' : 'bg-slate-900'
                              }`}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className={`text-xs truncate ${notification.read ? 'text-gray-700' : 'text-gray-900 font-semibold'}`}>
                                  {notification.title}
                                </p>
                                <span className="text-[10px] text-gray-500 shrink-0">
                                  {formatRelativeMinutes(notification.createdAt)}
                                </span>
                              </div>
                              <p className="mt-0.5 text-[11px] text-gray-500 line-clamp-2">{notification.body}</p>
                            </div>
                            {!notification.read && (
                              <span
                                onClick={(event) => {
                                  event.stopPropagation()
                                  markAsRead(notification.id)
                                }}
                                className="mt-0.5 w-5 h-5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors"
                                role="button"
                                aria-label="Marcar como leido"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )
            })}

            {notifications.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center bg-gray-50/60">
                <p className="text-sm font-medium text-gray-700">Sin notificaciones</p>
                <p className="text-xs text-gray-500 mt-1">Cuando ocurra actividad nueva, la veras aqui.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
