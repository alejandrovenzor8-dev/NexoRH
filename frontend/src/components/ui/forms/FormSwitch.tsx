'use client'

import { forwardRef } from 'react'
import type { FormSwitchProps } from './types'
import { FormField } from './FormField'

/**
 * Componente de switch/toggle para formularios
 */
export const FormSwitch = forwardRef<
  HTMLInputElement,
  FormSwitchProps<any>
>(function FormSwitch(
  {
    name,
    label,
    description,
    required,
    disabled,
    isLoading,
    error,
    containerClassName,
    onChange,
    hint,
    activeText,
    inactiveText,
    size = 'md',
    ...rest
  },
  ref
) {
  const hasError = !!error
  const isChecked = (rest as any).checked || (rest as any).defaultChecked

  // Size mappings
  const sizeClasses = {
    sm: {
      container: 'w-8 h-5',
      toggle: 'w-4 h-4',
      translate: 'translate-x-3.5',
    },
    md: {
      container: 'w-10 h-6',
      toggle: 'w-5 h-5',
      translate: 'translate-x-4.5',
    },
    lg: {
      container: 'w-12 h-7',
      toggle: 'w-6 h-6',
      translate: 'translate-x-5.5',
    },
  }

  const sizes = sizeClasses[size]

  return (
    <FormField
      label={label}
      error={error}
      required={required}
      description={description}
      hint={hint}
      containerClassName={containerClassName}
    >
      <div className="flex items-center gap-3">
        {/* Hidden input */}
        <input
          ref={ref}
          type="checkbox"
          name={name}
          disabled={disabled || isLoading}
          onChange={(e) => {
            // Compatible con react-hook-form ChangeHandler
            if (typeof onChange === 'function') {
              (onChange as any)(e)
            }
          }}
          className="hidden"
          {...rest}
        />

        {/* Visual switch */}
        <button
          type="button"
          disabled={disabled || isLoading}
          onClick={() => {
            if (!disabled && !isLoading) {
              const input = ref as any
              if (input?.current) {
                input.current.checked = !input.current.checked
                input.current.dispatchEvent(
                  new Event('change', { bubbles: true })
                )
              }
            }
          }}
          className={`
            relative inline-flex flex-shrink-0
            transition-colors duration-300
            rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${sizes.container}
            ${isChecked ? 'bg-blue-600' : 'bg-gray-300'}
            ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {/* Toggle circle */}
          <span
            className={`
              ${sizes.toggle}
              inline-block bg-white rounded-full shadow
              transition-transform duration-300
              ${isChecked ? sizes.translate : 'translate-x-0.5'}
              pointer-events-none
            `}
          />
        </button>

        {/* Labels */}
        {(activeText || inactiveText) && (
          <span className="text-sm font-medium text-gray-700">
            {isChecked ? activeText || 'Activado' : inactiveText || 'Desactivado'}
          </span>
        )}

        {/* Loading */}
        {isLoading && (
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
        )}
      </div>
    </FormField>
  )
})

FormSwitch.displayName = 'FormSwitch'
