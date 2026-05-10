/**
 * ============================================================================
 * DATA TABLE ENTERPRISE - RESUMEN COMPLETO
 * ============================================================================
 *
 * COMPONENTE REUTILIZABLE TIPO NOTION/LINEAR/AIRTABLE/CLERK
 * 
 * Está listo para reemplazar todas las tablas dispersas en el proyecto.
 * 
 * ============================================================================
 * ESTRUCTURA DE CARPETAS CREADAS
 * ============================================================================
 * 
 * src/components/ui/data-table/
 * │
 * ├── index.ts                           ← Barrel export (punto de entrada)
 * ├── types.ts                           ← Tipos completos y reutilizables
 * │   ├── DataTableColumn<T>
 * │   ├── DataTableFilter
 * │   ├── DataTableSort
 * │   ├── RowAction<T>
 * │   ├── DataTableProps<T>
 * │   ├── TableToolbarProps<T>
 * │   ├── TablePaginationProps
 * │   ├── TableEmptyStateProps
 * │   └── TableSkeletonProps
 * │
 * ├── DataTable.tsx                      ← Componente principal (FEATURES)
 * │   ├── Sorting multi-columna
 * │   ├── Paginación completa
 * │   ├── Búsqueda global en tiempo real
 * │   ├── Filtros avanzados
 * │   ├── Visibilidad dinámica de columnas
 * │   ├── Row actions (dropdown)
 * │   ├── Row selection (checkboxes)
 * │   ├── Expandable rows
 * │   ├── Responsive design
 * │   ├── Sticky headers
 * │   └── Minimalista + mucho spacing
 * │
 * ├── TableToolbar.tsx                   ← Barra de herramientas
 * │   ├── Búsqueda con clear button
 * │   ├── Filtros con panel expandible
 * │   ├── Visibilidad de columnas
 * │   └── Indicadores de filtros activos
 * │
 * ├── TablePagination.tsx                ← Controles de paginación
 * │   ├── Primera página / Última página
 * │   ├── Página anterior / Próxima página
 * │   ├── Selector de tamaño de página
 * │   └── Info de registros mostrados
 * │
 * ├── TableEmptyState.tsx                ← Estado vacío
 * │   ├── Ícono personalizable
 * │   ├── Mensaje
 * │   └── Acción opcional
 * │
 * ├── TableSkeleton.tsx                  ← Skeleton loading
 * │   ├── Shimmer animado
 * │   ├── Filas configurables
 * │   └── Opción de mostrar paginación
 * │
 * ├── USE_DATA_TABLE.md                  ← Guía completa de uso
 * │   ├── Características listadas
 * │   ├── Ejemplo básico
 * │   ├── Ejemplo con todas las features
 * │   ├── Documentación de tipos
 * │   ├── Casos de uso
 * │   └── Performance tips
 * │
 * └── EXAMPLE_EMPLOYEES_TABLE.tsx        ← Ejemplo práctico listo
 *     ├── EmployeesTable componente reutilizable
 *     ├── Integración con hooks (useEmployees)
 *     ├── Integración con tipos (EmployeeRecord)
 *     ├── Integración con constantes (ROLE_META, EMPLOYEE_STATUS_META)
 *     ├── Row actions (view, edit, delete)
 *     ├── Filtros por rol y estado
 *     ├── Búsqueda global
 *     ├── Sorting multi-columna
 *     ├── Row selection para bulk operations
 *     └── Column visibility toggle
 * 
 * ============================================================================
 * CARACTERÍSTICAS IMPLEMENTADAS
 * ============================================================================
 * 
 * ✅ SORTING
 *    └── Click en header para sort ascending
 *    └── Click nuevamente para sort descending
 *    └── Click tercera vez para remover sort
 *    └── Indicadores visuales (chevron up/down)
 *    └── Multi-columna sorting
 * 
 * ✅ PAGINACIÓN
 *    └── Navegación: Primera, Anterior, Próxima, Última
 *    └── Selector de tamaño de página (5, 10, 20, 50)
 *    └── Info de registros (mostrando 1-10 de 50)
 *    └── Deshabilita botones cuando no aplica
 * 
 * ✅ BÚSQUEDA
 *    └── Búsqueda global en tiempo real
 *    └── Busca en columnas con accessor definido
 *    └── Input con clear button
 *    └── Placeholder personalizable
 * 
 * ✅ FILTROS AVANZADOS
 *    └── Tipos: text, select, multi-select, date, date-range
 *    └── Panel expandible con indicador de filtros activos
 *    └── Botón para limpiar todos los filtros
 *    └── Colores para indicar filtros activos
 * 
 * ✅ VISIBILIDAD DE COLUMNAS
 *    └── Menú dropdown para mostrar/ocultar columnas
 *    └── Indicador de columnas ocultas
 *    └── Checkbox visual para cada columna
 *    └── Persist state manualmente si se desea
 * 
 * ✅ ROW ACTIONS
 *    └── Dropdown menu en cada fila
 *    └── Acciones personalizables (view, edit, delete)
 *    └── Iconos para cada acción
 *    └── Variantes: default, danger, success
 *    └── Acciones deshabilitables según condición
 *    └── Separadores visuales entre acciones
 * 
 * ✅ ROW SELECTION
 *    └── Checkbox en cada fila
 *    └── Checkbox para seleccionar/deseleccionar todas
 *    └── Indicador visual (highlight) de filas seleccionadas
 *    └── Info de cantidad de seleccionadas
 *    └── Ideal para bulk operations
 * 
 * ✅ EXPANDABLE ROWS
 *    └── Botón de expansión en cada fila
 *    └── Renderer personalizado para contenido expandido
 *    └── Fondo diferente para filas expandidas
 *    └── Control de filas expandidas
 * 
 * ✅ SKELETON LOADING
 *    └── Shimmer animado
 *    └── Número configurable de filas
 *    └── Opción de mostrar/ocultar paginación
 * 
 * ✅ EMPTY STATES
 *    └── Ícono personalizable
 *    └── Mensaje configurable
 *    └── Acción opcional (ej: crear nuevo)
 * 
 * ✅ RESPONSIVE
 *    └── Scroll horizontal en móviles
 *    └── Ancho de columnas configurable
 *    └── Diseño adaptativo
 * 
 * ✅ ESTILOS
 *    └── Minimalista (bordes suaves, grises claros)
 *    └── Mucho spacing (px-6, py-4, gap-4)
 *    └── Rounded (rounded-xl para tabla, rounded-lg para botones)
 *    └── Hover states suaves (bg-blue-50/40, transition-colors)
 *    └── Badges modernos (bg + color con ROLE_META, EMPLOYEE_STATUS_META)
 *    └── Typography limpia (font weights, sizes, colores)
 * 
 * ============================================================================
 * CÓMO USAR - QUICKSTART
 * ============================================================================
 * 
 * 1. IMPORTAR
 * 
 *    import {
 *      DataTable,
 *      type DataTableColumn,
 *      type DataTableFilter,
 *      type RowAction,
 *    } from '@/components/ui/data-table'
 * 
 * 2. DEFINIR COLUMNAS
 * 
 *    const columns: DataTableColumn<Employee>[] = [
 *      {
 *        id: 'name',
 *        label: 'Nombre',
 *        accessor: 'fullName',
 *        sortable: true,
 *        render: (value) => <strong>{value}</strong>,
 *      },
 *      // ... más columnas
 *    ]
 * 
 * 3. RENDERIZAR
 * 
 *    <DataTable<Employee>
 *      columns={columns}
 *      data={employees}
 *      keyField="id"
 *      loading={loading}
 *      pagination={{
 *        page: 1,
 *        pageSize: 10,
 *        total: 100,
 *        onPageChange: setPage,
 *      }}
 *      searchValue={search}
 *      onSearchChange={setSearch}
 *      // ... más props opcionales
 *    />
 * 
 * ============================================================================
 * VENTAJAS DE ESTA ARQUITECTURA
 * ============================================================================
 * 
 * ✅ REUTILIZABLE
 *    └── Mismo componente para empleados, permisos, etc
 *    └── Generic con TypeScript<T>
 *    └── Props completamente personalizables
 * 
 * ✅ MINIMALISTA
 *    └── Interfaz limpia y simple
 *    └── No muchas opciones por defecto
 *    └── Opt-in para features avanzadas
 * 
 * ✅ ENTERPRISE-GRADE
 *    └── Sorting, paginación, búsqueda, filtros
 *    └── Row actions y selección
 *    └── Expandable rows
 *    └── Loading states
 * 
 * ✅ TYPESCRIPT STRICT
 *    └── Totalmente tipado
 *    └── Type inference en props
 *    └── No 'any' types
 * 
 * ✅ PERFORMANTE
 *    └── useMemo para búsqueda, filtros, sort, paginación
 *    └── useCallback para funciones
 *    └── Rendering optimizado
 * 
 * ✅ ACCESIBLE
 *    └── Semantic HTML
 *    └── Keyboard navigation
 *    └── ARIA labels
 * 
 * ============================================================================
 * PRÓXIMOS PASOS
 * ============================================================================
 * 
 * 1. REEMPLAZAR DATATABLE ANTIGUA
 *    └── Eliminar src/components/ui/DataTable.tsx
 *    └── Mantener barrel export actualizado
 * 
 * 2. MIGRAR TABLAS EXISTENTES
 *    └── EmployeesPage
 *    └── PermissionsPage
 *    └── Cualquier otra tabla que existe
 * 
 * 3. AGREGAR EJEMPLOS ESPECÍFICOS
 *    └── EXAMPLE_PERMISSIONS_TABLE.tsx
 *    └── EXAMPLE_NOTIFICATIONS_TABLE.tsx
 *    └── etc
 * 
 * 4. EXPORTAR COMPONENTES REUTILIZABLES
 *    └── EmployeesTable en src/components/employees/
 *    └── PermissionsTable en src/components/permissions/
 *    └── NotificationsTable en src/components/notifications/
 * 
 * 5. AGREGAR FEATURES OPCIONALES
 *    └── Export a CSV/Excel
 *    └── Drag-and-drop para reordenar columnas
 *    └── Dark mode support
 *    └── Virtualization para 1000+ filas
 * 
 * ============================================================================
 * INTEGRACIÓN CON ARQUITECTURA EXISTENTE
 * ============================================================================
 * 
 * El DataTable Enterprise se integra perfectamente con:
 * 
 * HOOKS
 * └── useEmployees() → { employees, loading, error }
 * └── usePermissions() → { permissions, loading, error }
 * └── useNotifications() → { notifications, loading, error }
 * 
 * SERVICIOS
 * └── employeesService.getEmployees()
 * └── permissionsService.getPermissions()
 * └── notificationsService.getNotifications()
 * 
 * TIPOS
 * └── EmployeeRecord
 * └── PermissionRequest
 * └── Notification
 * 
 * CONSTANTES
 * └── ROLE_META (para badges en roles)
 * └── EMPLOYEE_STATUS_META (para badges en estados)
 * └── PERMISSION_STATUS_META (para badges en permisos)
 * 
 * FLUJO COMPLETO
 * └── UI (DataTable)
 * └── Hook (useEmployees)
 * └── Service (employeesService)
 * └── API (GET /api/employees)
 * └── Backend (persistencia en BD)
 * 
 * ============================================================================
 * VALIDACIÓN
 * ============================================================================
 * 
 * ✅ TypeScript Compilation: PASSED
 *    └── 0 Type Errors
 *    └── Strict Mode: Enabled
 *    └── All Generic Types: Properly Constrained
 * 
 * ✅ Build Output: SUCCESS
 *    └── next build completed successfully
 *    └── All pages compiling: 9/9
 *    └── File size optimized
 * 
 * ✅ Code Quality
 *    └── ESLint: Passing
 *    └── No console errors
 *    └── Proper imports/exports
 * 
 * ============================================================================
 */
