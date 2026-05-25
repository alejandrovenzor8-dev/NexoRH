'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, getUsers } from '@/services/api'
import {
  EmployeeRecord,
  EmployeesFiltersValue,
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeStatus,
  EmployeeRole,
} from '@/types/employee'
import { UserSession } from '@/types/auth'
import { mapUsersToEmployees, getDepartmentOptions } from '@/components/employees/employee-data'

interface PaginationState {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface UseEmployeesReturn {
  // Data state
  employees: EmployeeRecord[]
  loading: boolean
  error: string | null

  // Pagination state
  pagination: PaginationState

  // Filter state
  filters: EmployeesFiltersValue
  search: string
  departmentOptions: string[]

  // Operations
  fetchEmployees: () => Promise<void>
  refetch: () => Promise<void>
  createEmployee: (dto: CreateEmployeeDto) => Promise<void>
  updateEmployee: (id: string, dto: UpdateEmployeeDto) => Promise<void>
  deactivateEmployee: (id: string, newStatus: EmployeeStatus) => Promise<void>

  // State setters
  setFilters: (next: EmployeesFiltersValue) => void
  setSearch: (query: string) => void
  setPage: (page: number) => void
}

const DEFAULT_PAGE_SIZE = 8
const DEFAULT_FILTERS: EmployeesFiltersValue = {
  query: '',
  role: 'all',
  status: 'all',
  department: 'all',
  sort: 'name-asc',
}

/**
 * Enterprise-grade custom hook for employee data management
 * Centralizes all employee operations: fetching, filtering, pagination, and CRUD
 *
 * Features:
 * - Full CRUD operations (Create, Read, Update, Delete/Deactivate)
 * - Advanced filtering by role, status, and department
 * - Full-text search on employee names
 * - Client-side pagination
 * - Error handling and loading states
 * - Auto-refetch on mount and manual refetch capability
 *
 * @example
 * const {
 *   employees,
 *   loading,
 *   error,
 *   pagination,
 *   filters,
 *   search,
 *   fetchEmployees,
 *   createEmployee,
 *   updateEmployee,
 *   deactivateEmployee,
 *   setFilters,
 *   setSearch,
 * } = useEmployees()
 */
export function useEmployees(): UseEmployeesReturn {
  const router = useRouter()

  // Data state
  const [employees, setEmployees] = useState<EmployeeRecord[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Filter state
  const [filters, setFilters] = useState<EmployeesFiltersValue>(DEFAULT_FILTERS)
  const [search, setSearch] = useState<string>('')

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1)

  /**
   * Fetch employees from the API
   * Handles authentication and error states
   */
  const fetchEmployees = useCallback(async (): Promise<void> => {
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

      // Map users to employee records
      const mappedEmployees = mapUsersToEmployees(allUsers)
      setEmployees(mappedEmployees)
      setCurrentPage(1) // Reset to first page
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch employees'
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
   * Refetch employees from API
   */
  const refetch = useCallback(async (): Promise<void> => {
    await fetchEmployees()
  }, [fetchEmployees])

  /**
   * Apply filters and search to employees
   * Handles: query search, role filter, status filter, department filter, sorting
   */
  const filteredEmployees = useMemo(() => {
    let result = [...employees]

    // 1. Apply search filter
    if (search.trim().length > 0) {
      const searchLower = search.trim().toLowerCase()
      result = result.filter(
        (emp) =>
          emp.fullName.toLowerCase().includes(searchLower) ||
          emp.email.toLowerCase().includes(searchLower) ||
          emp.phone?.toLowerCase().includes(searchLower)
      )
    }

    // 2. Apply role filter
    if (filters.role !== 'all') {
      result = result.filter((emp) => emp.role === filters.role)
    }

    // 3. Apply status filter
    if (filters.status !== 'all') {
      result = result.filter((emp) => emp.status === filters.status)
    }

    // 4. Apply department filter
    if (filters.department !== 'all') {
      result = result.filter((emp) => emp.department === filters.department)
    }

    // 5. Apply sorting
    result.sort((a, b) => {
      switch (filters.sort) {
        case 'name-asc':
          return a.fullName.localeCompare(b.fullName)
        case 'name-desc':
          return b.fullName.localeCompare(a.fullName)
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

    return result
  }, [employees, search, filters])

  /**
   * Calculate pagination info
   */
  const pagination = useMemo((): PaginationState => {
    const total = filteredEmployees.length
    const totalPages = Math.ceil(total / DEFAULT_PAGE_SIZE)
    const validPage = Math.min(currentPage, Math.max(1, totalPages || 1))

    return {
      page: validPage,
      pageSize: DEFAULT_PAGE_SIZE,
      total,
      totalPages,
    }
  }, [filteredEmployees.length, currentPage])

  /**
   * Get paginated employees for current page
   */
  const paginatedEmployees = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    return filteredEmployees.slice(start, end)
  }, [filteredEmployees, pagination.page, pagination.pageSize])

  /**
   * Get available department options from current employee list
   */
  const departmentOptions = useMemo(() => getDepartmentOptions(employees), [employees])

  /**
   * Create a new employee
   */
  const createEmployee = useCallback(
    async (dto: CreateEmployeeDto): Promise<void> => {
      try {
        setError(null)

        const token = localStorage.getItem('token')
        if (!token) throw new Error('No authentication token found')

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            fullName: dto.fullName,
            email: dto.email,
            password: 'changeme123',
            phone: dto.phone,
            department: dto.department,
            role: dto.role,
            status: dto.status,
          })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Failed to create employee')
        }

        // Refresh the employee list after creating
        await fetchEmployees()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create employee'
        setError(errorMessage)
        throw new Error(errorMessage)
      }
    },
    [fetchEmployees]
  )

  /**
   * Update an existing employee
   */
  const updateEmployee = useCallback(
    async (id: string, dto: UpdateEmployeeDto): Promise<void> => {
      try {
        setError(null)

        const token = localStorage.getItem('token')
        if (!token) throw new Error('No authentication token found')

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(dto)
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Failed to update employee')
        }

        // Refresh the employee list after updating
        await fetchEmployees()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update employee'
        setError(errorMessage)
        throw new Error(errorMessage)
      }
    },
    [fetchEmployees]
  )

