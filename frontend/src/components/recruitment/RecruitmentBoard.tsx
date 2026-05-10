'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRecruitment } from '@/hooks/useRecruitment'
import { CandidateStage } from '@/types/recruitment'
import { RecruitmentHeader } from './RecruitmentHeader'
import { KanbanColumn } from './KanbanColumn'

/**
 * Tablero Kanban principal de reclutamiento
 */
export function RecruitmentBoard() {
  const router = useRouter()
  const {
    candidatesByStage,
    loading,
    error,
    stats,
    fetchCandidates,
    moveCandidate,
    rejectCandidate,
    hireCandidate,
  } = useRecruitment()

  const [scrollPosition, setScrollPosition] = useState(0)

  // Cargar candidatos al montar
  useEffect(() => {
    fetchCandidates()
  }, [fetchCandidates])

  // Mapeo de stages a títulos en español
  const stageLabels = {
    [CandidateStage.APPLIED]: 'Aplicó',
    [CandidateStage.SCREENING]: 'En revisión',
    [CandidateStage.INTERVIEW]: 'Entrevista',
    [CandidateStage.OFFER]: 'Seleccionado',
    [CandidateStage.HIRED]: 'Contratado',
    [CandidateStage.REJECTED]: 'Rechazado',
  }

  const columns = [
    CandidateStage.APPLIED,
    CandidateStage.SCREENING,
    CandidateStage.INTERVIEW,
    CandidateStage.OFFER,
    CandidateStage.HIRED,
    CandidateStage.REJECTED,
  ]

  // Handlers
  const handleViewProfile = (id: string) => {
    router.push(`/recruitment/${id}`)
  }

  const handleScheduleInterview = (id: string) => {
    console.log('Agendar entrevista:', id)
    // TODO: Abrir modal de agendar entrevista
  }

  const handleNewForm = () => {
    console.log('Nuevo formulario')
    // TODO: Abrir modal para crear nuevo formulario de vacante
  }

  const handleExport = () => {
    console.log('Exportar candidatos')
    // TODO: Exportar a CSV o PDF
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <RecruitmentHeader
          stats={stats}
          onNewForm={handleNewForm}
          onExport={handleExport}
          isLoading
        />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-red-700 font-medium">Error al cargar candidatos</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <RecruitmentHeader
        stats={stats}
        onNewForm={handleNewForm}
        onExport={handleExport}
      />

      {/* Kanban Board */}
      <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-200 p-6 shadow-sm">
        {/* Scroll horizontal para tablero */}
        <div
          className="overflow-x-auto pb-4"
          onScroll={(e) =>
            setScrollPosition((e.target as HTMLDivElement).scrollLeft)
          }
        >
          <div className="flex gap-4 w-fit">
            {columns.map((stage) => (
              <KanbanColumn
                key={stage}
                stage={stage}
                title={stageLabels[stage]}
                candidates={candidatesByStage[stage] || []}
                onDropCandidate={(candidateId, newStage) => {
                  moveCandidate(candidateId, newStage)
                }}
                onViewProfile={handleViewProfile}
                onChangeStage={moveCandidate}
                onScheduleInterview={handleScheduleInterview}
                onReject={rejectCandidate}
                onHire={hireCandidate}
              />
            ))}
          </div>
        </div>

        {/* Info scroll si es necesario */}
        {scrollPosition === 0 && columns.length > 3 && (
          <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
            <p>← Desliza para ver más columnas →</p>
          </div>
        )}
      </div>

      {/* Leyenda de prioridades */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="text-xs text-gray-600">Prioridad Baja</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="text-xs text-gray-600">Prioridad Media</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-400" />
          <span className="text-xs text-gray-600">Prioridad Alta</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <span className="text-xs text-gray-600">Prioridad Crítica</span>
        </div>
      </div>
    </div>
  )
}
