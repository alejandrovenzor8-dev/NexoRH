export enum PermissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export enum PermissionType {
  VACATION = 'Vacaciones',
  PERSONAL = 'Permiso personal',
  MEDICAL = 'Incapacidad',
  REMOTE = 'Home office',
}

export interface PermissionAttachment {
  id: string
  name: string
  size: string
}

export interface PermissionApprovalEvent {
  id: string
  actor: string
  action: string
  date: string
}

export interface PermissionTimelineItem {
  id: string
  title: string
  description: string
  date: string
  tone: 'blue' | 'green' | 'amber' | 'gray'
}

export interface Permission {
  id: string
  employeeId: string
  employeeName: string
  employeeEmail: string
  department: string
  type: PermissionType
  startDate: string
  endDate: string
  duration: number
  status: PermissionStatus
  manager: string
  updatedAt: string
  reason: string
  comments: string[]
  attachments: PermissionAttachment[]
  approvalHistory: PermissionApprovalEvent[]
  timeline: PermissionTimelineItem[]
}

export interface CreatePermissionDto {
  employeeId: string
  type: PermissionType
  startDate: string
  endDate: string
  reason: string
}

export interface ApprovalPayload {
  permissionId: string
  action: 'approve' | 'reject' | 'cancel'
  comment?: string
}

export type PermissionRequest = Permission
