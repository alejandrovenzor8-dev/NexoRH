'use client'

import { forwardRef } from 'react'
import type { FieldValues } from 'react-hook-form'
import type { FormInputProps } from './types'
import { FormField } from './FormField'

/**
 * Componente de input genérico para formularios
 * Soporta: text, email, password, number, tel, url
 */
export const FormInput = forwardRef<
  HTMLInputElement,
  FormInputProps<any>
>(function FormInput(
  {
    name,
    label,
    type = 'text',
    placeholder,
    description,
    required,
    disabled,
    isLoading,
    error,
    containerClassName,
    inputClassName = '',
    icon,
    onChange,
    hint,
    showCounter = false,
    maxLength,
    min,
    max,
    pattern,
    autoComplete,
    ...rest
  },
  ref
) {
  const hasError = !!error
  // currentLength will be managed by parent through FormField props
  // This is a placeholder that gets overridden
  const currentLength = 0

  return (
    <FormField
      label={label}
      error={error}
      required={required}
      description={description}
      hint={hint}
      containerClassName={containerClassName}
      showCounter={showCounter && type !== 'number'}
      currentLength={currentLength}
      maxLength={maxLength}
    >
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          type={type}
          name={name}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          maxLength={maxLength}
          min={min}
          max={max}
          pattern={pattern}
          autoComplete={autoComplete}
          onChange={(e) => {
            // Compatible con react-hook-form ChangeHandler
            if (typeof onChange === 'function') {
              (onChange as any)(e)
            }
          }}
          className={`
            w-full px-4 py-2.5 text-sm font-normal
            ${icon ? 'pl-10' : 'pl-4'}
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

FormInput.displayName = 'FormInput'
