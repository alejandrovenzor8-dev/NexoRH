'use client'

import { StarIcon, DownloadIcon, MoreHorizontalIcon, GripVerticalIcon } from 'lucide-react'
import type { Candidate, CandidateCardProps } from '@/types/recruitment'
import { CandidatePriority } from '@/types/recruitment'
import { useState, useRef, useEffect } from 'react'

/**
 * Tarjeta premium de candidato con drag indicator, keyboard accessibility, focus states
 * 
 * Características:
 * - Indicador visual de drag (barra izquierda)
 * - Hover elevation y transiciones suaves
 * - Focus state para accesibilidad
 * - Keyboard navigation (Enter, Space)
 * - Loading states
 * - Typography moderna con whitespace
 * - Sombras ligeras y refinadas
 */
export function CandidateCard({
  candidate,
  onViewProfile,
  onChangeStage,
  onScheduleInterview,
  onReject,
  onHire,
  isDragging = false,
}: CandidateCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  // Cerrar menu al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!cardRef.current?.contains(document.activeElement)) return

      switch (e.key) {
        case 'Enter':
          e.preventDefault()
          onViewProfile(candidate.id)
          break
        case ' ':
          e.preventDefault()
          setShowMenu(!showMenu)
          break
        case 'Escape':
          setShowMenu(false)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [candidate.id, onViewProfile, showMenu])

  // Mapear prioridad a colores
  const priorityColors = {
    [CandidatePriority.LOW]: {
      border: 'border-l-green-400',
      bg: 'hover:bg-green-50/40',
      badge: 'bg-green-100 text-green-700',
    },
    [CandidatePriority.MEDIUM]: {
      border: 'border-l-yellow-400',
      bg: 'hover:bg-yellow-50/40',
      badge: 'bg-yellow-100 text-yellow-700',
    },
    [CandidatePriority.HIGH]: {
      border: 'border-l-orange-400',
      bg: 'hover:bg-orange-50/40',
      badge: 'bg-orange-100 text-orange-700',
    },
    [CandidatePriority.CRITICAL]: {
      border: 'border-l-red-400',
      bg: 'hover:bg-red-50/40',
      badge: 'bg-red-100 text-red-700',
    },
  }

  const priorityLabels = {
    [CandidatePriority.LOW]: 'Baja',
    [CandidatePriority.MEDIUM]: 'Media',
    [CandidatePriority.HIGH]: 'Alta',
    [CandidatePriority.CRITICAL]: 'Crítica',
  }

  return (
    <div
      ref={cardRef}
      tabIndex={0}
      draggable
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`
        group relative rounded-xl bg-white border border-gray-200
        transition-all duration-200 ease-out
        cursor-move select-none
        ${isDragging ? 'opacity-40 scale-95' : ''}
        ${isFocused ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:border-gray-300'}
        ${!isDragging && !isFocused ? 'hover:shadow-lg hover:-translate-y-0.5' : ''}
        ${isLoading ? 'opacity-60 pointer-events-none' : ''}
        focus:outline-none
      `}
    >
      {/* Drag Indicator - Left Border */}
      <div
        className={`
          absolute left-0 top-0 bottom-0 w-1 rounded-l-xl
          transition-all duration-200
          ${priorityColors[candidate.priority].border}
          ${isDragging ? 'w-1.5' : 'group-hover:w-1.5'}
        `}
      />

      {/* Drag Handle Icon - Top Left */}
      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVerticalIcon className="w-4 h-4 text-gray-400" />
      </div>

      {/* Main Content */}
      <div className="p-4 pl-5">
        {/* Header: Avatar + Name + Menu */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Avatar */}
            <div className="flex-shrink-0 mt-0.5">
              {candidate.avatar ? (
                <img
                  src={candidate.avatar}
                  alt={candidate.fullName}
                  className="w-9 h-9 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                  {candidate.fullName.charAt(0)}
                </div>
              )}
            </div>

            {/* Name + Email */}
            <div className="flex-1 min-w-0">
              <button
                onClick={() => {
                  setIsLoading(true)
                  onViewProfile(candidate.id)
                  setTimeout(() => setIsLoading(false), 500)
                }}
                className="block text-left hover:text-blue-600 transition-colors focus:outline-none focus:text-blue-600"
              >
                <p className="font-semibold text-gray-900 text-sm leading-tight truncate">
                  {candidate.fullName}
                </p>
              </button>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {candidate.email}
              </p>
            </div>
          </div>

          {/* Menu Button */}
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Opciones"
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <MoreHorizontalIcon className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-1">
                {/* Ver Perfil */}
                <button
                  onClick={() => {
                    setIsLoading(true)
                    onViewProfile(candidate.id)
                    setShowMenu(false)
                    setTimeout(() => setIsLoading(false), 500)
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  👁️ Ver perfil
                </button>

                {/* Agendar Entrevista */}
                <button
                  onClick={() => {
                    onScheduleInterview(candidate.id)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                >
                  📞 Agendar entrevista
                </button>

                {/* Descargar CV */}
                {candidate.cvUrl && (
                  <a
                    href={candidate.cvUrl}
                    download
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                  >
                    <DownloadIcon className="w-4 h-4" />
                    Descargar CV
                  </a>
                )}

                {/* Separator */}
                <div className="border-t border-gray-200 my-1" />

                {/* Rechazar */}
                <button
                  onClick={() => {
                    onReject(candidate.id)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  ✕ Rechazar
                </button>

                {/* Contratar */}
                <button
                  onClick={() => {
                    onHire(candidate.id)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 transition-colors"
                >
                  ✓ Contratar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Position */}
        <p className="text-xs font-medium text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {candidate.position}
        </p>

        {/* Tags */}
        {candidate.tags && candidate.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {candidate.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-200 transition-colors"
              >
                {tag}
              </span>
            ))}
            {candidate.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                +{candidate.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-gray-100 mb-3" />

        {/* Footer: Rating + Score + Priority + Date */}
        <div className="space-y-2.5">
          {/* Rating + Score */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {candidate.rating && (
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`w-3.5 h-3.5 transition-colors ${
                        i < candidate.rating!
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {candidate.score && (
              <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">
                {candidate.score}/10
              </span>
            )}
          </div>

          {/* Priority Badge */}
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                priorityColors[candidate.priority].badge
              }`}
            >
              {priorityLabels[candidate.priority]}
            </span>

            {/* Date */}
            <p className="text-xs text-gray-400 font-medium">
              {new Date(candidate.appliedAt).toLocaleDateString('es-ES', {
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 rounded-xl bg-white/80 flex items-center justify-center">
          <div className="animate-spin">
            <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full" />
          </div>
        </div>
      )}
    </div>
  )
}
