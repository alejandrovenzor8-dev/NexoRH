/**
 * FORMS ENTERPRISE - BARREL EXPORT
 * 
 * Sistema completo y reutilizable de formularios para NexoRH.
 * 
 * COMPONENTES:
 * - FormInput: Text, email, password, number, tel, url
 * - FormSelect: Single and multi-select dropdowns
 * - FormTextarea: Multi-line text input
 * - FormDatePicker: Native date/datetime inputs
 * - FormFileUpload: Drag and drop file uploads
 * - FormSwitch: Toggle/switch buttons
 * - FormField: Wrapper para labels, errors, hints
 * 
 * FEATURES:
 * - Integración con react-hook-form
 * - Validación con zod
 * - TypeScript fully typed
 * - Accesibilidad (labels, aria-*, semantic HTML)
 * - Loading states
 * - Error messages
 * - Disabled states
 * - Mucho spacing (minimalista)
 * - Hover states suaves
 * - Transiciones
 */

// Componentes
export { FormField } from './FormField'
export { FormInput } from './FormInput'
export { FormSelect } from './FormSelect'
export { FormTextarea } from './FormTextarea'
export { FormDatePicker } from './FormDatePicker'
export { FormFileUpload } from './FormFileUpload'
export { FormSwitch } from './FormSwitch'

// Tipos
export type {
  BaseFieldProps,
  FormInputProps,
  FormSelectProps,
  FormTextareaProps,
  FormDatePickerProps,
  FormFileUploadProps,
  FormSwitchProps,
  SelectOption,
  FormFieldProps,
  FieldValidation,
  FormState,
  UseFormOptions,
} from './types'
