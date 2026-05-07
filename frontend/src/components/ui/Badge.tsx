import { HTMLAttributes } from 'react'

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'muted'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const BADGE_STYLES: Record<BadgeVariant, string> = {
  primary: 'bg-primary-100 text-primary-700 ring-primary-100',
  success: 'bg-success-100 text-success-600 ring-success-100',
  warning: 'bg-warning-100 text-warning-600 ring-warning-100',
  danger: 'bg-danger-100 text-danger-600 ring-danger-100',
  muted: 'bg-slate-100 text-slate-600 ring-slate-100',
}

export default function Badge({ variant = 'muted', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
        BADGE_STYLES[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </span>
  )
}
