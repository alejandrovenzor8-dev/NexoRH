import { Users, MessageSquare, Table2, UserSearch, Zap } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import { LucideIcon } from 'lucide-react'

interface Module {
  name: string
  description: string
  icon: LucideIcon
  active: boolean
  color: string
}

const MODULES: Module[] = [
  {
    name: 'Gestión de usuarios',
    description: 'Administra miembros del equipo, roles y permisos.',
    icon: Users,
    active: true,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    name: 'Mensajería',
    description: 'Chat interno y notificaciones en tiempo real.',
    icon: MessageSquare,
    active: false,
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    name: 'Tablas dinámicas',
    description: 'Gestión de datos personalizada con esquemas flexibles.',
    icon: Table2,
    active: false,
    color: 'text-purple-600 bg-purple-50',
  },
  {
    name: 'Reclutamiento',
    description: 'Ofertas de trabajo, postulaciones y seguimiento de candidatos.',
    icon: UserSearch,
    active: false,
    color: 'text-amber-600 bg-amber-50',
  },
  {
    name: 'Automatización',
    description: 'Flujos de trabajo basados en eventos y acciones automatizadas.',
    icon: Zap,
    active: false,
    color: 'text-rose-600 bg-rose-50',
  },
]

export default function ModulesGrid() {
  return (
    <section>
      <SectionHeader
        title="Módulos de la plataforma"
        description="Funcionalidades disponibles en NexoRH"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {MODULES.map((mod) => {
          const Icon = mod.icon
          return (
            <div
              key={mod.name}
              title={mod.active ? `${mod.name} disponible` : `${mod.name} próximamente`}
              className={`group bg-white rounded-2xl border p-5 transition-all duration-300 ${
                mod.active
                  ? 'border-gray-200/80 hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                  : 'border-gray-200/60 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mod.color} transition-transform duration-300 group-hover:scale-105`}>
                  <Icon className="w-5 h-5" />
                </div>
                {!mod.active && (
                  <span className="text-[10px] font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                    Próximamente
                  </span>
                )}
                {mod.active && (
                  <span className="text-[10px] font-medium bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                    Activo
                  </span>
                )}
              </div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1 tracking-tight">{mod.name}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{mod.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
