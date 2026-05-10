/**
 * Constantes de tipos de permisos y solicitudes
 * Centraliza definiciones de tipos, colores y metadatos
 */

import { PermissionType } from '@/types/permission'

/**
 * Metadatos visuales para cada tipo de permiso
 */
export const PERMISSION_TYPE_META: Record<
  PermissionType,
  {
    label: string
    description: string
    color: string
    bgColor: string
    icon: string
  }
> = {
  [PermissionType.VACATION]: {
    label: 'Vacaciones',
    description: 'Solicitud de descanso / vacaciones',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    icon: '🏖️',
  },
  [PermissionType.PERSONAL]: {
    label: 'Permiso personal',
    description: 'Permiso para asuntos personales',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    icon: '👤',
  },
  [PermissionType.MEDICAL]: {
    label: 'Incapacidad',
    description: 'Reposo médico o incapacidad',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    icon: '⚕️',
  },
  [PermissionType.REMOTE]: {
    label: 'Home office',
    description: 'Solicitud de trabajo remoto',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    icon: '💻',
  },
}

/**
 * Lista ordenada de todos los tipos de permisos
 */
export const AVAILABLE_PERMISSION_TYPES = [
  PermissionType.VACATION,
  PermissionType.PERSONAL,
  PermissionType.MEDICAL,
  PermissionType.REMOTE,
] as const

/**
 * Mapeo de tipos de permisos por categoría
 */
export const PERMISSION_TYPES_BY_CATEGORY = {
  tiempo_libre: [PermissionType.VACATION],
  personal: [PermissionType.PERSONAL, PermissionType.MEDICAL],
  trabajo: [PermissionType.REMOTE],
} as const

/**
 * Días máximos que se pueden solicitar por tipo de permiso
 */
export const MAX_DAYS_BY_TYPE: Record<PermissionType, number | null> = {
  [PermissionType.VACATION]: null, // Sin límite (validar según política)
  [PermissionType.PERSONAL]: 5, // Máximo 5 días
  [PermissionType.MEDICAL]: null, // Sin límite (requiere justificante)
  [PermissionType.REMOTE]: null, // Sin límite de días
}

/**
 * Requiere justificante/documento
 */
export const REQUIRES_ATTACHMENT: Record<PermissionType, boolean> = {
  [PermissionType.VACATION]: false,
  [PermissionType.PERSONAL]: false,
  [PermissionType.MEDICAL]: true, // Requiere justificante médico
  [PermissionType.REMOTE]: false,
}

/**
 * Requiere aprobación de gerente
 */
export const REQUIRES_MANAGER_APPROVAL: Record<PermissionType, boolean> = {
  [PermissionType.VACATION]: true,
  [PermissionType.PERSONAL]: true,
  [PermissionType.MEDICAL]: false, // Se notifica pero no requiere aprobación
  [PermissionType.REMOTE]: true,
}

/**
 * Obtener label legible de un tipo de permiso
 */
export function getPermissionTypeLabel(type: PermissionType): string {
  return PERMISSION_TYPE_META[type]?.label || type
}

/**
 * Obtener descripción de un tipo de permiso
 */
export function getPermissionTypeDescription(type: PermissionType): string {
  return PERMISSION_TYPE_META[type]?.description || ''
}

/**
 * Verificar si un tipo de permiso requiere adjunto
 */
export function permissionRequiresAttachment(type: PermissionType): boolean {
  return REQUIRES_ATTACHMENT[type] || false
}

/**
 * Verificar si un tipo de permiso requiere aprobación del gerente
 */
export function permissionRequiresManagerApproval(type: PermissionType): boolean {
  return REQUIRES_MANAGER_APPROVAL[type] || false
}

/**
 * Obtener máximo de días permitidos
 */
export function getMaxDaysForPermissionType(type: PermissionType): number | null {
  return MAX_DAYS_BY_TYPE[type] || null
}

/**
 * Validar que cantidad de días es válida
 */
export function isValidPermissionDays(type: PermissionType, days: number): boolean {
  const max = getMaxDaysForPermissionType(type)
  return max === null ? true : days <= max && days > 0
}
