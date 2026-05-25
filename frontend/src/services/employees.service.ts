/**
 * Employees Service - Capa de servicios para operaciones con empleados
 * Encapsula toda la lógica de API relacionada con empleados
 */

import { BaseService } from './base.service'
import {
  Employee,
  EmployeeRecord,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeFilters,
} from '@/types/employee'
import { UserSession } from '@/types/auth'
import { mapUsersToEmployees } from '@/components/employees/employee-data'

/**
 * Servicio empresarial para operaciones con empleados
 * Proporciona métodos para CRUD, búsqueda y filtrado
 */
export class EmployeesService extends BaseService {
  /**
   * Obtener todos los empleados
   * GET /api/users
   */
  async getEmployees(): Promise<EmployeeRecord[]> {
    const users = await this.getUsers()
    return mapUsersToEmployees(users)
  }

  /**
   * Obtener usuario actual y todos los empleados
   * Llamada paralela optimizada
   */
  async getCurrentUserAndEmployees(): Promise<[UserSession, EmployeeRecord[]]> {
    const [currentUser, employees] = await Promise.all([
      this.getCurrentUser(),
      this.getEmployees(),
    ])
    return [currentUser, employees]
  }

  /**
   * Obtener empleado por ID
   * GET /api/users/:id
   */
  async getEmployeeById(id: string): Promise<EmployeeRecord | null> {
    try {
      const employee = await this.get<Employee>(`/users/${id}`)
      return mapUsersToEmployees([employee])[0] || null
    } catch {
      return null
    }
  }

  /**
   * Crear nuevo empleado
   * POST /api/users
   */
  async createEmployee(data: CreateEmployeeDto): Promise<EmployeeRecord> {
    // Mapear CreateEmployeeDto al formato del backend
    const payload = {
      fullName: data.fullName,
      email: data.email,
      password: 'changeme123', // Password temporal que el usuario debe cambiar
      phone: data.phone,
      department: data.department,
      role: data.role,
      status: data.status,
    }
    
    const employee = await this.post<Employee>('/users', payload)
    return mapUsersToEmployees([employee])[0]
  }

  /**
   * Actualizar empleado
   * PATCH /api/users/:id
   */
  async updateEmployee(id: string, data: UpdateEmployeeDto): Promise<EmployeeRecord> {
    const employee = await this.patch<Employee>(`/users/${id}`, data)
    return mapUsersToEmployees([employee])[0]
  }

  /**
   * Cambiar estado de empleado
   * PATCH /api/users/:id
   */
  async changeEmployeeStatus(
    id: string,
    newStatus: EmployeeRecord['status']
  ): Promise<EmployeeRecord> {
    return this.updateEmployee(id, { status: newStatus })
  }

  /**
   * Eliminar empleado (marcar como inactivo)
   * PATCH /api/users/:id
   */
  async deleteEmployee(id: string): Promise<void> {
    await this.updateEmployee(id, { status: 'baja' as any })
  }

  /**
   * Buscar empleados con filtros
   * (Implementado en el cliente en el hook useEmployees)
   */
  async searchEmployees(filters: Partial<EmployeeFilters>): Promise<EmployeeRecord[]> {
    // Por ahora, obtener todos y filtrar en cliente
    return this.getEmployees()
  }

  /**
   * Obtener usuarios del sistema
   * Método privado usado internamente
   * GET /api/users
   */
  private async getUsers(): Promise<UserSession[]> {
    return this.get<UserSession[]>('/users')
  }
    // TODO: Reemplazar con llamada real a API cuando esté disponible
    // return this.get<UserSession[]>('/api/users')

    // Mock - retornar seed data del archivo existente
    return [] // Los hooks manejan esto
  }

  /**
   * Obtener usuario actual
   * Método privado usado internamente
   */
  private async getCurrentUser(): Promise<UserSession> {
    // TODO: Reemplazar con llamada real a API cuando esté disponible
    // return this.get<UserSession>('/api/users/me')

    // Mock
    throw new Error('No current user')
  }
}

/**
 * Instancia singleton del servicio de empleados
 */
export const employeesService = new EmployeesService()
