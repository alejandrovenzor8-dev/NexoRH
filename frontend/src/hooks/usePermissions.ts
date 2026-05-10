'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getUsers } from '@/services/api'
import {
  PermissionRequest,
  PermissionStatus,
  PermissionType,
} from '@/types/permission'
import { UserSession } from '@/types/auth'
import { EmployeeRole } from '@/types/employee'
import { mapUsersToEmployees } from '@/components/employees/employee-data'
import {
  generatePermissionRequests,
  dayDiff,
} from '@/components/permissions/permissions-data'

interface PaginationState {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

interface PermissionFilters {
  query: string
  status: 'all' | PermissionStatus
  type: 'all' | PermissionType
  department: 'all' | string
  date: string
  sort: 'updated-desc' | 'updated-asc' | 'start-desc' | 'start-asc'
}

interface ApprovalPayload {
  permissionId: string
  action: 'approve' | 'reject' | 'cancel'
  comment?: string
}

export interface UsePermissionsReturn {
  // Data state
  permissions: PermissionRequest[]
  loading: boolean
  error: string | null

  // Pagination state
  pagination: PaginationState

  // Filter state
  filters: PermissionFilters
  search: string
  departmentOptions: string[]

  // Operations
  fetchPermissions: () => Promise<void>
  refetch: () => Promise<void>
  approvePermission: (permissionId: string, comment?: string) => Promise<void>
  rejectPermission: (permissionId: string, comment?: string) => Promise<void>
  cancelPermission: (permissionId: string, comment?: string) => Promise<void>

