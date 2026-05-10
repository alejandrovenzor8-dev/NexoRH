'use client'

import type { FormFieldProps } from './types'

/**
 * Wrapper para campos de formulario
 * Proporciona label, error, descripción, hint y contador consistentes
 */
export function FormField({
  label,
  error,
  required,
  description,
  hint,
  children,
  containerClassName = '',
  showCounter = false,
  currentLength = 0,
  maxLength,
}: FormFieldProps) {
  const hasError = !!error
  const counterPercentage = maxLength ? (currentLength / maxLength) * 100 : 0
  const counterColor =
    counterPercentage > 80 ? 'text-red-600' : counterPercentage > 60 ? 'text-amber-600' : 'text-gray-400'

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          <span>{label}</span>
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Descripción */}
      {description && (
        <p className="text-xs text-gray-500 font-normal">{description}</p>
      )}

      {/* Field */}
      <div className="relative">{children}</div>

      {/* Error Message */}
      {hasError && (
        <div className="flex items-start gap-1.5 text-sm text-red-600">
          <svg
            className="w-4 h-4 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18.101 12.93a1 1 0 00-1.414-1.414L10 16.586l-6.687-6.687a1 1 0 00-1.414 1.414l8.1 8.1a1 1 0 001.414 0l8.1-8.1z"
            />
          </svg>
          <span>{error.message}</span>
        </div>
      )}

      {/* Hint */}
      {hint && !hasError && (
        <p className="text-xs text-gray-500">{hint}</p>
      )}

      {/* Counter */}
      {showCounter && maxLength && (
        <div className="flex items-center justify-between">
          <div className="w-full bg-gray-200 rounded-full h-1 mr-2">
            <div
              className={`h-1 rounded-full transition-all ${
                counterPercentage > 80
                  ? 'bg-red-500'
                  : counterPercentage > 60
                  ? 'bg-amber-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(counterPercentage, 100)}%` }}
            />
          </div>
          <span className={`text-xs font-medium whitespace-nowrap ml-2 ${counterColor}`}>
            {currentLength}/{maxLength}
          </span>
        </div>
      )}
    </div>
  )
}
