import { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
}

interface CardHeaderProps {
  title: string
  description?: string
  action?: ReactNode
}

export function Card({ hoverable = false, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={[
        'rounded-card border border-slate-200 bg-card shadow-card',
        hoverable ? 'transition-all duration-200 hover:shadow-hover hover:-translate-y-0.5' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, description, action }: CardHeaderProps) {
  return (
    <div className="px-lg pt-lg pb-md border-b border-slate-100 flex items-start justify-between gap-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {description ? <p className="text-sm text-muted mt-0.5">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export function CardBody({ className = '', children }: HTMLAttributes<HTMLDivElement>) {
  return <div className={['p-lg', className].filter(Boolean).join(' ')}>{children}</div>
}
