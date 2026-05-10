'use client'

import { useState, useCallback, useMemo } from 'react'
import type { Candidate, CandidateStage, RecruitmentStats, CandidateFilters } from '@/types/recruitment'
import { CandidateStage as Stage } from '@/types/recruitment'

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
      // TODO: Reemplazar con call a API real
      // const data = await recruitmentService.getCandidates(filters)
      // setCandidates(data)

      // Mock data para demostración
      setTimeout(() => {
        setCandidates([
          {
            id: '1',
            fullName: 'María García',
            email: 'maria@example.com',
            phone: '+34 600 000 001',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
            position: 'Senior Frontend Developer',
            source: 'linkedin' as any,
            stage: Stage.APPLIED,
            priority: 'high' as any,
            score: 8.5,
            rating: 4,
            tags: ['React', 'TypeScript', 'Remote'],
            appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
            recruiter: 'Juan',
            linkedinUrl: 'https://linkedin.com/in/maria',
          },
          {
            id: '2',
            fullName: 'Carlos López',
            email: 'carlos@example.com',
            phone: '+34 600 000 002',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
            position: 'Backend Engineer',
            source: 'indeed' as any,
            stage: Stage.SCREENING,
            priority: 'medium' as any,
            score: 7.2,
            rating: 3,
            tags: ['Node.js', 'MongoDB', 'Docker'],
            appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
            recruiter: 'Ana',
          },
          {
            id: '3',
            fullName: 'Laura Martínez',
            email: 'laura@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura',
            position: 'Senior Frontend Developer',
            source: 'linkedin' as any,
            stage: Stage.INTERVIEW,
            priority: 'critical' as any,
            score: 9.1,
            rating: 5,
            tags: ['React', 'Vue', 'Design Systems'],
            appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
            recruiter: 'Juan',
          },
          {
            id: '4',
            fullName: 'Pedro Sánchez',
            email: 'pedro@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro',
            position: 'Product Manager',
            source: 'referral' as any,
            stage: Stage.OFFER,
            priority: 'high' as any,
            score: 8.8,
            rating: 5,
            tags: ['B2B', 'SaaS', 'Analytics'],
            appliedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
            recruiter: 'María',
          },
          {
            id: '5',
            fullName: 'Sofia Ruiz',
            email: 'sofia@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia',
            position: 'UX Designer',
            source: 'website' as any,
            stage: Stage.APPLIED,
            priority: 'medium' as any,
            score: 7.5,
            rating: 4,
            tags: ['Figma', 'Design', 'User Research'],
            appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
            recruiter: 'Luis',
          },
          {
            id: '6',
            fullName: 'Roberto Torres',
            email: 'roberto@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto',
            position: 'DevOps Engineer',
            source: 'linkedin' as any,
            stage: Stage.SCREENING,
            priority: 'high' as any,
            score: 8.3,
            rating: 4,
            tags: ['Kubernetes', 'AWS', 'Terraform'],
            appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
            recruiter: 'Juan',
          },
        ])
        setLoading(false)
      }, 500)

      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar candidatos')
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
