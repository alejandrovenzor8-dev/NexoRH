/**
 * EJEMPLO: Create Employee Form
 * 
 * Demuestra cómo usar el sistema completo de formularios con:
 * - Zod para validación
 * - react-hook-form para gestión
 * - Todos los componentes de FormInput, Select, etc
 * - Integración con servicios
 * - Error handling
 */

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  FormInput,
  FormSelect,
  FormTextarea,
  FormDatePicker,
  FormFileUpload,
  FormSwitch,
} from '@/components/ui/forms'
import type { SelectOption } from '@/components/ui/forms'
import { EmployeeRole } from '@/types/employee'

/**
 * Schema de validación con Zod
 */
const createEmployeeSchema = z.object({
  fullName: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z
    .string()
    .email('Por favor ingresa un email válido'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[+\d\s-()]+$/.test(val),
      'El teléfono no es válido'
    ),
  role: z
    .enum([EmployeeRole.ADMIN, EmployeeRole.MANAGER, EmployeeRole.USER])
    .refine((val) => val !== undefined, 'Debes seleccionar un rol'),
  department: z
    .string()
    .min(1, 'Debes seleccionar un departamento'),
  hiredAt: z
    .string()
    .refine(
      (val) => new Date(val) <= new Date(),
      'La fecha no puede ser en el futuro'
    ),
  bio: z
    .string()
    .max(500, 'La bio no puede exceder 500 caracteres')
    .optional(),
  profileImage: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      'La imagen no debe exceder 5MB'
    ),
  isActive: z.boolean(),
})

type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>

/**
 * Props del componente
 */
interface CreateEmployeeFormProps {
  onSuccess?: (employee: any) => void
  onError?: (error: string) => void
  defaultValues?: Partial<CreateEmployeeInput>
  isLoading?: boolean
}

/**
 * Componente: Create Employee Form
 */
