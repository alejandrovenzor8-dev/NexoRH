/**
 * Constantes de estados de empleados y permisos
 * Centraliza definiciones de estados, colores y etiquetas
 */

import { EmployeeStatus } from '@/types/employee'
import { PermissionStatus } from '@/types/permission'

/**
 * Metadatos visuales para estados de empleados
 */
export const EMPLOYEE_STATUS_META: Record<
  EmployeeStatus,
  {
    label: string
    description: string
    color: string
    bgColor: string
    badgeVariant: 'success' | 'warning' | 'danger' | 'muted'
  }
> = {
  [EmployeeStatus.ACTIVE]: {
    label: 'Activo',
    description: 'Empleado activo en la empresa',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    badgeVariant: 'success',
  },
  [EmployeeStatus.INACTIVE]: {
    label: 'Inactivo',
    description: 'Empleado inactivo temporalmente',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    badgeVariant: 'warning',
  },
  [EmployeeStatus.TERMINATED]: {
    label: 'Baja',
    description: 'Empleado ya no labora en la empresa',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    badgeVariant: 'muted',
  },
}

/**
 * Metadatos visuales para estados de permisos
 */
export const PERMISSION_STATUS_META: Record<
  PermissionStatus,
  {
    label: string
    description: string
    color: string
    bgColor: string
    badgeVariant: 'success' | 'warning' | 'danger' | 'muted'
  }
> = {
  [PermissionStatus.PENDING]: {
    label: 'Pendiente',
    description: 'Solicitud pendiente de aprobación',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    badgeVariant: 'warning',
  },
  [PermissionStatus.APPROVED]: {
    label: 'Aprobada',
    description: 'Solicitud aprobada',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    badgeVariant: 'success',
  },
  [PermissionStatus.REJECTED]: {
    label: 'Rechazada',
    description: 'Solicitud rechazada',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    badgeVariant: 'danger',
  },
  [PermissionStatus.CANCELLED]: {
    label: 'Cancelada',
    description: 'Solicitud cancelada',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    badgeVariant: 'muted',
  },
}

/**
 * Estados activos de empleados (pueden hacer acciones)
 */
export const ACTIVE_EMPLOYEE_STATUSES = [EmployeeStatus.ACTIVE, EmployeeStatus.INACTIVE] as const

/**
 * Estados de permisos que pueden ser cambiados
 */
export const CHANGEABLE_PERMISSION_STATUSES = [PermissionStatus.PENDING] as const

/**
 * Estados de permisos finales (no se pueden cambiar)
 */
export const FINAL_PERMISSION_STATUSES = [
  PermissionStatus.APPROVED,
  PermissionStatus.REJECTED,
  PermissionStatus.CANCELLED,
] as const

/**
 * Obtener label legible de un estado de empleado
 */
export function getEmployeeStatusLabel(status: EmployeeStatus): string {
  return EMPLOYEE_STATUS_META[status]?.label || status
}

/**
 * Obtener label legible de un estado de permiso
 */
export function getPermissionStatusLabel(status: PermissionStatus): string {
  return PERMISSION_STATUS_META[status]?.label || status
}

/**
 * Obtener descripción de un estado de empleado
 */
export function getEmployeeStatusDescription(status: EmployeeStatus): string {
  return EMPLOYEE_STATUS_META[status]?.description || ''
}

/**
 * Obtener descripción de un estado de permiso
 */
export function getPermissionStatusDescription(status: PermissionStatus): string {
  return PERMISSION_STATUS_META[status]?.description || ''
}

/**
 * Verificar si un empleado está activo
 */
export function isEmployeeActive(status: EmployeeStatus): boolean {
  return status === EmployeeStatus.ACTIVE
}

/**
 * Verificar si un permiso está pendiente
 */
export function isPermissionPending(status: PermissionStatus): boolean {
  return status === PermissionStatus.PENDING
}

/**
 * Verificar si un permiso ha sido aprobado
 */
export function isPermissionApproved(status: PermissionStatus): boolean {
  return status === PermissionStatus.APPROVED
}

/**
 * Verificar si un permiso ha sido rechazado
 */
export function isPermissionRejected(status: PermissionStatus): boolean {
  return status === PermissionStatus.REJECTED
}

/**
 * Verificar si una solicitud de permiso puede ser modificada
 */
export function canChangePermissionStatus(status: PermissionStatus): boolean {
  return (CHANGEABLE_PERMISSION_STATUSES as readonly PermissionStatus[]).includes(status)
}
