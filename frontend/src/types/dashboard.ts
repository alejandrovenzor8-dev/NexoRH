export enum DashboardActivityType {
  USER = 'user',
  SYSTEM = 'system',
  AUTH = 'auth',
}

export interface DashboardMetric {
  id: string
  title: string
  value: number
  subtitle: string
  trend?: string
}

export interface DashboardActivityItem {
  id: string
  message: string
  time: string
  type: DashboardActivityType
}

export interface DashboardModuleItem {
  id: string
  title: string
  description: string
  href?: string
  enabled: boolean
}
