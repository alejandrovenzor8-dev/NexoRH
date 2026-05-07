import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, className = '', id, ...props },
  ref,
) {
  const inputId = id ?? props.name

  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        className={[
          'w-full h-10 rounded-button border bg-card px-3 text-sm text-slate-900 shadow-card transition-all',
          'placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          error ? 'border-danger-500' : 'border-slate-200',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
      {error ? <p className="text-xs text-danger-600">{error}</p> : hint ? <p className="caption">{hint}</p> : null}
    </div>
  )
})

export default Input