  // State setters
  setFilters: (next: PermissionFilters) => void
  setSearch: (query: string) => void
  setPage: (page: number) => void
}

const DEFAULT_PAGE_SIZE = 8
const DEFAULT_FILTERS: PermissionFilters = {
  query: '',
  status: 'all',
  type: 'all',
  department: 'all',
  date: '',
  sort: 'updated-desc',
}

/**
 * Enterprise-grade custom hook for permission request management
 * Centralizes all permission operations: fetching, filtering, pagination, and approvals
 *
 * Features:
 * - Fetch and manage permission requests
 * - Advanced filtering by status, type, and department
 * - Full-text search on employee names and emails
 * - Client-side pagination
 * - Approval workflow: approve, reject, cancel with optional comments
 * - Error handling and loading states
 * - Auto-fetch on mount and manual refetch capability
 * - Role-aware access (ADMIN sees all, MANAGER sees by department, USER sees own)
 *
 * @example
 * const {
 *   permissions,
 *   loading,
 *   error,
 *   pagination,
 *   filters,
 *   search,
 *   approvePermission,
 *   rejectPermission,
 *   cancelPermission,
 *   setFilters,
 *   setSearch,
 * } = usePermissions()
 */
export function usePermissions(): UsePermissionsReturn {
  const router = useRouter()

  // Data state
  const [permissions, setPermissions] = useState<PermissionRequest[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Filter state
  const [filters, setFilters] = useState<PermissionFilters>(DEFAULT_FILTERS)
  const [search, setSearch] = useState<string>('')

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1)

  /**
   * Fetch permission requests from the API
   * Currently generates mock data; replace with actual API calls
   */
  const fetchPermissions = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem('token')
      if (!token) {
        setError('No authentication token found')
        router.replace('/login')
        return
      }

      // Fetch current user and all employees
      const [currentUser, allUsers] = await Promise.all([getCurrentUser(token), getUsers(token)])

      // Validate current user
      if (!currentUser) {
        throw new Error('Failed to fetch current user')
      }

      // Map users to employees
      const employees = mapUsersToEmployees(allUsers)

      // Generate permission requests (mock data)
      // TODO: Replace with actual API call when endpoint is available
      // const response = await fetch(`${API_URL}/api/permissions`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // })
      // if (!response.ok) throw new Error('Failed to fetch permissions')
      // const data = await response.json()

      const generatedPermissions = generatePermissionRequests(employees)

      // Apply role-based filtering
      let filteredByRole = generatedPermissions
      if (currentUser.role === EmployeeRole.MANAGER) {
        // Managers see only their department's requests
        filteredByRole = generatedPermissions.filter(
          (req) => req.department === employees.find((e) => e.id === currentUser.id)?.department
        )
      } else if (currentUser.role === EmployeeRole.USER) {
        // Users see only their own requests
        filteredByRole = generatedPermissions.filter((req) => req.employeeId === currentUser.id)
      }
      // ADMIN sees all

      setPermissions(filteredByRole)
      setCurrentPage(1) // Reset to first page
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch permissions'
      setError(errorMessage)

      // If authentication failed, redirect to login
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.replace('/login')
      }
    } finally {
      setLoading(false)
    }
  }, [router])

  /**
   * Refetch permissions from API
   */
  const refetch = useCallback(async (): Promise<void> => {
    await fetchPermissions()
  }, [fetchPermissions])

  /**
   * Apply filters and search to permissions
   * Handles: query search, status filter, type filter, department filter, date filter, sorting
   */
  const filteredPermissions = useMemo(() => {
    let result = [...permissions]

    // 1. Apply search filter (employee name, email)
    if (search.trim().length > 0) {
      const searchLower = search.trim().toLowerCase()
      result = result.filter(
        (perm) =>
          perm.employeeName.toLowerCase().includes(searchLower) ||
          perm.employeeEmail.toLowerCase().includes(searchLower)
      )
    }

    // 2. Apply status filter
    if (filters.status !== 'all') {
      result = result.filter((perm) => perm.status === filters.status)
    }

    // 3. Apply type filter
    if (filters.type !== 'all') {
      result = result.filter((perm) => perm.type === filters.type)
    }

    // 4. Apply department filter
    if (filters.department !== 'all') {
      result = result.filter((perm) => perm.department === filters.department)
    }

    // 5. Apply date filter (if provided)
    if (filters.date.length > 0) {
      const filterDate = new Date(filters.date).getTime()
      result = result.filter((perm) => {
        const startDate = new Date(perm.startDate).getTime()
        const endDate = new Date(perm.endDate).getTime()
        // Include if filter date falls within permission date range
        return filterDate >= startDate && filterDate <= endDate
      })
    }

    // 6. Apply sorting
    result.sort((a, b) => {
      switch (filters.sort) {
        case 'updated-asc':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        case 'updated-desc':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case 'start-asc':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        case 'start-desc':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        default:
          return 0
      }
    })

    return result
  }, [permissions, search, filters])

  /**
   * Calculate pagination info
   */
  const pagination = useMemo((): PaginationState => {
    const total = filteredPermissions.length
    const totalPages = Math.ceil(total / DEFAULT_PAGE_SIZE)
    const validPage = Math.min(currentPage, Math.max(1, totalPages || 1))

    return {
      page: validPage,
      pageSize: DEFAULT_PAGE_SIZE,
      total,
      totalPages,
    }
  }, [filteredPermissions.length, currentPage])

  /**
   * Get paginated permissions for current page
   */
  const paginatedPermissions = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    return filteredPermissions.slice(start, end)
  }, [filteredPermissions, pagination.page, pagination.pageSize])

  /**
   * Get available department options from current permission list
   */
  const departmentOptions = useMemo(() => {
    return Array.from(new Set(permissions.map((p) => p.department)))
      .sort((a, b) => a.localeCompare(b))
  }, [permissions])

  /**
   * Approve a permission request
   * Note: Currently mocked - update to call actual API endpoint when available
   */
  const approvePermission = useCallback(
    async (permissionId: string, comment?: string): Promise<void> => {
      try {
        setError(null)

        // TODO: Replace with actual API call when endpoint is available
        // const token = localStorage.getItem('token')
        // if (!token) throw new Error('No authentication token found')
        //
        // const response = await fetch(`${API_URL}/api/permissions/${permissionId}/approve`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${token}`
        //   },
        //   body: JSON.stringify({ comment })
        // })
        //
        // if (!response.ok) {
        //   const error = await response.json()
        //   throw new Error(error.message || 'Failed to approve permission')
        // }

        // Mock: Update permission status in local state
        setPermissions((prev) =>
          prev.map((perm) =>
            perm.id === permissionId
              ? {
                  ...perm,
                  status: PermissionStatus.APPROVED,
                  comments: comment ? [...perm.comments, comment] : perm.comments,
                  updatedAt: new Date().toISOString(),
                }
              : perm
          )
        )
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to approve permission'
        setError(errorMessage)
        throw new Error(errorMessage)
      }
    },
    []
  )

  /**
   * Reject a permission request
   * Note: Currently mocked - update to call actual API endpoint when available
   */
  const rejectPermission = useCallback(
    async (permissionId: string, comment?: string): Promise<void> => {
      try {
        setError(null)

        // TODO: Replace with actual API call when endpoint is available
        // const token = localStorage.getItem('token')
        // if (!token) throw new Error('No authentication token found')
        //
        // const response = await fetch(`${API_URL}/api/permissions/${permissionId}/reject`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${token}`
        //   },
        //   body: JSON.stringify({ comment })
        // })
        //
        // if (!response.ok) {
        //   const error = await response.json()
        //   throw new Error(error.message || 'Failed to reject permission')
        // }

        // Mock: Update permission status in local state
        setPermissions((prev) =>
          prev.map((perm) =>
            perm.id === permissionId
              ? {
                  ...perm,
                  status: PermissionStatus.REJECTED,
                  comments: comment ? [...perm.comments, comment] : perm.comments,
                  updatedAt: new Date().toISOString(),
                }
              : perm
          )
        )
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to reject permission'
        setError(errorMessage)
        throw new Error(errorMessage)
      }
    },
    []
  )

  /**
   * Cancel a permission request
   * Note: Currently mocked - update to call actual API endpoint when available
   */
  const cancelPermission = useCallback(
    async (permissionId: string, comment?: string): Promise<void> => {
      try {
        setError(null)

        // TODO: Replace with actual API call when endpoint is available
        // const token = localStorage.getItem('token')
        // if (!token) throw new Error('No authentication token found')
        //
        // const response = await fetch(`${API_URL}/api/permissions/${permissionId}/cancel`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${token}`
        //   },
        //   body: JSON.stringify({ comment })
        // })
        //
        // if (!response.ok) {
        //   const error = await response.json()
        //   throw new Error(error.message || 'Failed to cancel permission')
        // }

        // Mock: Update permission status in local state
        setPermissions((prev) =>
          prev.map((perm) =>
            perm.id === permissionId
              ? {
                  ...perm,
                  status: PermissionStatus.CANCELLED,
                  comments: comment ? [...perm.comments, comment] : perm.comments,
                  updatedAt: new Date().toISOString(),
                }
              : perm
          )
        )
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to cancel permission'
        setError(errorMessage)
        throw new Error(errorMessage)
      }
    },
    []
  )

  /**
   * Update filters
   */
  const handleSetFilters = useCallback((nextFilters: PermissionFilters): void => {
    setFilters(nextFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }, [])

  /**
   * Update search query
   */
  const handleSetSearch = useCallback((query: string): void => {
    setSearch(query)
    setCurrentPage(1) // Reset to first page when search changes
  }, [])

  /**
   * Fetch permissions on component mount
   */
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('No authentication token found')
      router.replace('/login')
      return
    }

    fetchPermissions()
  }, [fetchPermissions, router])

  return {
    // Data state
    permissions: paginatedPermissions,
    loading,
    error,

    // Pagination state
    pagination,

    // Filter state
    filters,
    search,
    departmentOptions,

    // Operations
    fetchPermissions,
    refetch,
    approvePermission,
    rejectPermission,
    cancelPermission,

    // State setters
    setFilters: handleSetFilters,
    setSearch: handleSetSearch,
    setPage: setCurrentPage,
  }
}
