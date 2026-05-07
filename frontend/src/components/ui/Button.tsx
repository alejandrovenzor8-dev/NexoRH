import { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'success' | 'warning' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white focus-visible:ring-primary-500',
  success: 'bg-success-600 hover:bg-success-500 text-white focus-visible:ring-success-500',
  warning: 'bg-warning-500 hover:bg-warning-600 text-white focus-visible:ring-warning-500',
  danger: 'bg-danger-600 hover:bg-danger-500 text-white focus-visible:ring-danger-500',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 focus-visible:ring-primary-500',
}

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-sm',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 rounded-button font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled}
      {...props}
    >
      {leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
      <span>{children}</span>
      {rightIcon ? <span className="shrink-0">{rightIcon}</span> : null}
    </button>
  )
}
