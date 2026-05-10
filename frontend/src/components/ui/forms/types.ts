/**
 * TIPOS PARA SISTEMA DE FORMULARIOS ENTERPRISE
 */

import type { FieldValues, Path, UseFormRegister, UseFormWatch, FieldError, ChangeHandler } from 'react-hook-form'
import type { ReactNode } from 'react'

/**
 * Props comunes para todos los campos de formulario
 */
export interface BaseFieldProps<T extends FieldValues> {
  /** Nombre del campo (debe ser una clave válida de T) */
  name: Path<T>
  /** Etiqueta del campo */
  label?: string
  /** Placeholder */
  placeholder?: string
  /** Descripción adicional debajo del label */
  description?: string
  /** Campo obligatorio */
  required?: boolean
  /** Deshabilitado */
  disabled?: boolean
  /** Estado de carga */
  isLoading?: boolean
  /** Mensaje de error personalizado */
  error?: FieldError
  /** Classes CSS personalizadas del contenedor */
  containerClassName?: string
  /** Classes CSS personalizadas del input */
  inputClassName?: string
  /** Ícono a mostrar antes del input */
  icon?: ReactNode
  /** Callback cuando cambia el valor (compatible con react-hook-form) */
  onChange?: ChangeHandler | ((value: unknown) => void)
  /** Hint text (ayuda) */
  hint?: string
  /** Mostrar counter si es text/textarea */
  showCounter?: boolean
  /** Máximo de caracteres */
  maxLength?: number
}

/**
 * Props específicas para FormInput
 */
export interface FormInputProps<T extends FieldValues> extends BaseFieldProps<T> {
  /** Tipo de input */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  /** Mín value para number inputs (puede venir de register como string) */
  min?: string | number
  /** Max value para number inputs (puede venir de register como string) */
  max?: string | number
  /** Patrón regex (como string para HTML pattern attribute) */
  pattern?: string
  /** Auto-complete hint */
  autoComplete?: string
}

/**
 * Props específicas para FormSelect
 */
export interface FormSelectProps<T extends FieldValues> extends BaseFieldProps<T> {
  /** Opciones del select */
  options: SelectOption[]
  /** Mostrar opción por defecto (vacía) */
  showDefault?: boolean
  /** Texto de opción por defecto */
  defaultOptionText?: string
  /** Multi-select */
  multiple?: boolean
  /** Searchable (con future enhancement) */
  searchable?: boolean
}

/**
 * Props específicas para FormTextarea
 */
export interface FormTextareaProps<T extends FieldValues> extends BaseFieldProps<T> {
  /** Número de filas */
  rows?: number
  /** Permitir resize */
  resizable?: boolean
}

/**
 * Props específicas para FormDatePicker
 */
export interface FormDatePickerProps<T extends FieldValues> extends BaseFieldProps<T> {
  /** Fecha mínima permitida */
  minDate?: Date
  /** Fecha máxima permitida */
  maxDate?: Date
  /** Formato de visualización */
  format?: string
  /** Mostrar hora también */
  includeTime?: boolean
}

/**
 * Props específicas para FormFileUpload
 */
export interface FormFileUploadProps<T extends FieldValues> extends BaseFieldProps<T> {
  /** Tipos de archivo permitidos */
  accept?: string
  /** Múltiples archivos */
  multiple?: boolean
  /** Tamaño máximo en MB */
  maxSize?: number
  /** Texto de drag and drop */
  dragAndDropText?: string
  /** Callback cuando se selecciona archivo */
  onFileSelect?: (files: File[]) => void
  /** Mostrar vista previa */
  showPreview?: boolean
}

/**
 * Props específicas para FormSwitch
 */
export interface FormSwitchProps<T extends FieldValues> extends BaseFieldProps<T> {
  /** Texto cuando está activo */
  activeText?: string
  /** Texto cuando está inactivo */
  inactiveText?: string
  /** Size del switch */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Opción para select/multi-select/radio/checkbox
 */
export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
  description?: string
}

/**
 * Props para FormField wrapper
 */
export interface FormFieldProps {
  /** Label del campo */
  label?: string
  /** Error del campo */
  error?: FieldError
  /** Requerido */
  required?: boolean
  /** Descripción */
  description?: string
  /** Hint */
  hint?: string
  /** Contenido del campo */
  children: ReactNode
  /** Container classes */
  containerClassName?: string
  /** Show counter */
  showCounter?: boolean
  /** Current length (para counter) */
  currentLength?: number
  /** Max length (para counter) */
  maxLength?: number
}

/**
 * Opciones de validación para un campo
 */
export interface FieldValidation {
  required?: boolean | string
  min?: number | { value: number; message: string }
  max?: number | { value: number; message: string }
  minLength?: number | { value: number; message: string }
  maxLength?: number | { value: number; message: string }
  pattern?: { value: RegExp; message: string }
  validate?: (value: unknown) => boolean | string
}

/**
 * Estado de formulario
 */
export interface FormState {
  /** Formulario en envío */
  isSubmitting: boolean
  /** Hay cambios sin guardar */
  isDirty: boolean
  /** Errores del formulario */
  errors: Record<string, FieldError | undefined>
  /** Campos touched */
  touched: Record<string, boolean>
  /** Valores actuales */
  values: Record<string, unknown>
}

/**
 * Opciones para crear un hook de formulario
 */
export interface UseFormOptions<T extends FieldValues> {
  /** Schema de validación con zod */
  schema?: unknown
  /** Valores por defecto */
  defaultValues?: Partial<T>
  /** Modo de validación */
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all'
  /** Revalidar después de cambios exitosos */
  reValidateMode?: 'onChange' | 'onBlur' | 'onSubmit'
  /** Usar async validation */
  async?: boolean
}
