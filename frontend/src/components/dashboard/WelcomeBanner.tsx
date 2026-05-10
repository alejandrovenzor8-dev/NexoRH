import { Sparkles, ShieldCheck } from 'lucide-react'
import { UserSession } from '@/types/auth'

interface WelcomeBannerProps {
  user: UserSession
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  MANAGER: 'Manager',
  USER: 'Usuario',
}

export default function WelcomeBanner({ user }: WelcomeBannerProps) {
  const firstName = user.fullName.split(' ')[0]

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 p-6 sm:p-7 text-white shadow-sm mb-8 transition-all duration-300 hover:shadow-md">
      <div className="absolute -right-8 -top-8 w-28 h-28 bg-white/10 rounded-full blur-sm" />
      <div className="absolute right-16 -bottom-10 w-32 h-32 bg-indigo-400/30 rounded-full blur-md" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Espacio de trabajo enterprise
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2">
            Bienvenido, {firstName}
          </h1>
          <p className="text-sm text-blue-100 max-w-xl leading-relaxed">
            Has iniciado sesión como <strong>{ROLE_LABELS[user.role] ?? user.role}</strong>. Aquí tienes un resumen ejecutivo del estado actual de tu organización.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-sm font-medium shrink-0">
          <ShieldCheck className="w-4 h-4" />
          Entorno seguro
        </div>
      </div>
    </section>
  )
}
