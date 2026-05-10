import { UserSession } from '@/types/auth'
import { EmployeeRecord } from './types'
import { EmployeeRole, EmployeeStatus } from '@/types/employee'

const DEPARTMENTS = ['Operaciones', 'Producto', 'People', 'Finanzas', 'Comercial', 'Tecnologia']

function normalizeRole(role: string): EmployeeRole {
  if (role === EmployeeRole.ADMIN || role === EmployeeRole.MANAGER || role === EmployeeRole.USER) return role
  return EmployeeRole.USER
}

function normalizeStatus(status?: string): EmployeeStatus {
  if (status === EmployeeStatus.INACTIVE) return EmployeeStatus.INACTIVE
  if (status === EmployeeStatus.TERMINATED || status === 'terminated') return EmployeeStatus.TERMINATED
  return EmployeeStatus.ACTIVE
}

function pickDepartment(seed: string): string {
  let acc = 0
  for (let i = 0; i < seed.length; i++) acc += seed.charCodeAt(i)
  return DEPARTMENTS[acc % DEPARTMENTS.length]
}

export function mapUsersToEmployees(users: UserSession[]): EmployeeRecord[] {
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
