/**
 * Permissions Service - Capa de servicios para operaciones con permisos
 * Encapsula toda la lógica de API relacionada con solicitudes de permisos
 */

import { BaseService } from './base.service'
import {
  Permission,
  PermissionRequest,
  PermissionStatus,
  CreatePermissionDto,
} from '@/types/permission'

/**
 * Payload para aprobar/rechazar/cancelar un permiso
 */
interface ApprovalPayload {
  comment?: string
}

/**
 * Servicio empresarial para operaciones con permisos
 * Proporciona métodos para CRUD, búsqueda, filtrado y aprobaciones
 */
export class PermissionsService extends BaseService {
  /**
   * Obtener todas las solicitudes de permiso
   * GET /api/permissions
   */
  async getPermissions(): Promise<PermissionRequest[]> {
    return this.get<PermissionRequest[]>('/permissions')
  }

  /**
   * Obtener solicitud de permiso por ID
   * GET /api/permissions/:id
   */
  async getPermissionById(id: string): Promise<PermissionRequest | null> {
    try {
      return await this.get<PermissionRequest>(`/permissions/${id}`)
    } catch {
      return null
    }
  }

  /**
   * Crear nueva solicitud de permiso
   * POST /api/permissions
   */
  async createPermission(data: CreatePermissionDto): Promise<PermissionRequest> {
    return this.post<PermissionRequest>('/permissions', data)
  }

  /**
   * Aprobar una solicitud de permiso
   * PATCH /api/permissions/:id
   */
  async approvePermission(
    permissionId: string,
    comment?: string
  ): Promise<PermissionRequest> {
    return this.patch<PermissionRequest>(`/permissions/${permissionId}`, { 
      status: 'approved',
      comments: comment
    })
  }

  /**
   * Rechazar una solicitud de permiso
   * PATCH /api/permissions/:id
   */
  async rejectPermission(
    permissionId: string,
    comment?: string
  ): Promise<PermissionRequest> {
    return this.patch<PermissionRequest>(`/permissions/${permissionId}`, { 
      status: 'rejected',
      comments: comment
    })
  }

  /**
   * Cancelar una solicitud de permiso
   * PATCH /api/permissions/:id
   */
  async cancelPermission(
    permissionId: string,
    comment?: string
  ): Promise<PermissionRequest> {
    return this.patch<PermissionRequest>(`/permissions/${permissionId}`, { 
      status: 'cancelled',
      comments: comment
    })
  }

  /**
   * Actualizar estado de una solicitud
   * PATCH /api/permissions/:id
   */
  async updatePermissionStatus(
    permissionId: string,
    newStatus: PermissionStatus,
    comment?: string
  ): Promise<PermissionRequest> {
    return this.patch<PermissionRequest>(`/permissions/${permissionId}`, { 
      status: newStatus,
      comments: comment
    })
  }

  /**
   * Buscar solicitudes de permisos con filtros
   * (Implementado en el cliente en el hook usePermissions)
   */
  async searchPermissions(filters: Record<string, unknown>): Promise<PermissionRequest[]> {
    return this.getPermissions()
  }
}

/**
 * Instancia singleton del servicio de permisos
 */
export const permissionsService = new PermissionsService()
