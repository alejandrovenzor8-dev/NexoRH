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
   * 
   * @returns Array de empleados
   * 
   * TODO: Implementar cuando API esté disponible
   * GET /api/employees
   */
  async getEmployees(): Promise<EmployeeRecord[]> {
    // TODO: Reemplazar con llamada real a API cuando esté disponible
    // const employees = await this.get<Employee[]>('/api/employees')
    // return mapUsersToEmployees(employees)

    // Por ahora, usar seed data del lado del cliente
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
   * 
   * @param id - ID del empleado
   * @returns Empleado
   * 
   * TODO: Implementar cuando API esté disponible
   * GET /api/employees/:id
   */
  async getEmployeeById(id: string): Promise<EmployeeRecord | null> {
    // TODO: Reemplazar con llamada real a API cuando esté disponible
    // try {
    //   const employee = await this.get<Employee>(`/api/employees/${id}`)
    //   return mapUsersToEmployees([employee])[0] || null
    // } catch {
    //   return null
    // }

    const employees = await this.getEmployees()
    return employees.find((e) => e.id === id) || null
  }

  /**
   * Crear nuevo empleado
   * 
   * @param data - Datos del nuevo empleado
   * @returns Empleado creado
   * 
   * TODO: Implementar cuando API esté disponible
   * POST /api/employees
   */
  async createEmployee(data: CreateEmployeeDto): Promise<EmployeeRecord> {
    // TODO: Reemplazar con llamada real a API cuando esté disponible
    // const employee = await this.post<Employee>('/api/employees', data)
    // return mapUsersToEmployees([employee])[0]

    // Mock: Crear empleado localmente
    const newEmployee: EmployeeRecord = {
      id: `emp-${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      status: data.status,
      department: data.department,
      phone: data.phone,
      createdAt: new Date().toISOString(),
      companyId: '',
    }
    return newEmployee
  }

  /**
   * Actualizar empleado
   * 
   * @param id - ID del empleado
   * @param data - Datos a actualizar
   * @returns Empleado actualizado
   * 
   * TODO: Implementar cuando API esté disponible
   * PATCH /api/employees/:id
   */
  async updateEmployee(id: string, data: UpdateEmployeeDto): Promise<EmployeeRecord> {
    // TODO: Reemplazar con llamada real a API cuando esté disponible
    // const employee = await this.patch<Employee>(`/api/employees/${id}`, data)
    // return mapUsersToEmployees([employee])[0]

    // Mock: Obtener empleado y actualizar localmente
    const employee = await this.getEmployeeById(id)
    if (!employee) {
      throw new Error(`Employee ${id} not found`)
    }

    return {
      ...employee,
      ...data,
      id, // Asegurar que el ID no cambia
    } as EmployeeRecord
  }

  /**
   * Cambiar estado de empleado
   * 
   * @param id - ID del empleado
   * @param newStatus - Nuevo estado
   * @returns Empleado con estado actualizado
   * 
   * TODO: Implementar cuando API esté disponible
   * PATCH /api/employees/:id/status
   */
  async changeEmployeeStatus(
    id: string,
    newStatus: EmployeeRecord['status']
  ): Promise<EmployeeRecord> {
    // TODO: Reemplazar con llamada real a API cuando esté disponible
    // const employee = await this.patch<Employee>(`/api/employees/${id}/status`, { status: newStatus })
    // return mapUsersToEmployees([employee])[0]

    // Mock
    const employee = await this.getEmployeeById(id)
    if (!employee) {
      throw new Error(`Employee ${id} not found`)
    }

    return {
      ...employee,
      status: newStatus,
    }
  }

  /**
   * Eliminar empleado (marcar como inactivo)
   * 
   * @param id - ID del empleado
   * 
   * TODO: Implementar cuando API esté disponible
   * DELETE /api/employees/:id
   */
  async deleteEmployee(id: string): Promise<void> {
    // TODO: Reemplazar con llamada real a API cuando esté disponible
    // await this.delete(`/api/employees/${id}`)
  }

  /**
   * Buscar empleados con filtros
   * (Implementado en el cliente en el hook useEmployees)
   * 
   * @param filters - Criterios de búsqueda
   * @returns Empleados que coinciden
   * 
   * TODO: Implementar búsqueda server-side cuando API esté disponible
   * GET /api/employees/search?query=...&role=...&status=...
   */
  async searchEmployees(filters: Partial<EmployeeFilters>): Promise<EmployeeRecord[]> {
    // TODO: Reemplazar con búsqueda en API cuando esté disponible
    // const queryParams = new URLSearchParams()
    // if (filters.query) queryParams.append('query', filters.query)
    // if (filters.role && filters.role !== 'all') queryParams.append('role', filters.role)
    // if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status)
    // return this.get<EmployeeRecord[]>(`/api/employees/search?${queryParams}`)

    // Por ahora, obtener todos y filtrar en cliente
    return this.getEmployees()
  }

  /**
   * Obtener usuarios del sistema
   * Método privado usado internamente
   */
  private async getUsers(): Promise<UserSession[]> {
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
