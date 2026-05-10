export enum NotificationType {
  NEW_REQUEST = 'new_request',
  REQUEST_APPROVED = 'request_approved',
  REQUEST_REJECTED = 'request_rejected',
  NEW_MESSAGE = 'new_message',
  RECRUITMENT = 'recruitment',
}

export interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string
  createdAt: string
  read: boolean
  href?: string
}

export interface NotificationTypeMeta {
  label: string
  accent: string
  subtleBg: string
}

export type NotificationTypeMetaMap = Record<NotificationType, NotificationTypeMeta>
