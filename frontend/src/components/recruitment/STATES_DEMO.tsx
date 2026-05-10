/**
 * CANDIDATE CARD - ESTADOS VISUALES
 * 
 * Componente demostrativo que muestra todos los estados posibles del CandidateCard
 */

'use client'

import { CandidateCard } from './CandidateCard'
import type { Candidate } from '@/types/recruitment'
import { CandidateStage, CandidatePriority } from '@/types/recruitment'

const baseCandidateTemplate = (id: string, name: string, priority: CandidatePriority): Candidate => ({
  id,
  fullName: name,
  email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
  position: 'Senior Full-Stack Developer',
  source: 'linkedin' as any,
  stage: CandidateStage.INTERVIEW,
  priority,
  score: Math.round(Math.random() * 3 + 7),
  rating: Math.ceil(Math.random() * 5),
  tags: ['React', 'TypeScript', 'Node.js'],
  appliedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  recruiter: 'Juan',
  cvUrl: 'https://example.com/cv.pdf',
})

/**
 * Página de demostración de estados del CandidateCard
 */
export function CandidateCardStatesDemo() {
  return (
    <div className="space-y-12 py-10 max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">
          Estados del CandidateCard
        </h1>
        <p className="text-lg text-gray-600">
          Demostración visual de todos los estados y variaciones
        </p>
      </div>

      {/* Estados */}

      {/* 1. NORMAL STATE */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Estado Normal</h2>
          <p className="text-gray-600 text-sm mt-1">
            Card en su estado por defecto, sin interacciones
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CandidateCard
            candidate={baseCandidateTemplate('normal-low', 'Ana García', CandidatePriority.LOW)}
            onViewProfile={() => {}}
            onChangeStage={() => {}}
            onScheduleInterview={() => {}}
            onReject={() => {}}
            onHire={() => {}}
          />
          <CandidateCard
            candidate={baseCandidateTemplate('normal-medium', 'Carlos López', CandidatePriority.MEDIUM)}
            onViewProfile={() => {}}
            onChangeStage={() => {}}
            onScheduleInterview={() => {}}
            onReject={() => {}}
            onHire={() => {}}
          />
          <CandidateCard
            candidate={baseCandidateTemplate('normal-high', 'Maria Rodríguez', CandidatePriority.HIGH)}
            onViewProfile={() => {}}
            onChangeStage={() => {}}
            onScheduleInterview={() => {}}
            onReject={() => {}}
            onHire={() => {}}
          />
        </div>
      </section>

      <div className="h-px bg-gray-200" />

      {/* 2. DRAGGING STATE */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Estado Dragging</h2>
          <p className="text-gray-600 text-sm mt-1">
            Cuando se está arrastrando el card (opacity-40, scale-95)
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CandidateCard
            candidate={baseCandidateTemplate('dragging-1', 'Laura Martínez', CandidatePriority.CRITICAL)}
            isDragging={true}
            onViewProfile={() => {}}
            onChangeStage={() => {}}
            onScheduleInterview={() => {}}
            onReject={() => {}}
            onHire={() => {}}
          />
        </div>
        <p className="text-xs text-gray-500">
          💡 Intenta arrastrar cualquier card en la página para ver este estado
        </p>
      </section>

      <div className="h-px bg-gray-200" />

      {/* 3. SIN DATOS OPCIONALES */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sin Datos Opcionales</h2>
          <p className="text-gray-600 text-sm mt-1">
            Card que no tiene avatar, rating, CV, o tags
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CandidateCard
            candidate={{
              id: 'minimal-1',
              fullName: 'Juan Pérez',
              email: 'juan@example.com',
              position: 'Frontend Developer',
              source: 'website' as any,
              stage: CandidateStage.APPLIED,
              priority: CandidatePriority.MEDIUM,
              appliedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }}
            onViewProfile={() => {}}
            onChangeStage={() => {}}
            onScheduleInterview={() => {}}
            onReject={() => {}}
            onHire={() => {}}
          />
        </div>
      </section>

      <div className="h-px bg-gray-200" />

      {/* 4. CON MUCHOS TAGS */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Con Muchos Tags</h2>
          <p className="text-gray-600 text-sm mt-1">
            Card que muestra más de 3 tags (mostrará +N)
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CandidateCard
            candidate={{
              ...baseCandidateTemplate('many-tags', 'Sofia Chen', CandidatePriority.HIGH),
              tags: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Docker', 'AWS', 'PostgreSQL'],
            }}
            onViewProfile={() => {}}
            onChangeStage={() => {}}
            onScheduleInterview={() => {}}
            onReject={() => {}}
            onHire={() => {}}
          />
        </div>
      </section>

      <div className="h-px bg-gray-200" />

      {/* 5. TODAS LAS PRIORIDADES */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Todas las Prioridades</h2>
          <p className="text-gray-600 text-sm mt-1">
            La barra izquierda cambia de color según la prioridad
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LOW */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-green-700">🟢 Prioridad BAJA</p>
            <CandidateCard
              candidate={{
                ...baseCandidateTemplate('priority-low', 'Cliente D', CandidatePriority.LOW),
                score: 5.8,
                rating: 2,
              }}
              onViewProfile={() => {}}
              onChangeStage={() => {}}
              onScheduleInterview={() => {}}
              onReject={() => {}}
              onHire={() => {}}
            />
          </div>

          {/* MEDIUM */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-yellow-700">🟡 Prioridad MEDIA</p>
            <CandidateCard
              candidate={baseCandidateTemplate('priority-medium', 'Cliente C', CandidatePriority.MEDIUM)}
              onViewProfile={() => {}}
              onChangeStage={() => {}}
              onScheduleInterview={() => {}}
              onReject={() => {}}
              onHire={() => {}}
            />
          </div>

          {/* HIGH */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-orange-700">🟠 Prioridad ALTA</p>
            <CandidateCard
              candidate={{
                ...baseCandidateTemplate('priority-high', 'Cliente B', CandidatePriority.HIGH),
                score: 8.5,
                rating: 5,
              }}
              onViewProfile={() => {}}
              onChangeStage={() => {}}
              onScheduleInterview={() => {}}
              onReject={() => {}}
              onHire={() => {}}
            />
          </div>

          {/* CRITICAL */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-red-700">🔴 Prioridad CRÍTICA</p>
            <CandidateCard
              candidate={{
                ...baseCandidateTemplate('priority-critical', 'Cliente A', CandidatePriority.CRITICAL),
                score: 9.2,
                rating: 5,
              }}
              onViewProfile={() => {}}
              onChangeStage={() => {}}
              onScheduleInterview={() => {}}
              onReject={() => {}}
              onHire={() => {}}
            />
          </div>
        </div>
      </section>

      <div className="h-px bg-gray-200" />

      {/* 6. INFORMACIÓN COMPLETA */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Información Completa</h2>
          <p className="text-gray-600 text-sm mt-1">
            Card con todos los datos disponibles
          </p>
        </div>
        <div className="max-w-md">
          <CandidateCard
            candidate={{
              id: 'complete-1',
              fullName: 'Alexandra Thompson',
              email: 'alexandra.thompson@example.com',
              phone: '+1 (555) 123-4567',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandra',
              position: 'Principal Software Engineer',
              source: 'linkedin' as any,
              stage: CandidateStage.OFFER,
              priority: CandidatePriority.CRITICAL,
              score: 9.5,
              rating: 5,
              tags: ['System Design', 'Backend', 'Leadership', 'Mentoring', 'Architecture'],
              appliedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
              updatedAt: new Date().toISOString(),
              recruiter: 'María González',
              notes: 'Excelente fit con el equipo. Considerar oferta Premium.',
              cvUrl: 'https://example.com/cv-alexandra.pdf',
              linkedinUrl: 'https://linkedin.com/in/alexandra-thompson',
            }}
            onViewProfile={() => {}}
            onChangeStage={() => {}}
            onScheduleInterview={() => {}}
            onReject={() => {}}
            onHire={() => {}}
          />
        </div>
      </section>

      <div className="h-px bg-gray-200" />

      {/* NOTAS */}
      <section className="space-y-4">
        <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
          <p className="font-semibold text-blue-900">📝 Notas sobre estados</p>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>
              <strong>Normal:</strong> Card en estado por defecto, listo para interacción
            </li>
            <li>
              <strong>Hover:</strong> Aparecen sombra, elevación y grip icon (intenta hacer hover)
            </li>
            <li>
              <strong>Focus:</strong> Ring azul visible cuando navegas con Tab (intenta presionar Tab)
            </li>
            <li>
              <strong>Dragging:</strong> Opacidad y scale reducida para feedback visual
            </li>
            <li>
              <strong>Loading:</strong> Overlay con spinner cuando se abre el perfil (automático)
            </li>
            <li>
              <strong>Menu:</strong> Abre con Space o click en el botón de 3 puntos
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
