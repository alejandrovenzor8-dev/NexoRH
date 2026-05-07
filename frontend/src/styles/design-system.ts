export const designSystem = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#2563eb',
      600: '#1d4ed8',
      700: '#1e40af',
    },
    success: {
      50: '#ecfdf5',
      100: '#d1fae5',
      500: '#10b981',
      600: '#059669',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706',
    },
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626',
    },
    sidebar: {
      900: '#0f172a',
      800: '#1e293b',
    },
    background: '#f8fafc',
    card: '#ffffff',
    muted: '#64748b',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  radius: {
    card: '0.875rem',
    button: '0.625rem',
    modal: '1rem',
  },
  shadows: {
    card: '0 1px 2px 0 rgb(15 23 42 / 0.06), 0 1px 1px -1px rgb(15 23 42 / 0.06)',
    hover: '0 10px 20px -10px rgb(15 23 42 / 0.25)',
    modal: '0 24px 48px -24px rgb(15 23 42 / 0.4)',
  },
  typography: {
    headings: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif',
    body: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif',
    captions: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif',
  },
} as const

export type DesignSystem = typeof designSystem
