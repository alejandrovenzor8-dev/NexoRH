/**
 * ARQUITECTURA ENTERPRISE - NEXORH FRONTEND
 * 
 * Estructura de capas correcta para separación de responsabilidades
 * 
 * ============================================================================
 * ARQUITECTURA VISUAL
 * ============================================================================
 * 
 *                         USER (Browser)
 *                              ↓
 *                      ┌─────────────────┐
 *                      │  UI COMPONENTS  │
 *                      │   (*.tsx)       │
 *                      └────────┬────────┘
 *                               ↓
 *                      ┌─────────────────┐
 *                      │  CUSTOM HOOKS   │
 *                      │  (use*.ts)      │
 *                      │  Estado + Lógica│
 *                      └────────┬────────┘
 *                               ↓
 *                      ┌─────────────────┐
 *                      │    SERVICES     │
 *                      │  (*.service.ts) │
 *                      │  Llamadas API   │
 *                      └────────┬────────┘
 *                               ↓
 *                      ┌─────────────────┐
 *                      │   API Backend   │
 *                      │  (REST / WSS)   │
 *                      └─────────────────┘
 * 
 * ============================================================================
 * CAPAS Y RESPONSABILIDADES
 * ============================================================================
 * 
 * 1. UI COMPONENTS (Presentación)
 *    ├── Archivos: src/app/**, src/components/**
 *    ├── Responsabilidades:
 *    │   ├── Renderizar interfaz de usuario
 *    │   ├── Manejar interacciones del usuario (clicks, inputs)
 *    │   ├── Mostrar estados (loading, error, datos)
 *    │   └── Llamar funciones de hooks
 *    └── Prohibido:
 *        ├── Hacer fetch directo
 *        ├── Lógica de negocio compleja
 *        ├── Estado compartido global
 *        └── Convertir/parsear datos
 * 
 * 2. CUSTOM HOOKS (Lógica + Estado)
 *    ├── Archivos: src/hooks/use*.ts
 *    ├── Responsabilidades:
 *    │   ├── Gestionar estado local con useState
 *    │   ├── Coordinar llamadas a servicios
 *    │   ├── Manejar loading/error/success states
 *    │   ├── Filtrar y transformar datos (memoized)
 *    │   ├── Coordinar múltiples operaciones
 *    │   └── Exponer API simple para componentes
 *    └── Prohibido:
 *        ├── Hacer fetch directo
 *        ├── UI markup (JSX)
 *        └── Lógica específica de componentes
 * 
 * 3. SERVICES (Lógica de API)
 *    ├── Archivos: src/services/*.service.ts
 *    ├── Responsabilidades:
 *    │   ├── Encapsular llamadas a API
 *    │   ├── Gestionar autenticación
 *    │   ├── Manejar errores de red/API
 *    │   ├── Serializar/deserializar datos
 *    │   ├── Tipado fuerte con TypeScript
 *    │   └── Proporcionar métodos reutilizables
 *    └── Prohibido:
 *        ├── Gestionar estado (useState)
 *        ├── Lógica de componentes
 *        └── Transformaciones complejas de datos
 * 
 * 4. API BACKEND (Datos)
 *    ├── URL: process.env.NEXT_PUBLIC_API_URL
 *    ├── Responsabilidades:
 *    │   ├── Persistir datos en BD
 *    │   ├── Validar datos
 *    │   ├── Autenticar usuarios
 *    │   └── Responder con datos estructurados
 *    └── Soporta:
 *        ├── REST endpoints
 *        ├── WebSocket para realtime
 *        └── Server-sent events
 * 
 * ============================================================================
 * EJEMPLO 1: FLUJO COMPLETO DE OBTENER EMPLEADOS
 * ============================================================================
 * 
 * 1. COMPONENTE (UI)
 *    ├── función: EmployeesPage()
 *    ├── llama: useEmployees()
 *    └── usa: employees, loading, error, setFilters, setSearch
 * 
 * 2. HOOK (Lógica + Estado)
 *    ├── función: useEmployees()
 *    ├── estado: [employees, loading, error]
 *    ├── llama: employeesService.getEmployees()
 *    ├── filtrado: useMemo (query, role, status, etc)
 *    └── retorna: { employees, loading, error, filters, ... }
 * 
 * 3. SERVICIO (API)
 *    ├── clase: EmployeesService
 *    ├── método: async getEmployees()
 *    ├── llama: this.get<EmployeeRecord[]>('/api/employees')
 *    └── retorna: EmployeeRecord[] (tipado)
 * 
 * 4. API BACKEND
 *    ├── endpoint: GET /api/employees
 *    ├── auth: Bearer token
 *    ├── query: ?page=1&limit=50&role=ADMIN
 *    └── respuesta: { data: Employee[], total: 150 }
 * 
 * ============================================================================
 * EJEMPLO 2: CREAR EMPLEADO
 * ============================================================================
 * 
 * COMPONENTE
 * ├── handleSubmit(formData)
 * └── llama: createEmployee(formData)
 *                    ↓
 * HOOK (useEmployees)
 * ├── createEmployee(dto: CreateEmployeeDto)
 * ├── setLoading(true)
 * ├── llama: employeesService.createEmployee(dto)
 * ├── setEmployees([...employees, newEmployee])
 * ├── setLoading(false)
 * └── retorna: Promise<void>
 *                    ↓
 * SERVICIO (EmployeesService)
 * ├── createEmployee(data: CreateEmployeeDto)
 * ├── llama: this.post<Employee>('/api/employees', data)
 * ├── maneja errores API
 * └── retorna: EmployeeRecord (tipado)
 *                    ↓
 * API BACKEND
 * ├── POST /api/employees
 * ├── Body: { fullName, email, role, status, ... }
 * ├── Validación en backend
 * ├── Persistencia en BD
 * └── Respuesta: { id, ...employee, createdAt }
 * 
 * ============================================================================
 * ACCESO A SERVICIOS
 * ============================================================================
 * 
 * // En un Hook
 * import { employeesService } from '@/services'
 * 
 * const employees = await employeesService.getEmployees()
 * const newEmp = await employeesService.createEmployee(dto)
 * 
 * // Desde otro servicio
 * import { EmployeesService } from '@/services'
 * 
 * class ReportsService extends BaseService {
 *   async getEmployeeReport() {
 *     const empService = new EmployeesService()
 *     const employees = await empService.getEmployees()
 *     // Transformar datos
 *   }
 * }
 * 
 * ============================================================================
 * MANEJO DE ERRORES
 * ============================================================================
 * 
 * NIVEL DE SERVICIO
 * ├── Captura errores HTTP
 * ├── Lanza ApiError tipado
 * └── Estado: { status, message, details }
 * 
 * NIVEL DE HOOK
 * ├── Captura ApiError
 * ├── Actualiza estado error
 * ├── Opcionalmente, reintentos
 * └── Log para debugging
 * 
 * NIVEL DE COMPONENTE
 * ├── Muestra mensaje al usuario
 * ├── Ofrece acciones (reintentar, volver, etc)
 * └── Toast/modal/inline message según context
 * 
 * ============================================================================
 * PATRÓN: CREAR UN NUEVO HOOK
 * ============================================================================
 * 
 * // Paso 1: Crear servicio si no existe
 * // src/services/newFeature.service.ts
 * class NewFeatureService extends BaseService {
 *   async getItems(): Promise<Item[]> {
 *     return this.get<Item[]>('/api/items')
 *   }
 *   async createItem(data: CreateItemDto): Promise<Item> {
 *     return this.post<Item>('/api/items', data)
 *   }
 * }
 * 
 * // Paso 2: Crear hook que use el servicio
 * // src/hooks/useNewFeature.ts
 * export function useNewFeature() {
 *   const [items, setItems] = useState<Item[]>([])
 *   const [loading, setLoading] = useState(false)
 *   const [error, setError] = useState<string | null>(null)
 * 
 *   const fetchItems = useCallback(async () => {
 *     try {
 *       setLoading(true)
 *       const data = await newFeatureService.getItems()
 *       setItems(data)
 *     } catch (err) {
 *       setError(err.message)
 *     } finally {
 *       setLoading(false)
 *     }
 *   }, [])
 * 
 *   useEffect(() => { fetchItems() }, [])
 * 
 *   return { items, loading, error, fetchItems }
 * }
 * 
 * // Paso 3: Usar hook en componente
 * // src/app/feature/page.tsx
 * export function FeaturePage() {
 *   const { items, loading, error } = useNewFeature()
 * 
 *   if (loading) return <LoadingUI />
 *   if (error) return <ErrorUI message={error} />
 *   return <FeatureUI items={items} />
 * }
 * 
 * ============================================================================
 * REGLAS DE ORO
 * ============================================================================
 * 
 * ✅ HACER
 * ├── Mantener componentes enfocados en UI
 * ├── Hooks enfocados en estado y lógica
 * ├── Servicios enfocados en API
 * ├── Usar tipos en todo (TypeScript strict)
 * ├── Manejar errores en cada nivel
 * ├── Usar memoization apropiadamente
 * ├── Separar concerns claramente
 * └── Documentar responsabilidades
 * 
 * ❌ NO HACER
 * ├── Fetch directo en componentes
 * ├── Lógica de negocio en componentes
 * ├── Estado global en componentes
 * ├── Servicios que modifiquen estado
 * ├── Componentes que hacen transform complejos
 * ├── Hooks con lógica de presentación
 * ├── API calls fuera de servicios
 * └── Ignorar errores
 * 
 * ============================================================================
 * TESTING
 * ============================================================================
 * 
 * SERVICIOS (Fácil de testear)
 * ├── Mock BaseService.request
 * ├── Test cada método de forma aislada
 * ├── Validar manejo de errores
 * └── No se necesita DOM
 * 
 * HOOKS (Con renderHook)
 * ├── Mock servicios con jest.mock
 * ├── Usar renderHook del testing library
 * ├── Test estado inicial
 * ├── Test transiciones de estado
 * └── Test funciones retornadas
 * 
 * COMPONENTES (Con render)
 * ├── Mock hooks
 * ├── Renderizar componente
 * ├── Simular interacciones
 * ├── Validar salida
 * └── Snapshot tests opcionales
 * 
 * ============================================================================
 * MIGRACIÓN DE CÓDIGO EXISTENTE
 * ============================================================================
 * 
 * Para refactorizar código existente que tiene lógica mezclada:
 * 
 * 1. Identificar llamadas a API
 *    └── Mover a servicios (crear si no existen)
 * 
 * 2. Identificar estado relacionado
 *    └── Mover a hooks (crear/actualizar si es necesario)
 * 
 * 3. Identificar lógica de filtrado/transformación
 *    └── Mover a hooks con useMemo
 * 
 * 4. Dejar solo UI en componentes
 *    └── Renderizar y manejar eventos
 * 
 * Ejemplo:
 *   ANTES: page.tsx tiene useState + fetch + filter + UI
 *   DESPUÉS: page.tsx solo UI + useEmployees (estado + lógica + fetch)
 * 
 * ============================================================================
 * BENEFICIOS DE ESTA ARQUITECTURA
 * ============================================================================
 * 
 * ✅ Separación de Responsabilidades
 * ├── Cada capa tiene un trabajo claro
 * └── Fácil entender qué hace cada parte
 * 
 * ✅ Reutilización
 * ├── Servicios reutilizables en múltiples hooks
 * ├── Hooks reutilizables en múltiples componentes
 * └── Código SECO (Don't Repeat Yourself)
 * 
 * ✅ Testing
 * ├── Fácil testear servicios aislados
 * ├── Fácil mockear servicios en hooks
 * ├── Componentes sin lógica = fáciles de testear
 * └── Mayor cobertura de código
 * 
 * ✅ Escalabilidad
 * ├── Estructura clara para crecer
 * ├── Nuevas features siguen patrón
 * ├── No hay riesgo de spaghetti code
 * └── Mantenibilidad a largo plazo
 * 
 * ✅ Performance
 * ├── Memoization en lugares correctos
 * ├── Peticiones optimizadas en servicios
 * ├── Componentes puros = menos re-renders
 * └── Control sobre qué se re-renderiza
 * 
 * ============================================================================
 * CHECKLIST DE ARQUITECTURA
 * ============================================================================
 * 
 * Cuando escribas código nuevo, verifica:
 * 
 * [ ] ¿Está el UI solo en el componente?
 * [ ] ¿Está el estado solo en el hook?
 * [ ] ¿Están las llamadas API solo en servicios?
 * [ ] ¿Tiene TypeScript tipos en todo?
 * [ ] ¿Maneja errores en cada nivel?
 * [ ] ¿Usa memoization donde es importante?
 * [ ] ¿Está documentado qué hace cada parte?
 * [ ] ¿Se puede testear cada capa independientemente?
 * 
 */
