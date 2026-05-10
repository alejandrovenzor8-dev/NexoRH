/**
 * GUÍA DE REFACTORIZACIÓN - Cómo Actualizar Hooks para Usar Servicios
 * 
 * ============================================================================
 * EJEMPLO 1: Refactorizar useEmployees
 * ============================================================================
 * 
 * ANTES (Sin servicios - TODO mezclado):
 * 
 * export function useEmployees() {
 *   const [employees, setEmployees] = useState([])
 *   
 *   useEffect(() => {
 *     const token = localStorage.getItem('token')
 *     const url = `${API_URL}/api/users` // ← Hardcoded
 *     fetch(url, { headers: { Authorization: `Bearer ${token}` } })
 *       .then(r => r.json())
 *       .then(users => setEmployees(mapUsersToEmployees(users)))
 *       .catch(err => console.log(err)) // ← Sin manejo de error
 *   }, [])
 *   
 *   return { employees }
 * }
 * 
 * DESPUÉS (Con servicios - Separación clara):
 * 
 * import { employeesService } from '@/services'
 * 
 * export function useEmployees() {
 *   const [employees, setEmployees] = useState<EmployeeRecord[]>([])
 *   const [loading, setLoading] = useState(true)
 *   const [error, setError] = useState<string | null>(null)
 *   
 *   const fetchEmployees = useCallback(async () => {
 *     try {
 *       setLoading(true)
 *       setError(null)
 *       const data = await employeesService.getEmployees() // ← Servicio
 *       setEmployees(data)
 *     } catch (err) {
 *       setError(err instanceof Error ? err.message : 'Unknown error')
 *     } finally {
 *       setLoading(false)
 *     }
 *   }, [])
 *   
 *   useEffect(() => {
 *     fetchEmployees()
 *   }, [fetchEmployees])
 *   
 *   return { employees, loading, error, fetchEmployees }
 * }
 * 
 * CAMBIOS PRINCIPALES:
 * ├── ✅ Fetch movido a servicio
 * ├── ✅ Token manejo centralizado en BaseService
 * ├── ✅ URL centralizada (no más hardcoded)
 * ├── ✅ Error handling apropiado
 * ├── ✅ Loading state agregado
 * ├── ✅ Refetch capability agregado
 * └── ✅ TypeScript strict types
 * 
 * ============================================================================
 * EJEMPLO 2: Refactorizar createEmployee
 * ============================================================================
 * 
 * ANTES (Sin servicios):
 * 
 * const handleCreate = async (data: CreateEmployeeDto) => {
 *   const token = localStorage.getItem('token')
 *   const response = await fetch(`${API_URL}/api/employees`, {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'Authorization': `Bearer ${token}`
 *     },
 *     body: JSON.stringify(data)
 *   })
 *   
 *   if (!response.ok) {
 *     const error = await response.json()
 *     throw error
 *   }
 *   
 *   const newEmp = await response.json()
 *   setEmployees([...employees, newEmp])
 * }
 * 
 * DESPUÉS (Con servicios):
 * 
 * const createEmployee = useCallback(async (data: CreateEmployeeDto) => {
 *   try {
 *     setError(null)
 *     const newEmp = await employeesService.createEmployee(data) // ← Servicio
 *     setEmployees(prev => [...prev, newEmp])
 *   } catch (err) {
 *     setError(err instanceof Error ? err.message : 'Failed to create')
 *     throw err
 *   }
 * }, [])
 * 
 * CAMBIOS:
 * ├── ✅ Fetch movido a servicio
 * ├── ✅ Headers y auth centralizados
 * ├── ✅ Error handling mejor
 * ├── ✅ Código más legible y mantenible
 * ├── ✅ Servicios reutilizables en otro lugar
 * └── ✅ Testeable independientemente
 * 
 * ============================================================================
 * PASO A PASO: Refactorizar un Hook
 * ============================================================================
 * 
 * 1. IDENTIFICAR FETCHES
 *    ├── Buscar fetch() o axios calls
 *    ├── Anotar URLs: /api/employees, /api/permissions
 *    └── Identificar métodos: GET, POST, PATCH, DELETE
 * 
 * 2. CREAR/ACTUALIZAR SERVICIO
 *    ├── Crear src/services/feature.service.ts si no existe
 *    ├── Crear clase que extienda BaseService
 *    ├── Mover métodos de API al servicio
 *    ├── Usar this.get(), this.post(), etc. de BaseService
 *    └── Mantener TODO comments para endpoints no implementados
 * 
 * 3. REFACTORIZAR HOOK
 *    ├── Importar servicio: import { featureService } from '@/services'
 *    ├── Reemplazar fetch() con featureService.method()
 *    ├── Agregar try-catch apropiados
 *    ├── Mantener estado (loading, error, data)
 *    ├── Usar useCallback para métodos
 *    └── Usar useMemo para derivados
 * 
 * 4. TESTEAR
 *    ├── ✅ npm run build - Sin errores TypeScript
 *    ├── ✅ Componentes que usan el hook
 *    ├── ✅ Flujos de error
 *    ├── ✅ Múltiples llamadas
 *    └── ✅ Estado en diferentes puntos
 * 
 * ============================================================================
 * CHECKLIST DE REFACTORIZACIÓN
 * ============================================================================
 * 
 * Para cada fetch encontrado:
 * 
 * [ ] ¿Existe el servicio para esta entidad?
 *     [ Sí ] → Usar el método existente
 *     [ No ] → Crear nuevo servicio
 * 
 * [ ] ¿El método existe en el servicio?
 *     [ Sí ] → Llamar directamente
 *     [ No ] → Agregar método al servicio
 * 
 * [ ] ¿Se hizo el cambio en el hook?
 *     [ ] Cambiar fetch() por await service.method()
 *     [ ] Agregar try-catch
 *     [ ] Actualizar estado (loading, error)
 *     [ ] Agregar tipos TypeScript
 * 
 * [ ] ¿Testear cambios?
 *     [ ] npm run build sin errores
 *     [ ] Página/componente que usa el hook
 *     [ ] Flujos de error
 *     [ ] Estados de loading
 * 
 * ============================================================================
 * PATRÓN ESTÁNDAR PARA OPERACIONES CRUD
 * ============================================================================
 * 
 * En el SERVICIO:
 * 
 * async getItems(): Promise<Item[]> {
 *   return this.get<Item[]>('/api/items')
 * }
 * 
 * async getItemById(id: string): Promise<Item | null> {
 *   try {
 *     return await this.get<Item>(`/api/items/${id}`)
 *   } catch {
 *     return null
 *   }
 * }
 * 
 * async createItem(data: CreateItemDto): Promise<Item> {
 *   return this.post<Item>('/api/items', data)
 * }
 * 
 * async updateItem(id: string, data: UpdateItemDto): Promise<Item> {
 *   return this.patch<Item>(`/api/items/${id}`, data)
 * }
 * 
 * async deleteItem(id: string): Promise<void> {
 *   return this.delete(`/api/items/${id}`)
 * }
 * 
 * En el HOOK:
 * 
 * const [items, setItems] = useState<Item[]>([])
 * const [loading, setLoading] = useState(true)
 * const [error, setError] = useState<string | null>(null)
 * 
 * const fetch = useCallback(async () => {
 *   try {
 *     const data = await itemService.getItems()
 *     setItems(data)
 *   } catch (err) {
 *     setError(err.message)
 *   }
 * }, [])
 * 
 * const create = useCallback(async (dto: CreateItemDto) => {
 *   try {
 *     const newItem = await itemService.createItem(dto)
 *     setItems(prev => [...prev, newItem])
 *   } catch (err) {
 *     setError(err.message)
 *   }
 * }, [])
 * 
 * const update = useCallback(async (id: string, dto: UpdateItemDto) => {
 *   try {
 *     const updated = await itemService.updateItem(id, dto)
 *     setItems(prev => prev.map(i => i.id === id ? updated : i))
 *   } catch (err) {
 *     setError(err.message)
 *   }
 * }, [])
 * 
 * const remove = useCallback(async (id: string) => {
 *   try {
 *     await itemService.deleteItem(id)
 *     setItems(prev => prev.filter(i => i.id !== id))
 *   } catch (err) {
 *     setError(err.message)
 *   }
 * }, [])
 * 
 * En el COMPONENTE:
 * 
 * const { items, loading, error, fetch, create, update, remove } = useItems()
 * 
 * if (loading) return <Spinner />
 * if (error) return <Error message={error} />
 * 
 * return (
 *   <div>
 *     {items.map(item => (
 *       <Item 
 *         key={item.id} 
 *         item={item}
 *         onUpdate={() => update(item.id, newData)}
 *         onDelete={() => remove(item.id)}
 *       />
 *     ))}
 *     <NewItemForm onSubmit={create} />
 *   </div>
 * )
 * 
 * ============================================================================
 * TIPS DE REFACTORIZACIÓN
 * ============================================================================
 * 
 * 1. Refactoriza de abajo hacia arriba
 *    ├── Primero: Crear servicios base
 *    ├── Segundo: Actualizar hooks existentes
 *    └── Tercero: Limpiar componentes
 * 
 * 2. Usa git para rastrear cambios
 *    ├── git checkout -b refactor/add-services
 *    ├── Refactoriza un hook a la vez
 *    ├── Test y commit cada cambio
 *    └── git push y hacer PR
 * 
 * 3. Mantén TypeScript strict
 *    ├── No uses 'any'
 *    ├── Tipea todos los parámetros
 *    ├── Tipea todos los retornos
 *    └── npm run build debe pasar
 * 
 * 4. Documenta cambios importantes
 *    ├── Comenta TODOs en servicios
 *    ├── Explica por qué un cambio fue necesario
 *    └── Mantén la guía actualizada
 * 
 * 5. No refactorices todo de una vez
 *    ├── Refactoriza un modulo (empleados, permisos, etc)
 *    ├── Test completamente
 *    ├── Commit y valida en staging
 *    ├── Luego pasa al siguiente modulo
 *    └── Lento y seguro = mejor que rápido y roto
 * 
 */
