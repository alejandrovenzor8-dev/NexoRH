/**
 * RECRUITMENT SHOWCASE
 * 
 * Componente de demostración que muestra diferentes estados y configuraciones
 * del CandidateCard premium en acción
 */

'use client'

import { useState } from 'react'
import { CandidateCard } from './CandidateCard'
import type { Candidate } from '@/types/recruitment'
import { CandidateStage, CandidatePriority } from '@/types/recruitment'

// Candidatos de ejemplo
const showcaseCandidates: Candidate[] = [
  {
    id: '1',
    fullName: 'Laura Martínez',
    email: 'laura@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura',
    position: 'Senior Frontend Developer',
    source: 'linkedin' as any,
    stage: CandidateStage.INTERVIEW,
    priority: CandidatePriority.CRITICAL,
    score: 9.1,
    rating: 5,
    tags: ['React', 'TypeScript', 'Design Systems'],
    appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    recruiter: 'Juan',
    linkedinUrl: 'https://linkedin.com/in/laura',
  },
  {
    id: '2',
    fullName: 'Pedro Sánchez',
    email: 'pedro@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro',
    position: 'Product Manager',
    source: 'referral' as any,
    stage: CandidateStage.OFFER,
    priority: CandidatePriority.HIGH,
    score: 8.8,
    rating: 5,
    tags: ['B2B', 'SaaS', 'Analytics'],
    appliedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    recruiter: 'María',
    cvUrl: 'https://example.com/cv.pdf',
  },
  {
    id: '3',
    fullName: 'Carlos López',
    email: 'carlos@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    position: 'Backend Engineer',
    source: 'indeed' as any,
    stage: CandidateStage.SCREENING,
    priority: CandidatePriority.MEDIUM,
    score: 7.2,
    rating: 3,
    tags: ['Node.js', 'MongoDB', 'Docker'],
    appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    recruiter: 'Ana',
  },
  {
    id: '4',
    fullName: 'Sofia Ruiz',
    email: 'sofia@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia',
    position: 'UX Designer',
    source: 'website' as any,
    stage: CandidateStage.APPLIED,
    priority: CandidatePriority.MEDIUM,
    score: 7.5,
    rating: 4,
    tags: ['Figma', 'Design', 'User Research'],
    appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    recruiter: 'Luis',
  },
  {
    id: '5',
    fullName: 'Roberto Torres',
    email: 'roberto@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto',
    position: 'DevOps Engineer',
    source: 'linkedin' as any,
    stage: CandidateStage.SCREENING,
    priority: CandidatePriority.HIGH,
    score: 8.3,
    rating: 4,
    tags: ['Kubernetes', 'AWS', 'Terraform'],
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    recruiter: 'Juan',
    cvUrl: 'https://example.com/cv.pdf',
  },
  {
    id: '6',
    fullName: 'María García',
    email: 'maria@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    position: 'QA Engineer',
    source: 'linkedin' as any,
    stage: CandidateStage.APPLIED,
    priority: CandidatePriority.LOW,
    score: 6.8,
    rating: 3,
    tags: ['Selenium', 'Testing', 'Python'],
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    recruiter: 'Ana',
  },
]

/**
 * Componente showcase del CandidateCard premium
 */
