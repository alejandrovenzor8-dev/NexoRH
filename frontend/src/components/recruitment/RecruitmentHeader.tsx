'use client'

import { PlusIcon, DownloadIcon } from 'lucide-react'
import type { RecruitmentStats } from '@/types/recruitment'

interface RecruitmentHeaderProps {
  stats: RecruitmentStats
  onNewForm: () => void
  onExport: () => void
  isLoading?: boolean
}

/**
 * Header del tablero de reclutamiento con stats
 */
export function RecruitmentHeader({
  stats,
  onNewForm,
  onExport,
  isLoading = false,
}: RecruitmentHeaderProps) {
  const statCards = [
    {
      label: 'Aplicaciones nuevas',
      value: stats.newApplications,
      icon: '📥',
      color: 'blue',
    },
    {
      label: 'En revisión',
      value: stats.inReview,
      icon: '👀',
      color: 'purple',
    },
    {
      label: 'Entrevistas',
      value: stats.interviews,
      icon: '📞',
      color: 'amber',
    },
    {
      label: 'Seleccionados',
      value: stats.selected,
      icon: '✨',
      color: 'green',
    },
  ]

  const colorMap = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    green: 'bg-green-50 border-green-200 text-green-700',
  }

  return (
    <div className="space-y-6">
      {/* Título y descripción */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Pipeline de Reclutamiento
        </h1>
        <p className="text-gray-600 mt-1">
          Gestiona candidatos y procesos de contratación
        </p>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3">
        <button
          onClick={onNewForm}
          disabled={isLoading}
          className="
            flex items-center gap-2 px-4 py-2.5
            bg-blue-600 text-white rounded-lg
            hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors font-medium text-sm
          "
        >
          <PlusIcon className="w-4 h-4" />
          Nuevo formulario
        </button>
        <button
          onClick={onExport}
          disabled={isLoading}
          className="
            flex items-center gap-2 px-4 py-2.5
            border border-gray-300 text-gray-700 rounded-lg
            hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors font-medium text-sm
          "
        >
          <DownloadIcon className="w-4 h-4" />
          Exportar candidatos
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const colorClass = colorMap[stat.color as keyof typeof colorMap]

          return (
            <div
              key={stat.label}
              className={`p-4 rounded-xl border-2 ${colorClass}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-75">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Info adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
          <p className="text-sm text-gray-600">Total de candidatos</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {stats.totalCandidates}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
          <p className="text-sm text-gray-600">Score promedio</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {stats.avgScore.toFixed(1)}/10
          </p>
        </div>
      </div>
    </div>
  )
}
