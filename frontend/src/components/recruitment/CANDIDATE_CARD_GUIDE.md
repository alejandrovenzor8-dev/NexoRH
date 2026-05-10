/**
 * CANDIDATE CARD PREMIUM - GUÍA DE COMPONENTE
 *
 * Componente enterprise premium para tarjetas de candidatos en el Kanban de reclutamiento.
 * Inspirado en Linear, Notion, Workable y otras plataformas ATS modernas.
 *
 * ============================================================================
 * CARACTERÍSTICAS PRINCIPALES
 * ============================================================================
 *
 * ✅ VISUAL & DISEÑO
 * ├── Drag indicator (barra izquierda coloreada por prioridad)
 * ├── Grip handle icon (aparece al hover)
 * ├── Subtle elevation on hover (-translate-y-0.5, shadow-lg)
 * ├── Smooth border transitions
 * ├── Modern typography (semibold names, compact layout)
 * ├── Mucho whitespace (p-4, gap-3, mb-3)
 * ├── Sombras ligeras (shadow-lg, shadow-xl en menu)
 * └── Bordes redondeados suaves (rounded-xl, rounded-lg, rounded-md)
 *
 * ✅ INTERACTIVIDAD
 * ├── Hover effects (border change, shadow, translate)
 * ├── Drag opacity feedback (opacity-40 cuando se arrastra)
 * ├── Focus ring (ring-2 ring-blue-500) para accesibilidad
 * ├── Loading spinner (se muestra al abrir perfil)
 * ├── Dropdown menu con 5 opciones
 * ├── Click handlers para todas las acciones
 * └── Smooth transitions (duration-200)
 *
 * ✅ ACCESIBILIDAD
 * ├── tabIndex={0} - focusable
 * ├── Keyboard shortcuts:
 * │   ├── Enter: Abrir perfil del candidato
 * │   ├── Space: Abrir/cerrar menú
 * │   └── Escape: Cerrar menú
 * ├── ARIA labels (aria-label en botones)
 * ├── Semantic HTML (<button>, <a> con href)
 * ├── Focus states visibles (ring)
 * └── Color contrast adecuado
 *
 * ✅ RESPONSIVE
 * ├── Truncate text apropiado
 * ├── Flex layout que respeta space
 * ├── Menu absoluto posicionado
 * └── Funciona en mobile (aunque drag mejor en desktop)
 *
 * ✅ DATOS MOSTRADOS
 * ├── Avatar (imagen o initial)
 * ├── Nombre (clickeable, abre perfil)
 * ├── Email
 * ├── Posición/Vacante
 * ├── Skills/Tags (hasta 3 visibles, +N)
 * ├── Rating (estrellas 1-5)
 * ├── Score numérico (/10)
 * ├── Prioridad (Baja/Media/Alta/Crítica)
 * └── Fecha de aplicación
 *
 * ============================================================================
 * PROPS
 * ============================================================================
 *
 * interface CandidateCardProps {
 *   // Datos del candidato
 *   candidate: Candidate  (required)
 *
 *   // Callbacks
 *   onViewProfile: (id: string) => void
 *   onChangeStage: (id: string, stage: CandidateStage) => void
 *   onScheduleInterview: (id: string) => void
 *   onReject: (id: string) => void
 *   onHire: (id: string) => void
 *
 *   // Estado visual
 *   isDragging?: boolean  (default: false)
 * }
 *
 * interface Candidate {
 *   id: string
 *   fullName: string
 *   email: string
 *   phone?: string
 *   avatar?: string  // URL de imagen
 *   position: string  // Nombre de vacante
 *   source: CandidateSource
 *   stage: CandidateStage
 *   priority: CandidatePriority  // Afecta color del drag bar
 *   score?: number  // 0-10
 *   rating?: number  // 1-5 (estrellas)
 *   tags?: string[]  // Skills o keywords
 *   appliedAt: string  // ISO date
 *   updatedAt: string
 *   recruiter?: string
 *   notes?: string
 *   cvUrl?: string  // Si existe, muestra opción descargar
 *   linkedinUrl?: string
 * }
 *
 * ============================================================================
 * USOS
 * ============================================================================
 *
 * BASIC
 * ------
 * <CandidateCard
 *   candidate={candidate}
 *   onViewProfile={handleViewProfile}
 *   onChangeStage={handleChangeStage}
 *   onScheduleInterview={handleScheduleInterview}
 *   onReject={handleReject}
 *   onHire={handleHire}
 * />
 *
 *
 * EN KANBAN CON DRAG & DROP
 * --------------------------
 * <div
 *   draggable
 *   onDragStart={(e) => {
 *     e.dataTransfer.effectAllowed = 'move'
 *     e.dataTransfer.setData('candidateId', candidate.id)
 *   }}
 * >
 *   <CandidateCard
 *     candidate={candidate}
 *     isDragging={draggedId === candidate.id}
 *     {...handlers}
 *   />
 * </div>
 *
 *
 * COLORES POR PRIORIDAD
 * ---------------------
 * Los colores del drag bar cambian según la prioridad:
 *
 * CandidatePriority.LOW ........... Verde (border-l-green-400)
 * CandidatePriority.MEDIUM ....... Amarillo (border-l-yellow-400)
 * CandidatePriority.HIGH ......... Naranja (border-l-orange-400)
 * CandidatePriority.CRITICAL ..... Rojo (border-l-red-400)
 *
 * El ancho del drag bar aumenta en hover (1px → 1.5px)
 *
 *
 * ESTADOS VISUALES
 * ----------------
 *
 * DEFAULT
 * - Border gris claro
 * - Sin shadow
 * - Drag bar 1px
 *
 * HOVER
 * - Border gris más oscuro (hover:border-gray-300)
 * - Shadow lg
 * - Traslación arriba (-translate-y-0.5)
 * - Drag bar 1.5px
 * - Grip icon visible
 * - Hover effects en tags
 *
 * FOCUS
 * - Ring azul (ring-2 ring-blue-500 ring-offset-2)
 * - Keyboard accessible
 * - Visible cuando se navega con Tab
 *
 * DRAGGING
 * - Opacity 40% (opacity-40)
 * - Scale down (scale-95)
 * - Cursor move
 *
 * LOADING
 * - Overlay con spinner (opacity-60, pointer-events-none)
 * - Spinner animado
 * - Bloquea interacción
 *
 * ============================================================================
 * KEYBOARD SHORTCUTS
 * ============================================================================
 *
 * Enter (cuando el card tiene focus)
 * └─ onViewProfile(id) - Abre el perfil del candidato
 *
 * Space (cuando el card tiene focus)
 * └─ Alterna visibilidad del menú desplegable
 *
 * Escape (cuando el menú está abierto)
 * └─ Cierra el menú desplegable
 *
 * ============================================================================
 * MENÚ DESPLEGABLE (5 opciones)
 * ============================================================================
 *
 * 👁️  Ver perfil
 *    └─ onViewProfile(id)
 *    └─ Muestra loading spinner
 *
 * 📞 Agendar entrevista
 *    └─ onScheduleInterview(id)
 *
 * 📥 Descargar CV (solo si cvUrl existe)
 *    └─ <a href={cvUrl} download>
 *    └─ Icono + texto
 *
 * ─────────────── (separador)
 *
 * ✕  Rechazar
 *    └─ onReject(id)
 *    └─ Color rojo (text-red-600)
 *
 * ✓  Contratar
 *    └─ onHire(id)
 *    └─ Color verde (text-green-600)
 *
 * ============================================================================
 * COLORES Y ESTILOS
 * ============================================================================
 *
 * BORDERS & SHADOWS
 * ├── Border base: border-gray-200
 * ├── Border hover: hover:border-gray-300
 * ├── Shadow hover: hover:shadow-lg
 * ├── Shadow menu: shadow-xl
 * └── Focus ring: ring-2 ring-blue-500 ring-offset-2
 *
 * TYPOGRAPHY
 * ├── Name: font-semibold text-sm
 * ├── Email: text-xs text-gray-500
 * ├── Position: text-xs font-medium text-gray-600
 * ├── Tags: text-xs font-medium
 * ├── Score: text-xs font-semibold
 * ├── Date: text-xs text-gray-400 font-medium
 * └── Menu: text-sm
 *
 * SPACING
 * ├── Card padding: p-4 (pl-5 por drag bar)
 * ├── Section gaps: gap-3, gap-2.5
 * ├── Margins: mb-3, mt-0.5, ml-2.5
 * ├── Divider: h-px (muy ligero)
 * └── Menu spacing: px-4 py-2.5
 *
 * BACKGROUNDS
 * ├── Card: bg-white
 * ├── Tags: bg-gray-100, hover:bg-gray-200
 * ├── Menu items: hover:bg-{color}-50
 * └── Loading: bg-white/80
 *
 * ROUNDED
 * ├── Card: rounded-xl
 * ├── Avatar: rounded-full
 * ├── Tags: rounded-md
 * ├── Menu: rounded-lg
 * └── Badge: rounded-md
 *
 * TRANSITIONS
 * ├── Duration: duration-200
 * ├── Easing: ease-out
 * ├── Properties: all (transform, shadow, border, color)
 * └── Smooth animations
 *
 * ============================================================================
 * EJEMPLOS DE CANDIDATOS
 * ============================================================================
 *
 * CRÍTICA - Laura Martínez
 * {
 *   fullName: 'Laura Martínez',
 *   position: 'Senior Frontend Developer',
 *   priority: CandidatePriority.CRITICAL,
 *   rating: 5,
 *   score: 9.1,
 *   tags: ['React', 'TypeScript', 'Design Systems'],
 * }
 *
 * ALTA - Pedro Sánchez
 * {
 *   fullName: 'Pedro Sánchez',
 *   position: 'Product Manager',
 *   priority: CandidatePriority.HIGH,
 *   rating: 5,
 *   score: 8.8,
 *   tags: ['B2B', 'SaaS', 'Analytics'],
 * }
 *
 * MEDIA - Carlos López
 * {
 *   fullName: 'Carlos López',
 *   position: 'Backend Engineer',
 *   priority: CandidatePriority.MEDIUM,
 *   rating: 3,
 *   score: 7.2,
 *   tags: ['Node.js', 'MongoDB', 'Docker'],
 * }
 *
 * ============================================================================
 * NOTAS
 * ============================================================================
 *
 * 1. El componente es completamente reutilizable en cualquier contexto
 * 2. El drag & drop es nativo (HTML5 API), sin dependencias
 * 3. El componente maneja su propio estado (menu, loading, focus)
 * 4. Los handlers son opcionales (se pasan desde el padre)
 * 5. El diseño sigue principios de Linear, Notion y Workable
 * 6. Es accesible con keyboard y screen readers
 * 7. Las animaciones son suaves pero performantes
 * 8. El loading state se auto-resuelve después de 500ms
 * 9. El menú se cierra al clickear fuera
 * 10. Los emojis dan un toque visual moderno pero profesional
 *
 */

// Ejemplo de importación y uso
export const candidateCardExample = `
'use client'

import { CandidateCard } from '@/components/recruitment'
import type { Candidate } from '@/types/recruitment'

export function CandidateDemoCard() {
  const candidate: Candidate = {
    id: '1',
    fullName: 'Laura Martínez',
    email: 'laura@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura',
    position: 'Senior Frontend Developer',
    source: 'linkedin' as any,
    stage: 'applied' as any,
    priority: 'critical' as any,
    score: 9.1,
    rating: 5,
    tags: ['React', 'TypeScript', 'Design Systems'],
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return (
    <CandidateCard
      candidate={candidate}
      onViewProfile={(id) => console.log('View profile:', id)}
      onChangeStage={(id, stage) => console.log('Change stage:', id, stage)}
      onScheduleInterview={(id) => console.log('Schedule interview:', id)}
      onReject={(id) => console.log('Reject:', id)}
      onHire={(id) => console.log('Hire:', id)}
    />
  )
}
`