export function RecruitmentShowcase() {
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const handleViewProfile = (id: string) => {
    console.log('👁️ Ver perfil:', id)
  }

  const handleChangeStage = (id: string, stage: any) => {
    console.log('📊 Cambiar stage:', id, stage)
  }

  const handleScheduleInterview = (id: string) => {
    console.log('📞 Agendar entrevista:', id)
  }

  const handleReject = (id: string) => {
    console.log('✕ Rechazar:', id)
  }

  const handleHire = (id: string) => {
    console.log('✓ Contratar:', id)
  }

  return (
    <div className="space-y-10 py-10">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">
          CandidateCard Premium
        </h1>
        <p className="text-lg text-gray-600">
          Componente enterprise para tarjetas de candidatos inspirado en Linear,
          Notion y Workable
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { emoji: '🎨', title: 'Diseño Premium', desc: 'Mucho whitespace y sombras ligeras' },
          { emoji: '♿', title: 'Accessible', desc: 'Keyboard navigation y focus states' },
          { emoji: '⌨️', title: 'Keyboard', desc: 'Enter, Space, Escape shortcuts' },
          { emoji: '⚡', title: 'Loading', desc: 'Spinner animado y feedback visual' },
          { emoji: '🎯', title: 'Drag Indicator', desc: 'Barra coloreada por prioridad' },
          { emoji: '🎭', title: 'Hover Effects', desc: 'Elevation y transiciones suaves' },
        ].map((feature) => (
          <div
            key={feature.title}
            className="p-4 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200"
          >
            <p className="text-2xl mb-2">{feature.emoji}</p>
            <p className="font-semibold text-gray-900 text-sm">{feature.title}</p>
            <p className="text-xs text-gray-600 mt-1">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

      {/* Showcase Grid */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Ejemplos de Candidatos
        </h2>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showcaseCandidates.map((candidate) => (
            <div
              key={candidate.id}
              draggable
              onDragStart={() => setDraggingId(candidate.id)}
              onDragEnd={() => setDraggingId(null)}
              className="h-full"
            >
              <CandidateCard
                candidate={candidate}
                isDragging={draggingId === candidate.id}
                onViewProfile={handleViewProfile}
                onChangeStage={handleChangeStage}
                onScheduleInterview={handleScheduleInterview}
                onReject={handleReject}
                onHire={handleHire}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Prioridades */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">
          Indicadores de Prioridad
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { color: 'green-400', label: 'Baja', priority: CandidatePriority.LOW },
            { color: 'yellow-400', label: 'Media', priority: CandidatePriority.MEDIUM },
            { color: 'orange-400', label: 'Alta', priority: CandidatePriority.HIGH },
            { color: 'red-400', label: 'Crítica', priority: CandidatePriority.CRITICAL },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-lg border-l-4 bg-gray-50"
              style={{ borderLeftColor: `rgb(var(--color-${item.color}))` }}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full bg-${item.color}`}
                  style={{ backgroundColor: `rgb(var(--color-${item.color}))` }}
                />
                <span className="font-semibold text-gray-900">{item.label}</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                {item.label === 'Baja' && 'Candidato de bajo interés'}
                {item.label === 'Media' && 'Candidato con potencial'}
                {item.label === 'Alta' && 'Candidato muy interesante'}
                {item.label === 'Crítica' && 'Candidato ideal o muy urgente'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Shortcuts */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">
          Atajos de Teclado
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'Enter', action: 'Abrir perfil del candidato' },
            { key: 'Space', action: 'Abrir/cerrar menú' },
            { key: 'Escape', action: 'Cerrar menú' },
            { key: 'Tab', action: 'Navegar entre cards' },
          ].map((shortcut) => (
            <div
              key={shortcut.key}
              className="p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-3"
            >
              <div className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-semibold">
                {shortcut.key}
              </div>
              <p className="text-sm text-blue-900 leading-relaxed">
                {shortcut.action}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg space-y-3">
        <p className="font-semibold text-amber-900">💡 Tips</p>
        <ul className="space-y-2 text-sm text-amber-800">
          <li>• Usa Tab para navegar entre cards y acceder al focus state</li>
          <li>• Presiona Space para abrir el menú y navegar con flechas</li>
          <li>• El drag indicator (barra izquierda) muestra la prioridad del candidato</li>
          <li>• Hover sobre el card para ver el grip handle y acceder al menú</li>
          <li>• El score (/10) indica compatibilidad con la posición</li>
          <li>• Las estrellas de rating (1-5) vienen de evaluaciones previas</li>
        </ul>
      </div>
    </div>
  )
}
