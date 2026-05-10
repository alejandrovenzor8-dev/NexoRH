/**
 * FORMS ENTERPRISE - GUÍA DE USO COMPLETA
 *
 * Sistema reutilizable de formularios para NexoRH usando:
 * - react-hook-form (gestión de estado + validación)
 * - zod (schemas de validación tipados)
 * - TypeScript strict mode
 *
 * ============================================================================
 * CARACTERÍSTICAS
 * ============================================================================
 *
 * ✅ COMPONENTES DISPONIBLES
 * ├── FormInput: text, email, password, number, tel, url
 * ├── FormSelect: single y multi-select
 * ├── FormTextarea: multi-line text
 * ├── FormDatePicker: native date/datetime inputs
 * ├── FormFileUpload: drag & drop
 * └── FormSwitch: toggle/checkbox visual
 *
 * ✅ FEATURES
 * ├── Validación inline con Zod
 * ├── Error messages personalizables
 * ├── Loading states
 * ├── Disabled states
 * ├── Labels consistentes
 * ├── Descriptions y hints
 * ├── Character counter
 * ├── File size validation
 * ├── Drag and drop
 * └── Accesibilidad total
 *
 * ✅ DISEÑO
 * ├── Minimalista (bordes suaves, grises claros)
 * ├── Mucho spacing (px-4, py-2.5, gap-3)
 * ├── Hover states suaves
 * ├── Focus states con ring
 * ├── Error states en rojo
 * └── Loading indicators
 *
 * ============================================================================
 * INSTALACIÓN (ya hecha)
 * ============================================================================
 *
 * npm install react-hook-form zod @hookform/resolvers
 *
 * ============================================================================
 * EJEMPLO RÁPIDO - CREATE EMPLOYEE FORM
 * ============================================================================
 *
 * 1. DEFINIR SCHEMA CON ZOD
 *
 * import { z } from 'zod'
 *
 * const createEmployeeSchema = z.object({
 *   fullName: z.string().min(3, 'Mínimo 3 caracteres').max(100),
 *   email: z.string().email('Email inválido'),
 *   role: z.enum(['ADMIN', 'MANAGER', 'USER']),
 *   department: z.string().min(1, 'Selecciona un departamento'),
 *   phone: z.string().optional(),
 *   startDate: z.string(),
 *   isActive: z.boolean().default(true),
 *   bio: z.string().max(500).optional(),
 *   profileImage: z.instanceof(File).optional(),
 * })
 *
 * type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>
 *
 * 2. CREAR COMPONENTE FORMULARIO
 *
 * 'use client'
 *
 * import { useForm } from 'react-hook-form'
 * import { zodResolver } from '@hookform/resolvers/zod'
 * import {
 *   FormInput,
 *   FormSelect,
 *   FormDatePicker,
 *   FormTextarea,
 *   FormFileUpload,
 *   FormSwitch,
 * } from '@/components/ui/forms'
 *
 * export function CreateEmployeeForm() {
 *   const { register, handleSubmit, formState: { errors, isSubmitting } } =
 *     useForm<CreateEmployeeInput>({
 *       resolver: zodResolver(createEmployeeSchema),
 *       mode: 'onChange', // Validación en tiempo real
 *     })
 *
 *   const onSubmit = async (data: CreateEmployeeInput) => {
 *     await employeesService.createEmployee(data)
 *   }
 *
 *   return (
 *     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
 *       <FormInput
 *         {...register('fullName')}
 *         label="Nombre Completo"
 *         placeholder="Juan Pérez"
 *         error={errors.fullName}
 *         required
 *       />
 *
 *       <FormInput
 *         {...register('email')}
 *         type="email"
 *         label="Email"
 *         placeholder="juan@example.com"
 *         error={errors.email}
 *         required
 *       />
 *
 *       <FormSelect
 *         {...register('role')}
 *         label="Rol"
 *         error={errors.role}
 *         options={[
 *           { label: 'Admin', value: 'ADMIN' },
 *           { label: 'Manager', value: 'MANAGER' },
 *           { label: 'Usuario', value: 'USER' },
 *         ]}
 *         required
 *       />
 *
 *       <FormSelect
 *         {...register('department')}
 *         label="Departamento"
 *         error={errors.department}
 *         options={[
 *           { label: 'Ventas', value: 'SALES' },
 *           { label: 'IT', value: 'IT' },
 *           { label: 'HR', value: 'HR' },
 *         ]}
 *         required
 *       />
 *
 *       <FormInput
 *         {...register('phone')}
 *         type="tel"
 *         label="Teléfono"
 *         placeholder="+34 600 000 000"
 *         error={errors.phone}
 *       />
 *
 *       <FormDatePicker
 *         {...register('startDate')}
 *         label="Fecha de Inicio"
 *         error={errors.startDate}
 *         required
 *       />
 *
 *       <FormTextarea
 *         {...register('bio')}
 *         label="Bio"
 *         placeholder="Cuéntanos sobre ti..."
 *         error={errors.bio}
 *         maxLength={500}
 *         showCounter
 *       />
 *
 *       <FormFileUpload
 *         {...register('profileImage')}
 *         label="Foto de Perfil"
 *         accept="image/*"
 *         maxSize={5}
 *         error={errors.profileImage}
 *       />
 *
 *       <FormSwitch
 *         {...register('isActive')}
 *         label="Empleado Activo"
 *         activeText="Activo"
 *         inactiveText="Inactivo"
 *         error={errors.isActive}
 *       />
 *
 *       <button
 *         type="submit"
 *         disabled={isSubmitting}
 *         className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
 *       >
 *         {isSubmitting ? 'Guardando...' : 'Crear Empleado'}
 *       </button>
 *     </form>
 *   )
 * }
 *
 * ============================================================================
 * PROPS COMUNES A TODOS LOS COMPONENTES
 * ============================================================================
 *
 * Todos los componentes de formulario aceptan:
 *
 * - name: string                          ← ID del campo (requerido)
 * - label?: string                        ← Etiqueta visible
 * - placeholder?: string                  ← Placeholder
 * - description?: string                  ← Descripción adicional
 * - hint?: string                         ← Ayuda (diferente de error)
 * - required?: boolean                    ← Muestra asterisco
 * - disabled?: boolean                    ← Campo deshabilitado
 * - isLoading?: boolean                   ← Muestra spinner
 * - error?: FieldError                    ← Error de react-hook-form
 * - containerClassName?: string           ← CSS del contenedor
 * - inputClassName?: string               ← CSS del input
 * - onChange?: (value) => void           ← Callback on change
 *
 * ============================================================================
 * COMPONENTES INDIVIDUALES
 * ============================================================================
 *
 * FORMINPUT
 * ├── type: 'text'|'email'|'password'|'number'|'tel'|'url'
 * ├── min?: number                        (para number)
 * ├── max?: number                        (para number)
 * ├── pattern?: string                    (regex)
 * ├── maxLength?: number
 * ├── showCounter?: boolean               (muestra contador de chars)
 * ├── autoComplete?: string
 * └── icon?: ReactNode                    (icon izquierda)
 *
 * FORMSELECT
 * ├── options: SelectOption[]             (requerido)
 * ├── multiple?: boolean
 * ├── showDefault?: boolean               (muestra option vacía)
 * ├── defaultOptionText?: string
 * └── searchable?: boolean                (future: search)
 *
 * FORMTEXTAREA
 * ├── rows?: number                       (default 4)
 * ├── resizable?: boolean
 * ├── maxLength?: number
 * ├── showCounter?: boolean
 * └── description?: string
 *
 * FORMDATEPICKER
 * ├── minDate?: Date
 * ├── maxDate?: Date
 * ├── format?: string                     (future: custom format)
 * └── includeTime?: boolean               (datetime-local)
 *
 * FORMFILEUPLOAD
 * ├── accept?: string                     (eg: 'image/*', '.pdf')
 * ├── multiple?: boolean
 * ├── maxSize?: number                    (en MB, default 10)
 * ├── dragAndDropText?: string
 * ├── onFileSelect?: (files) => void
 * └── showPreview?: boolean
 *
 * FORMSWITCH
 * ├── activeText?: string                 (ej: 'Activo')
 * ├── inactiveText?: string               (ej: 'Inactivo')
 * ├── size?: 'sm'|'md'|'lg'
 * └── (muestra toggle visual bonito)
 *
 * ============================================================================
 * PATRONES COMUNES
 * ============================================================================
 *
 * VALIDACIÓN CON ZOD
 *
 * const schema = z.object({
 *   // Strings
 *   name: z.string().min(3).max(100),
 *   email: z.string().email(),
 *   password: z.string().min(8),
 *
 *   // Números
 *   age: z.number().min(18).max(100),
 *   salary: z.number().positive(),
 *
 *   // Enums
 *   role: z.enum(['ADMIN', 'USER']),
 *
 *   // Dates
 *   birthDate: z.string().refine(
 *     (date) => new Date(date) < new Date(),
 *     'Debe ser una fecha anterior a hoy'
 *   ),
 *
 *   // Condicionales
 *   website: z.string().url().optional(),
 *
 *   // Custom validation
 *   confirmPassword: z.string(),
 * }).refine((data) => data.password === data.confirmPassword, {
 *   message: 'Las contraseñas no coinciden',
 *   path: ['confirmPassword'],
 * })
 *
 * MANEJO DE ERRORES
 *
 * const { register, handleSubmit, formState: { errors, isSubmitting } } =
 *   useForm({
 *     resolver: zodResolver(schema),
 *   })
 *
 * {errors.email && (
 *   <FormInput {...register('email')} error={errors.email} />
 * )}
 *
 * VALORES POR DEFECTO
 *
 * const { register } = useForm({
 *   defaultValues: {
 *     name: 'Juan',
 *     role: 'USER',
 *     isActive: true,
 *   }
 * })
 *
 * WATCH Y COMPUTED FIELDS
 *
 * const { register, watch } = useForm()
 * const isActive = watch('isActive')
 *
 * {isActive && (
 *   <FormInput {...register('activeReason')} />
 * )}
 *
 * ASYNC VALIDATION
 *
 * const schema = z.object({
 *   email: z.string().email(),
 * }).refine(
 *   async (data) => {
 *     const exists = await checkEmailExists(data.email)
 *     return !exists
 *   },
 *   { message: 'Email ya registrado', path: ['email'] }
 * )
 *
 * ============================================================================
 * ESTILOS
 * ============================================================================
 *
 * COLORES
 * ├── Border: border-gray-200, hover:border-gray-300
 * ├── Error: border-red-500, bg-red-50
 * ├── Focus: ring-blue-500/20, border-blue-500
 * ├── Disabled: bg-gray-50, text-gray-500
 * └── Loading: spinner azul
 *
 * SPACING
 * ├── Inputs: px-4 py-2.5
 * ├── Container: gap-3, space-y-3
 * ├── Form: space-y-6
 * └── Buttons: px-6 py-2
 *
 * TIPOGRAFÍA
 * ├── Labels: text-sm font-medium
 * ├── Inputs: text-sm font-normal
 * ├── Errors: text-sm text-red-600
 * ├── Hints: text-xs text-gray-500
 * └── Placeholders: placeholder-gray-400
 *
 * TRANSICIONES
 * ├── Border/Background: duration-200
 * ├── Ring: focus:ring-2
 * └── Hover: smooth
 *
 * ============================================================================
 * ACCESIBILIDAD
 * ============================================================================
 *
 * ✅ Semantic HTML
 * ├── <label> para labels
 * ├── <input>, <select>, <textarea> con name
 * ├── <form> para formularios
 * └── Proper error association
 *
 * ✅ Keyboard Navigation
 * ├── Tab entre campos
 * ├── Enter para submit
 * ├── Space para switch
 * └── Arrow keys para select
 *
 * ✅ Screen Readers
 * ├── Labels asociadas a inputs
 * ├── Error messages accessible
 * ├── Descriptive placeholders
 * └── Hint text clara
 *
 * ============================================================================
 * PRÓXIMOS PASOS
 * ============================================================================
 *
 * 1. CREAR FORMULARIOS ESPECÍFICOS
 *    ├── CreateEmployeeForm
 *    ├── EditEmployeeForm
 *    ├── CreatePermissionForm
 *    └── EditPermissionForm
 *
 * 2. INTEGRAR CON SERVICIOS
 *    └── Llamar employeesService.createEmployee() on submit
 *
 * 3. MANEJAR ASYNC OPERATIONS
 *    ├── Loading states durante submission
 *    ├── Error handling y display
 *    └── Success messages
 *
 * 4. VALIDACIÓN ASINCRÓNICA
 *    ├── Check email availability
 *    ├── Validate against backend
 *    └── Real-time validation
 *
 * 5. MEJORAMIENTOS FUTUROS
 *    ├── Rich text editor
 *    ├── Better date picker (react-day-picker)
 *    ├── Tags input
 *    ├── Slider component
 *    └── Multi-step forms
 *
 */
