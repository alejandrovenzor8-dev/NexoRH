export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
  meta?: PaginationMeta
}

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface TableColumn<T> {
  key: keyof T | string
  label: string
  render?: (row: T) => React.ReactNode
  className?: string
}

export enum StatusBadge {
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
  INFO = 'info',
  MUTED = 'muted',
}
