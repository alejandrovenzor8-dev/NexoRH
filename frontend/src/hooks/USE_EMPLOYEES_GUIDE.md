/**
 * GUÍA DE USO: useEmployees Hook
 * 
 * El hook `useEmployees` centraliza toda la lógica de empleados.
 * Proporciona: datos, filtrado, búsqueda, paginación, y operaciones CRUD.
 * 
 * ============================================================================
 * IMPORTACIÓN
 * ============================================================================
 * 
 * import { useEmployees } from '@/hooks'
 * 
 * ============================================================================
 * USO BÁSICO
 * ============================================================================
 * 
 * 'use client'
 * 
 * import { useEmployees } from '@/hooks'
 * 
 * export function EmployeesPage() {
 *   const {
 *     employees,           // EmployeeRecord[] - empleados paginados
 *     loading,             // boolean - estado de carga
 *     error,               // string | null - mensaje de error
 *     pagination,          // { page, pageSize, total, totalPages }
 *     filters,             // EmployeesFiltersValue - filtros actuales
 *     search,              // string - término de búsqueda actual
 *     departmentOptions,   // string[] - departamentos disponibles
 *     fetchEmployees,      // () => Promise<void> - obtener empleados (fetch inicial)
 *     refetch,             // () => Promise<void> - refetch manual
 *     createEmployee,      // (dto: CreateEmployeeDto) => Promise<void>
 *     updateEmployee,      // (id: string, dto: UpdateEmployeeDto) => Promise<void>
 *     deactivateEmployee,  // (id: string, newStatus: EmployeeStatus) => Promise<void>
 *     setFilters,          // (next: EmployeesFiltersValue) => void
 *     setSearch,           // (query: string) => void
 *     setPage,             // (page: number) => void
 *   } = useEmployees()
 * 
 *   if (loading) return <div>Cargando...</div>
 *   if (error) return <div>Error: {error}</div>
 * 
 *   return (
 *     <div>
 *       <EmployeeFilters
 *         filters={filters}
 *         search={search}
 *         onFiltersChange={setFilters}
 *         onSearchChange={setSearch}
 *       />
 * 
 *       <EmployeesTable employees={employees} />
 * 
 *       <Pagination
 *         current={pagination.page}
 *         total={pagination.totalPages}
 *         onChange={setPage}
 *       />
 *     </div>
 *   )
 * }
 * 
 * ============================================================================
 * OPERACIONES CRUD
 * ============================================================================
 * 
 * // CREAR EMPLEADO
 * const handleCreate = async (formData: CreateEmployeeDto) => {
 *   try {
 *     await createEmployee(formData)
 *     showSuccessToast('Empleado creado exitosamente')
 *   } catch (err) {
 *     showErrorToast(err.message)
 *   }
 * }
 * 
 * // ACTUALIZAR EMPLEADO
 * const handleUpdate = async (id: string, updates: UpdateEmployeeDto) => {
 *   try {
 *     await updateEmployee(id, updates)
 *     showSuccessToast('Empleado actualizado')
 *   } catch (err) {
 *     showErrorToast(err.message)
 *   }
 * }
 * 
 * // DESACTIVAR EMPLEADO
 * const handleDeactivate = async (id: string) => {
 *   try {
 *     await deactivateEmployee(id, EmployeeStatus.INACTIVE)
 *     showSuccessToast('Empleado desactivado')
 *   } catch (err) {
 *     showErrorToast(err.message)
 *   }
 * }
 * 
 * ============================================================================
 * FILTRADO Y BÚSQUEDA
 * ============================================================================
 * 
 * // Cambiar filtros
 * setFilters({
 *   query: '',
 *   role: EmployeeRole.MANAGER,  // o 'all'
 *   status: EmployeeStatus.ACTIVE,  // o 'all'
 *   department: 'Tecnologia',     // o 'all'
 *   sort: 'name-asc'              // 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc'
 * })
 * 
 * // Buscar por nombre, email o teléfono
 * setSearch('Juan')
 * 
 * ============================================================================
 * PAGINACIÓN
 * ============================================================================
 * 
 * // Cambiar página
 * setPage(2)
 * 
 * // Información de paginación
 * console.log(pagination.page)        // página actual (1-indexed)
 * console.log(pagination.pageSize)    // 8 empleados por página
 * console.log(pagination.total)       // total de empleados filtrados
 * console.log(pagination.totalPages)  // total de páginas
 * 
 * ============================================================================
 * MANEJO DE ERRORES
 * ============================================================================
 * 
 * // El hook maneja automáticamente:
 * // - Errores de autenticación (redirige a login)
 * // - Errores de API (disponibles en el estado 'error')
 * // - Validación de datos
 * 
 * if (error) {
 *   return <ErrorAlert message={error} onRetry={refetch} />
 * }
 * 
 * ============================================================================
 * REFETCH MANUAL
 * ============================================================================
 * 
 * // Obtener datos nuevamente desde la API
 * const handleRefresh = async () => {
 *   await refetch()
 * }
 * 
 * ============================================================================
 * CARACTERÍSTICAS
 * ============================================================================
 * 
 * ✅ TypeScript estricto - Sin 'any', totalmente tipado
 * ✅ Autenticación - Obtiene token de localStorage automáticamente
 * ✅ Búsqueda completa - Busca en nombre, email y teléfono
 * ✅ Filtrado múltiple - Rol, estado, departamento, orden
 * ✅ Paginación - 8 empleados por página (configurable)
 * ✅ Manejo de errores - Captura y reporta errores automáticamente
 * ✅ Loading states - Estados de carga claros
 * ✅ Refetch - Actualizar datos en cualquier momento
 * ✅ Memoización - Optimizado para re-renders
 * ✅ Escalable - Fácil de extender con nuevas operaciones
 * ✅ Independiente de UI - Lógica pura sin componentes
 * ✅ CRUD completo - Create, Read, Update, Deactivate
 * 
 * ============================================================================
 * INTEGRACIÓN CON COMPONENTES EXISTENTES
 * ============================================================================
 * 
 * El hook está diseñado para funcionar con:
 * - EmployeeFilters: Pasa setFilters y setSearch
 * - EmployeesTable: Pasa employees y funciones de acción
 * - Pagination: Pasa pagination y setPage
 * - Modales de confirmación: Usa refetch después de operaciones
 * 
 * ============================================================================
 * API ENDPOINTS REQUERIDOS (Para integración completa)
 * ============================================================================
 * 
 * El hook está listo para integración completa cuando estén disponibles:
 * 
 * POST   /api/employees         - Crear empleado
 * PATCH  /api/employees/:id     - Actualizar empleado
 * PATCH  /api/employees/:id/status - Cambiar estado
 * 
 * Busca las líneas con "TODO:" en el archivo useEmployees.ts para ver
 * dónde agregar las llamadas a estos endpoints.
 * 
 */
