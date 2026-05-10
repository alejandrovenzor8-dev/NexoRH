import { ApiResponse } from './common'

export enum EmployeeRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  TERMINATED = 'baja',
}

export interface Employee {
  id: string
  fullName: string
  email: string
  role: EmployeeRole
  status: EmployeeStatus
  department: string
  createdAt: string
  companyId: string
  phone?: string
}

export interface CreateEmployeeDto {
  fullName: string
  email: string
  role: EmployeeRole
  status: EmployeeStatus
  department: string
  phone: string
  hiredAt: string
}

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {
  id: string
}

export interface EmployeeFilters {
  query: string
  role: 'all' | EmployeeRole
  status: 'all' | EmployeeStatus
  department: 'all' | string
  sort: 'name-asc' | 'name-desc' | 'date-desc' | 'date-asc'
}

export type EmployeeResponse = ApiResponse<Employee[]>

export type EmployeeRecord = Employee
export type EmployeesFiltersValue = EmployeeFilters
