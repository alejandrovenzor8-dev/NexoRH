import { EmployeeRole, EmployeeStatus } from './employee'

export interface UserSession {
  id: string
  fullName: string
  email: string
  role: EmployeeRole
  status: EmployeeStatus
  companyId: string
  phone?: string
  createdAt: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  user: UserSession
}
