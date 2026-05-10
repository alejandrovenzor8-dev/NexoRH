/**
 * Constantes de roles y metadatos de usuario
 * Centraliza definiciones de roles, colores, etiquetas y permisos
 */

import { EmployeeRole } from '@/types/employee'

/**
 * Metadatos visuales para cada rol
 * Incluye: label legible, color, icono CSS, descripción
 */
export const ROLE_META: Record<
  EmployeeRole,
  {
    label: string
    description: string
    color: string
    bgColor: string
    badgeVariant: 'default' | 'success' | 'warning' | 'danger'
    permissions: string[]
  }
> = {
  [EmployeeRole.ADMIN]: {
    label: 'Administrador',
    description: 'Acceso completo al sistema',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    badgeVariant: 'danger',
    permissions: [
      'manage_employees',
      'manage_permissions',
      'approve_permissions',
      'view_all_data',
      'manage_users',
      'manage_roles',
      'view_reports',
      'manage_recruitment',
    ],
  },
  [EmployeeRole.MANAGER]: {
    label: 'Gerente',
    description: 'Gestión de departamento y aprobaciones',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    badgeVariant: 'warning',
    permissions: [
      'view_department_employees',
      'approve_department_permissions',
      'view_department_data',
      'view_reports',
    ],
  },
  [EmployeeRole.USER]: {
    label: 'Empleado',
    description: 'Acceso básico a funciones de empleado',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    badgeVariant: 'default',
    permissions: [
      'view_own_profile',
      'request_permissions',
      'view_own_permissions',
      'view_messages',
    ],
  },
}

/**
 * Lista de todos los roles disponibles
 */
export const AVAILABLE_ROLES = [EmployeeRole.ADMIN, EmployeeRole.MANAGER, EmployeeRole.USER] as const

/**
 * Roles que pueden aprobar solicitudes
 */
export const APPROVAL_ROLES = [EmployeeRole.ADMIN, EmployeeRole.MANAGER] as const

/**
 * Roles que pueden ver empleados de su departamento
 */
export const DEPARTMENT_VIEW_ROLES = [EmployeeRole.MANAGER] as const

/**
 * Roles que ven todas las solicitudes
 */
export const ADMIN_VIEW_ROLES = [EmployeeRole.ADMIN] as const

/**
 * Obtener label legible de un rol
 */
export function getRoleLabel(role: EmployeeRole): string {
  return ROLE_META[role]?.label || role
}

/**
 * Obtener descripción de un rol
 */
export function getRoleDescription(role: EmployeeRole): string {
  return ROLE_META[role]?.description || ''
}

/**
 * Verificar si un rol puede aprobar solicitudes
 */
export function canApprovePermissions(role: EmployeeRole): boolean {
  return (APPROVAL_ROLES as readonly EmployeeRole[]).includes(role)
}

/**
 * Verificar si un rol puede ver datos administrativos
 */
export function isAdminRole(role: EmployeeRole): boolean {
  return role === EmployeeRole.ADMIN
}

/**
 * Verificar si un rol es gerente
 */
export function isManagerRole(role: EmployeeRole): boolean {
  return role === EmployeeRole.MANAGER
}

/**
 * Verificar si un rol es empleado
 */
export function isUserRole(role: EmployeeRole): boolean {
  return role === EmployeeRole.USER
}
