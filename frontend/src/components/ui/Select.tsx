import { SelectHTMLAttributes, forwardRef } from 'react'

interface SelectOption {
  label: string
  value: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string
  hint?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, className = '', id, options, placeholder, ...props },
  ref,
) {
  const selectId = id ?? props.name

  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}
      <select
        ref={ref}
        id={selectId}
        className={[
          'w-full h-10 rounded-button border bg-card px-3 text-sm text-slate-900 shadow-card transition-all',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          error ? 'border-danger-500' : 'border-slate-200',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-xs text-danger-600">{error}</p> : hint ? <p className="caption">{hint}</p> : null}
    </div>
  )
})

export default Select
