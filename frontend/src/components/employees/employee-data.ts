import { User } from '@/services/api'
import { EmployeeRecord, EmployeeRole, EmployeeStatus } from './types'

const DEPARTMENTS = ['Operaciones', 'Producto', 'People', 'Finanzas', 'Comercial', 'Tecnologia']

function normalizeRole(role: string): EmployeeRole {
  if (role === 'ADMIN' || role === 'MANAGER' || role === 'USER') return role
  return 'USER'
}

function normalizeStatus(status?: string): EmployeeStatus {
  if (status === 'inactive') return 'inactive'
  if (status === 'baja') return 'baja'
  return 'active'
}

function pickDepartment(seed: string): string {
  let acc = 0
  for (let i = 0; i < seed.length; i++) acc += seed.charCodeAt(i)
  return DEPARTMENTS[acc % DEPARTMENTS.length]
}

export function mapUsersToEmployees(users: User[]): EmployeeRecord[] {
  return users.map((user) => ({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: normalizeRole(user.role),
    status: normalizeStatus(user.status),
    department: pickDepartment(user.id),
    createdAt: user.createdAt,
    companyId: user.companyId,
    phone: user.phone,
  }))
}

export function getDepartmentOptions(employees: EmployeeRecord[]): string[] {
  return Array.from(new Set(employees.map((e) => e.department))).sort((a, b) => a.localeCompare(b))
}
