'use client'

import { useState, useCallback, useMemo } from 'react'
import type { Candidate, CandidateStage, RecruitmentStats, CandidateFilters } from '@/types/recruitment'
import { CandidateStage as Stage } from '@/types/recruitment'

const PIPELINE_STAGE_OVERRIDES_KEY = 'nexorh-recruitment-stage-overrides'

function readStageOverrides(): Record<string, CandidateStage> {
  if (typeof window === 'undefined') return {}

  try {
    const raw = window.localStorage.getItem(PIPELINE_STAGE_OVERRIDES_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, CandidateStage>
  } catch {
    return {}
  }
}

function writeStageOverride(candidateId: string, stage: CandidateStage) {
  if (typeof window === 'undefined') return

  const current = readStageOverrides()
  current[candidateId] = stage
  window.localStorage.setItem(PIPELINE_STAGE_OVERRIDES_KEY, JSON.stringify(current))
}

/**
 * Hook para gestionar el estado del tablero Kanban de reclutamiento
 */
export function useRecruitment() {
  // Estado
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<CandidateFilters>({
    query: '',
    stage: 'all',
    position: 'all',
    source: 'all',
    priority: 'all',
    sort: 'newest',
  })

  /**
   * Fetch candidatos
   */
  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true)
      
      // Importar el servicio dinámicamente
      const { recruitmentService } = await import('@/services/recruitment.service')
      const data = await recruitmentService.getCandidates(filters)
      
      // Aplicar overrides de localStorage (para el drag & drop del Kanban)
      const stageOverrides = readStageOverrides()
      const mergedCandidates = data.map((candidate) => {
        const overrideStage = stageOverrides[candidate.id]
        if (!overrideStage) return candidate

        return {
          ...candidate,
          stage: overrideStage,
          updatedAt: new Date().toISOString(),
        }
      })

      setCandidates(mergedCandidates)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar candidatos')
      setCandidates([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  /**
   * Candidatos agrupados por stage
   */
  const candidatesByStage = useMemo(() => {
    const stages = [
      Stage.APPLIED,
      Stage.SCREENING,
      Stage.INTERVIEW,
      Stage.OFFER,
      Stage.HIRED,
      Stage.REJECTED,
    ]

    return stages.reduce(
      (acc, stage) => {
        acc[stage] = candidates.filter((c) => c.stage === stage)
        return acc
      },
      {} as Record<CandidateStage, Candidate[]>
    )
  }, [candidates])

  /**
   * Estadísticas
   */
  const stats = useMemo<RecruitmentStats>(() => {
    const today = new Date()
    today.setDate(today.getDate() - 7) // Last 7 days

    return {
      newApplications: candidates.filter(
        (c) => new Date(c.appliedAt) > today
      ).length,
      inReview: candidatesByStage[Stage.SCREENING].length,
      interviews: candidatesByStage[Stage.INTERVIEW].length,
      selected: candidatesByStage[Stage.OFFER].length,
      totalCandidates: candidates.length,
      avgScore: candidates.length > 0
        ? Math.round(
            (candidates.reduce((sum, c) => sum + (c.score || 0), 0) /
              candidates.length) *
              10
          ) / 10
        : 0,
    }
  }, [candidates, candidatesByStage])

  /**
   * Cambiar stage de candidato
   */
  const moveCandidate = useCallback((candidateId: string, newStage: CandidateStage) => {
    writeStageOverride(candidateId, newStage)

    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId
          ? { ...c, stage: newStage, updatedAt: new Date().toISOString() }
          : c
      )
    )
  }, [])

  /**
   * Rechazar candidato
   */
  const rejectCandidate = useCallback((candidateId: string) => {
    moveCandidate(candidateId, Stage.REJECTED)
  }, [moveCandidate])

  /**
   * Contratar candidato
   */
  const hireCandidate = useCallback((candidateId: string) => {
    moveCandidate(candidateId, Stage.HIRED)
  }, [moveCandidate])

  /**
   * Actualizar filtros
   */
  const updateFilters = useCallback((newFilters: Partial<CandidateFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }, [])

  return {
    // Estado
    candidates,
    candidatesByStage,
    loading,
    error,
    filters,
    stats,

    // Métodos
    fetchCandidates,
    moveCandidate,
    rejectCandidate,
    hireCandidate,
    updateFilters,
  }
}