  /**
   * Deactivate or change status of an employee
   * Note: Currently mocked - update to call actual API endpoint when available
   */
  const deactivateEmployee = useCallback(
    async (id: string, newStatus: EmployeeStatus): Promise<void> => {
      try {
        setError(null)

        // TODO: Replace with actual API call when endpoint is available
        // const token = localStorage.getItem('token')
        // if (!token) throw new Error('No authentication token found')
        //
        // const response = await fetch(`${API_URL}/api/employees/${id}/status`, {
        //   method: 'PATCH',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'Authorization': `Bearer ${token}`
        //   },
        //   body: JSON.stringify({ status: newStatus })
        // })
        //
        // if (!response.ok) {
        //   const error = await response.json()
        //   throw new Error(error.message || 'Failed to update employee status')
        // }

        // Mock: Update employee status in local state
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === id
              ? {
                  ...emp,
                  status: newStatus,
                }
              : emp
          )
        )
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update employee status'
        setError(errorMessage)
        throw new Error(errorMessage)
      }
    },
    []
  )

  /**
   * Update filters
   */
  const handleSetFilters = useCallback((nextFilters: EmployeesFiltersValue): void => {
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
   * Fetch employees on component mount
   */
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('No authentication token found')
      router.replace('/login')
      return
    }

    fetchEmployees()
  }, [fetchEmployees, router])

  return {
    // Data state
    employees: paginatedEmployees,
    loading,
    error,

    // Pagination state
    pagination,

    // Filter state
    filters,
    search,
    departmentOptions,

    // Operations
    fetchEmployees,
    refetch,
    createEmployee,
    updateEmployee,
    deactivateEmployee,

    // State setters
    setFilters: handleSetFilters,
    setSearch: handleSetSearch,
    setPage: setCurrentPage,
  }
}
