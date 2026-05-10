'use client'

import { forwardRef } from 'react'
import type { FormTextareaProps } from './types'
import { FormField } from './FormField'

/**
 * Componente de textarea para formularios
 */
export const FormTextarea = forwardRef<
  HTMLTextAreaElement,
  FormTextareaProps<any>
>(function FormTextarea(
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
    rows = 4,
    resizable = true,
    showCounter = true,
    maxLength,
    ...rest
  },
  ref
) {
  const hasError = !!error
  // currentLength will be managed by parent through FormField props
  const currentLength = 0

  return (
    <FormField
      label={label}
      error={error}
      required={required}
      description={description}
      hint={hint}
      containerClassName={containerClassName}
      showCounter={showCounter}
      currentLength={currentLength}
      maxLength={maxLength}
    >
      <textarea
        ref={ref}
        name={name}
        placeholder={placeholder}
        disabled={disabled || isLoading}
        rows={rows}
        maxLength={maxLength}
        onChange={(e) => {
          // Compatible con react-hook-form ChangeHandler
          if (typeof onChange === 'function') {
            (onChange as any)(e)
          }
        }}
        className={`
          w-full px-4 py-2.5 text-sm font-normal
          border border-gray-200 rounded-lg
          text-gray-900 placeholder-gray-400
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
          hover:border-gray-300
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed disabled:border-gray-200
          ${resizable ? 'resize' : 'resize-none'}
          ${hasError ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''}
          ${inputClassName}
        `}
        {...rest}
      />
    </FormField>
  )
})

FormTextarea.displayName = 'FormTextarea'
