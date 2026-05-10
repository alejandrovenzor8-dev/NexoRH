'use client'

import { forwardRef } from 'react'
import type { FormSelectProps } from './types'
import { FormField } from './FormField'
import { ChevronDownIcon } from 'lucide-react'

/**
 * Componente de select para formularios
 * Soporta single y multi-select
 */
export const FormSelect = forwardRef<
  HTMLSelectElement,
  FormSelectProps<any>
>(function FormSelect(
  {
    name,
    label,
    options,
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
    showDefault = true,
    defaultOptionText = 'Selecciona una opción',
    multiple = false,
    ...rest
  },
  ref
) {
  const hasError = !!error

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
        {/* Select */}
        <select
          ref={ref}
          name={name}
          disabled={disabled || isLoading}
          multiple={multiple}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            // Compatible con react-hook-form ChangeHandler
            if (typeof onChange === 'function') {
              if (multiple) {
                const options = (e.target as HTMLSelectElement).selectedOptions
                const selectedValues: string[] = []
                for (let i = 0; i < options.length; i++) {
                  selectedValues.push(options[i].value)
                }
                (onChange as any)({ target: { value: selectedValues } })
              } else {
                (onChange as any)(e)
              }
            }
          }}
          className={`
            w-full px-4 py-2.5 text-sm font-normal
            pr-10
            border border-gray-200 rounded-lg
            text-gray-900
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            hover:border-gray-300
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-200
            appearance-none
            ${hasError ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}
            ${inputClassName}
          `}
          {...rest}
        >
          {showDefault && !multiple && (
            <option value="">{defaultOptionText}</option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              title={option.description}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Chevron icon */}
        <ChevronDownIcon
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          strokeWidth={3}
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
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

FormSelect.displayName = 'FormSelect'
