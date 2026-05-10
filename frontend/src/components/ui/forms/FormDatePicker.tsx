'use client'

import { forwardRef } from 'react'
import type { FormDatePickerProps } from './types'
import { FormField } from './FormField'
import { CalendarIcon } from 'lucide-react'

/**
 * Componente de date picker para formularios
 * Usa input type="date" nativo (se puede mejorar con librería si se necesita)
 */
export const FormDatePicker = forwardRef<
  HTMLInputElement,
  FormDatePickerProps<any>
>(function FormDatePicker(
  {
    name,
    label,
    placeholder,
    description,
    required,
    disabled,
    isLoading,
    error,
    containerClassName,
    inputClassName = '',
    onChange,
    hint,
    minDate,
    maxDate,
    includeTime = false,
    ...rest
  },
  ref
) {
  const hasError = !!error
  const inputType = includeTime ? 'datetime-local' : 'date'

  // Convertir Date a string en formato YYYY-MM-DD o YYYY-MM-DDTHH:mm
  const formatDateForInput = (date?: Date): string => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    if (includeTime) {
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day}T${hours}:${minutes}`
    }
    return `${year}-${month}-${day}`
  }

  return (
    <FormField
      label={label}
      error={error}
      required={required}
      description={description}
      hint={hint}
      containerClassName={containerClassName}
    >
      <div className="relative">
        {/* Calendar icon */}
        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

        {/* Input */}
        <input
          ref={ref}
          type={inputType}
          name={name}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          min={formatDateForInput(minDate)}
          max={formatDateForInput(maxDate)}
          onChange={(e) => {
            // Compatible con react-hook-form ChangeHandler
            if (typeof onChange === 'function') {
              (onChange as any)(e)
            }
          }}
          className={`
            w-full px-4 py-2.5 pl-10 text-sm font-normal
            border border-gray-200 rounded-lg
            text-gray-900 placeholder-gray-400
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            hover:border-gray-300
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-200
            ${hasError ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}
            ${inputClassName}
          `}
          {...rest}
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin">
              <svg
                className="w-4 h-4 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </FormField>
  )
})

FormDatePicker.displayName = 'FormDatePicker'
