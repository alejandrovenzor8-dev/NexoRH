'use client'

import { useState } from 'react'
import type { Candidate, CandidateStage } from '@/types/recruitment'
import { CandidateCard } from './CandidateCard'

interface KanbanColumnProps {
  stage: CandidateStage
  title: string
  candidates: Candidate[]
  onDropCandidate: (candidateId: string, stage: CandidateStage) => void
  onViewProfile: (id: string) => void
  onChangeStage: (id: string, stage: CandidateStage) => void
  onScheduleInterview: (id: string) => void
  onReject: (id: string) => void
  onHire: (id: string) => void
  isLoading?: boolean
}

/**
 * Columna individual del Kanban con drag & drop
 */
export function KanbanColumn({
  stage,
  title,
  candidates,
  onDropCandidate,
  onViewProfile,
  onChangeStage,
  onScheduleInterview,
  onReject,
  onHire,
  isLoading = false,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [draggedCandidate, setDraggedCandidate] = useState<Candidate | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const candidateData = e.dataTransfer.getData('text/plain')
    if (candidateData) {
      try {
        const { candidateId } = JSON.parse(candidateData)
        onDropCandidate(candidateId, stage)
      } catch (err) {
        console.error('Error parsing candidate data', err)
      }
    }
  }

  const getColumnColor = (stageType: CandidateStage) => {
    switch (stageType) {
      case 'applied':
        return 'bg-blue-50 border-blue-200'
      case 'screening':
        return 'bg-purple-50 border-purple-200'
      case 'interview':
        return 'bg-amber-50 border-amber-200'
      case 'offer':
        return 'bg-green-50 border-green-200'
      case 'hired':
        return 'bg-emerald-50 border-emerald-200'
      case 'rejected':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getHeaderColor = (stageType: CandidateStage) => {
    switch (stageType) {
      case 'applied':
        return 'bg-blue-100 text-blue-700'
      case 'screening':
        return 'bg-purple-100 text-purple-700'
      case 'interview':
        return 'bg-amber-100 text-amber-700'
      case 'offer':
        return 'bg-green-100 text-green-700'
      case 'hired':
        return 'bg-emerald-100 text-emerald-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="flex flex-col w-96 flex-shrink-0">
      {/* Header */}
      <div className="sticky top-0 z-10 mb-4">
        <div
          className={`rounded-xl px-4 py-3 font-semibold text-sm flex items-center justify-between ${getHeaderColor(
            stage
          )}`}
        >
          <span>{title}</span>
          <span className="font-bold text-lg">{candidates.length}</span>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          flex-1 rounded-xl border-2 border-dashed p-4
          transition-all duration-200
          min-h-[500px]
          ${
            isDragOver
              ? 'border-blue-400 bg-blue-50/80 shadow-md'
              : `border-gray-300 ${getColumnColor(stage)}`
          }
        `}
      >
        {/* Candidatos */}
        <div className="space-y-3">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'move'
                e.dataTransfer.setData(
                  'text/plain',
                  JSON.stringify({ candidateId: candidate.id })
                )
                setDraggedCandidate(candidate)
              }}
              onDragEnd={() => setDraggedCandidate(null)}
            >
              <CandidateCard
                candidate={candidate}
                onViewProfile={onViewProfile}
                onChangeStage={onChangeStage}
                onScheduleInterview={onScheduleInterview}
                onReject={onReject}
                onHire={onHire}
                isDragging={draggedCandidate?.id === candidate.id}
              />
            </div>
          ))}
        </div>

        {/* Estado vacío */}
        {candidates.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-3xl mb-2">📭</div>
            <p className="text-sm text-gray-500 font-medium">
              No hay candidatos
            </p>
            <p className="text-xs text-gray-400">
              Arrastra candidatos aquí
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
