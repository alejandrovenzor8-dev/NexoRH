export type EmployeeRole = 'ADMIN' | 'MANAGER' | 'USER'
export type EmployeeStatus = 'active' | 'inactive' | 'baja'

export interface EmployeeRecord {
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

export interface EmployeesFiltersValue {
  query: string
  role: 'all' | EmployeeRole
  status: 'all' | EmployeeStatus
  department: 'all' | string
  sort: 'name-asc' | 'name-desc' | 'date-desc' | 'date-asc'
}