export function CreateEmployeeForm({
  onSuccess,
  onError,
  defaultValues,
  isLoading: externalLoading = false,
}: CreateEmployeeFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    watch,
    reset,
  } = useForm<CreateEmployeeInput>({
    resolver: zodResolver(createEmployeeSchema),
    mode: 'onChange',
    defaultValues: {
      isActive: true,
      ...defaultValues,
    },
  })

  const isLoading = isSubmitting || externalLoading

  /**
   * Opciones para selects
   */
  const roleOptions: SelectOption[] = [
    { label: 'Admin', value: EmployeeRole.ADMIN, description: 'Acceso completo al sistema' },
    { label: 'Manager', value: EmployeeRole.MANAGER, description: 'Gestión de equipo' },
    { label: 'Usuario', value: EmployeeRole.USER, description: 'Usuario estándar' },
  ]

  const departmentOptions: SelectOption[] = [
    { label: 'Ventas', value: 'SALES' },
    { label: 'Tecnología', value: 'IT' },
    { label: 'Recursos Humanos', value: 'HR' },
    { label: 'Finanzas', value: 'FINANCE' },
    { label: 'Marketing', value: 'MARKETING' },
  ]

  /**
   * Manejador de submit
   */
  const onSubmit = async (data: CreateEmployeeInput) => {
    try {
      // Aquí iría la llamada al servicio
      // const newEmployee = await employeesService.createEmployee(data)
      // onSuccess?.(newEmployee)
      
      console.log('Form data:', data)
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSuccess?.(data)
      reset()
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Error al crear empleado')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* SECCIÓN: INFORMACIÓN PERSONAL */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Información Personal
        </h3>

        <FormInput
          {...register('fullName')}
          label="Nombre Completo"
          placeholder="Juan Pérez García"
          description="El nombre completo del empleado"
          error={errors.fullName}
          required
          isLoading={isLoading}
        />

        <FormInput
          {...register('email')}
          type="email"
          label="Email"
          placeholder="juan.perez@company.com"
          description="Email corporativo único"
          error={errors.email}
          required
          isLoading={isLoading}
        />

        <FormInput
          {...register('phone')}
          type="tel"
          label="Teléfono"
          placeholder="+34 600 000 000"
          description="Número de teléfono del empleado"
          error={errors.phone}
          hint="Formato: +34 600 000 000 o (600) 000-0000"
          isLoading={isLoading}
        />

        <FormTextarea
          {...register('bio')}
          label="Biografía"
          placeholder="Cuéntanos sobre ti, tu experiencia y especialidades..."
          description="Información profesional adicional (máximo 500 caracteres)"
          error={errors.bio}
          maxLength={500}
          showCounter
          rows={4}
          isLoading={isLoading}
        />
      </div>

      {/* SECCIÓN: POSICIÓN Y DEPARTAMENTO */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Posición y Departamento
        </h3>

        <FormSelect
          {...register('role')}
          label="Rol"
          description="Nivel de acceso y permisos en el sistema"
          options={roleOptions}
          error={errors.role}
          required
          isLoading={isLoading}
        />

        <FormSelect
          {...register('department')}
          label="Departamento"
          description="Departamento donde trabaja el empleado"
          options={departmentOptions}
          error={errors.department}
          required
          isLoading={isLoading}
        />

        <FormDatePicker
          {...register('hiredAt')}
          label="Fecha de Inicio"
          description="Fecha cuando el empleado comienza a trabajar"
          error={errors.hiredAt}
          required
          maxDate={new Date()}
          isLoading={isLoading}
        />
      </div>

      {/* SECCIÓN: ARCHIVOS */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Archivos
        </h3>

        <FormFileUpload
          {...register('profileImage')}
          label="Foto de Perfil"
          description="Foto de perfil del empleado"
          accept="image/*"
          maxSize={5}
          dragAndDropText="Arrastra una imagen aquí o haz clic para seleccionar"
          error={errors.profileImage}
          hint="JPG, PNG o GIF. Máximo 5MB"
          isLoading={isLoading}
        />
      </div>

      {/* SECCIÓN: ESTADO */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Estado
        </h3>

        <FormSwitch
          {...register('isActive')}
          label="Empleado Activo"
          description="Indica si el empleado está activo o inactivo"
          activeText="Activo"
          inactiveText="Inactivo"
          error={errors.isActive}
          isLoading={isLoading}
        />
      </div>

      {/* ACCIONES */}
      <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
        <button
          type="reset"
          disabled={isLoading || !isDirty}
          className="px-6 py-2.5 text-sm font-medium
            text-gray-700 border border-gray-300 rounded-lg
            hover:bg-gray-50 hover:border-gray-400
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors"
        >
          Limpiar
        </button>
        <button
          type="submit"
          disabled={isLoading || !isDirty}
          className="px-6 py-2.5 text-sm font-medium
            bg-blue-600 text-white rounded-lg
            hover:bg-blue-700
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors"
        >
          {isLoading ? 'Creando...' : 'Crear Empleado'}
        </button>
      </div>
    </form>
  )
}

/**
 * ============================================================================
 * CÓMO USAR ESTE COMPONENTE
 * ============================================================================
 *
 * // En una página
 * 'use client'
 *
 * import { useState } from 'react'
 * import { useRouter } from 'next/navigation'
 * import { CreateEmployeeForm } from '@/components/ui/forms/EXAMPLE_CREATE_EMPLOYEE_FORM'
 *
 * export default function CreateEmployeePage() {
 *   const router = useRouter()
 *   const [error, setError] = useState<string | null>(null)
 *
 *   return (
 *     <div className="max-w-4xl mx-auto py-8 px-6">
 *       <h1 className="text-3xl font-bold text-gray-900 mb-8">
 *         Crear Nuevo Empleado
 *       </h1>
 *
 *       <CreateEmployeeForm
 *         onSuccess={(employee) => {
 *           router.push(`/employees/${employee.id}`)
 *         }}
 *         onError={(err) => {
 *           setError(err)
 *         }}
 *       />
 *
 *       {error && (
 *         <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
 *           {error}
 *         </div>
 *       )}
 *     </div>
 *   )
 * }
 *
 * ============================================================================
 */
