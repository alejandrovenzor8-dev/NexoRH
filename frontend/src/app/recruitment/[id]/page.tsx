'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  CalendarCheck2,
  CheckCircle2,
  CircleDot,
  Clock3,
  Download,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
  Star,
  UserRound,
  XCircle,
  Loader2,
} from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import EmployeeForm, { type EmployeeFormValues } from '@/components/employees/EmployeeForm'
import { EmployeeRole, EmployeeStatus } from '@/types/employee'
import { employeesService } from '@/services/employees.service'
import type { UserSession } from '@/types/auth'
import {
  CandidatePriority,
  CandidateSource,
  CandidateStage,
  InterviewType,
  type Candidate,
  type Interview,
} from '@/types/recruitment'

type TimelineType =
  | 'applied'
  | 'cv-reviewed'
  | 'stage-changed'
  | 'comment'
  | 'interview'

type TimelineItem = {
  id: string
  type: TimelineType
  title: string
  detail: string
  at: string
  author: string
}

type ExperienceItem = {
  id: string
  role: string
  company: string
  period: string
  summary: string
}

type SkillItem = {
  name: string
  level: number
}

type CandidateFile = {
  id: string
  name: string
  kind: 'cv' | 'portfolio' | 'certification' | 'assessment'
  size: string
  uploadedAt: string
  url: string
}

type CandidateDetail = {
  candidate: Candidate
  location: string
  availability: string
  englishLevel: string
  salaryExpectation: string
  yearsOfExperience: number
  experience: ExperienceItem[]
  skills: SkillItem[]
  interviews: Interview[]
  files: CandidateFile[]
  timeline: TimelineItem[]
}

const stageLabels: Record<CandidateStage, string> = {
  [CandidateStage.APPLIED]: 'Aplico',
  [CandidateStage.SCREENING]: 'En revision',
  [CandidateStage.INTERVIEW]: 'Entrevista',
  [CandidateStage.OFFER]: 'Seleccionado',
  [CandidateStage.HIRED]: 'Contratado',
  [CandidateStage.REJECTED]: 'Rechazado',
}

const stageBadgeClasses: Record<CandidateStage, string> = {
  [CandidateStage.APPLIED]: 'bg-sky-50 text-sky-700 border-sky-200',
  [CandidateStage.SCREENING]: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  [CandidateStage.INTERVIEW]: 'bg-violet-50 text-violet-700 border-violet-200',
  [CandidateStage.OFFER]: 'bg-amber-50 text-amber-700 border-amber-200',
  [CandidateStage.HIRED]: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  [CandidateStage.REJECTED]: 'bg-rose-50 text-rose-700 border-rose-200',
}

const sourceLabels: Record<CandidateSource, string> = {
  [CandidateSource.LINKEDIN]: 'LinkedIn',
  [CandidateSource.INDEED]: 'Indeed',
  [CandidateSource.REFERRAL]: 'Referido',
  [CandidateSource.WEBSITE]: 'Sitio web',
  [CandidateSource.EMAIL]: 'Email',
  [CandidateSource.OTHER]: 'Otro',
}

const interviewTypeLabels: Record<InterviewType, string> = {
  [InterviewType.PHONE]: 'Telefonica',
  [InterviewType.VIDEO]: 'Video',
  [InterviewType.IN_PERSON]: 'Presencial',
  [InterviewType.PANEL]: 'Panel',
}

const timelineColorByType: Record<TimelineType, string> = {
  applied: 'bg-sky-100 text-sky-700 ring-sky-200',
  'cv-reviewed': 'bg-indigo-100 text-indigo-700 ring-indigo-200',
  'stage-changed': 'bg-violet-100 text-violet-700 ring-violet-200',
  comment: 'bg-amber-100 text-amber-700 ring-amber-200',
  interview: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
}

const PIPELINE_STAGE_OVERRIDES_KEY = 'nexorh-recruitment-stage-overrides'

function inferDepartment(position: string): string {
  const normalized = position.toLowerCase()
  if (normalized.includes('design')) return 'Producto'
  if (normalized.includes('product')) return 'Producto'
  if (normalized.includes('backend')) return 'Tecnologia'
  if (normalized.includes('frontend')) return 'Tecnologia'
  if (normalized.includes('engineer')) return 'Tecnologia'
  return 'Operaciones'
}

function toEmployeeInitialValues(candidate: Candidate): EmployeeFormValues {
  return {
    fullName: candidate.fullName,
    email: candidate.email,
    phone: candidate.phone ?? '',
    role: EmployeeRole.USER,
    status: EmployeeStatus.ACTIVE,
    department: inferDepartment(candidate.position),
    hiredAt: new Date().toISOString().slice(0, 10),
  }
}

function persistPipelineStage(candidateId: string, stage: CandidateStage) {
  if (typeof window === 'undefined') return

  try {
    const raw = window.localStorage.getItem(PIPELINE_STAGE_OVERRIDES_KEY)
    const current = raw ? (JSON.parse(raw) as Record<string, CandidateStage>) : {}
    current[candidateId] = stage
    window.localStorage.setItem(PIPELINE_STAGE_OVERRIDES_KEY, JSON.stringify(current))
  } catch {
    // no-op in mock mode
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getTimelineIcon(type: TimelineType) {
  if (type === 'applied') return <UserRound className="h-4 w-4" />
  if (type === 'cv-reviewed') return <ShieldCheck className="h-4 w-4" />
  if (type === 'stage-changed') return <CircleDot className="h-4 w-4" />
  if (type === 'comment') return <MessageSquare className="h-4 w-4" />
  return <CalendarCheck2 className="h-4 w-4" />
}

function mockCandidateById(id: string): CandidateDetail {
  const baseDate = new Date('2026-05-02T09:00:00.000Z')
  const withDays = (days: number, hours = 0) =>
    new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000).toISOString()

  return {
    candidate: {
      id,
      fullName: id === '2' ? 'Carlos Lopez' : 'Valentina Perez',
      email: id === '2' ? 'carlos.lopez@nexorh.dev' : 'valentina.perez@nexorh.dev',
      phone: id === '2' ? '+52 55 7777 1200' : '+52 55 3123 0098',
      avatar:
        id === '2'
          ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos'
          : 'https://api.dicebear.com/7.x/avataaars/svg?seed=Valentina',
      position: id === '2' ? 'Backend Engineer (Node.js)' : 'Senior Product Designer',
      source: id === '2' ? CandidateSource.INDEED : CandidateSource.LINKEDIN,
      stage: id === '2' ? CandidateStage.SCREENING : CandidateStage.INTERVIEW,
      priority: id === '2' ? CandidatePriority.MEDIUM : CandidatePriority.HIGH,
      score: id === '2' ? 7.8 : 9.1,
      rating: id === '2' ? 4 : 5,
      tags:
        id === '2'
          ? ['Node.js', 'PostgreSQL', 'Redis', 'Docker']
          : ['Design Systems', 'Figma', 'UX Research', 'B2B SaaS'],
      appliedAt: withDays(0),
      updatedAt: withDays(6, 3),
      recruiter: 'Mariana Ortega',
      notes:
        id === '2'
          ? 'Buen fit tecnico. Falta validar liderazgo tecnico en entrevista final.'
          : 'Perfil premium con experiencia global en productos SaaS enterprise.',
      cvUrl: 'https://example.com/candidate-cv.pdf',
      linkedinUrl:
        id === '2'
          ? 'https://linkedin.com/in/carloslopez'
          : 'https://linkedin.com/in/valentinaperez',
    },
    location: id === '2' ? 'Guadalajara, MX' : 'CDMX, MX',
    availability: id === '2' ? '2 semanas' : 'Inmediata',
    englishLevel: id === '2' ? 'B2 - Intermedio alto' : 'C1 - Avanzado',
    salaryExpectation: id === '2' ? '$68,000 MXN / mes' : '$92,000 MXN / mes',
    yearsOfExperience: id === '2' ? 6 : 9,
    experience:
      id === '2'
        ? [
            {
              id: 'exp-1',
              role: 'Backend Engineer',
              company: 'ScaleCloud',
              period: '2022 - Actualidad',
              summary: 'Arquitectura de APIs para productos B2B con Node.js, colas y observabilidad.',
            },
            {
              id: 'exp-2',
              role: 'Software Engineer',
              company: 'DataHub',
              period: '2020 - 2022',
              summary: 'Desarrollo de microservicios y pipelines de datos en entornos de alto volumen.',
            },
          ]
        : [
            {
              id: 'exp-1',
              role: 'Senior Product Designer',
              company: 'Atlas HR Suite',
              period: '2021 - Actualidad',
              summary: 'Lidero discovery, handoff y evolucion de design system en plataforma SaaS.',
            },
            {
              id: 'exp-2',
              role: 'Product Designer',
              company: 'FlowOps',
              period: '2018 - 2021',
              summary: 'Diseño de experiencias para flujos complejos de onboarding y analitica.',
            },
          ],
    skills:
      id === '2'
        ? [
            { name: 'Node.js', level: 92 },
            { name: 'PostgreSQL', level: 86 },
            { name: 'Arquitectura API', level: 89 },
            { name: 'Docker', level: 80 },
          ]
        : [
            { name: 'Product Thinking', level: 96 },
            { name: 'Design Systems', level: 93 },
            { name: 'UX Research', level: 88 },
            { name: 'Figma', level: 95 },
          ],
    interviews: [
      {
        id: 'int-1',
        candidateId: id,
        type: InterviewType.PHONE,
        date: withDays(3),
        time: '10:00',
        interviewer: 'Mariana Ortega',
        notes: 'Validacion inicial de fit cultural y expectativas.',
        result: 'pass',
      },
      {
        id: 'int-2',
        candidateId: id,
        type: InterviewType.VIDEO,
        date: withDays(5),
        time: '16:00',
        interviewer: 'Lead del area',
        notes: 'Profundizar experiencia y casos de negocio.',
        result: 'pending',
      },
    ],
    files: [
      {
        id: 'file-1',
        name: 'CV-Actualizado.pdf',
        kind: 'cv',
        size: '1.8 MB',
        uploadedAt: withDays(0),
        url: 'https://example.com/cv.pdf',
      },
      {
        id: 'file-2',
        name: 'Portfolio-2026.pdf',
        kind: 'portfolio',
        size: '6.1 MB',
        uploadedAt: withDays(1),
        url: 'https://example.com/portfolio.pdf',
      },
      {
        id: 'file-3',
        name: 'Evaluacion-tecnica.pdf',
        kind: 'assessment',
        size: '780 KB',
        uploadedAt: withDays(6),
        url: 'https://example.com/assessment.pdf',
      },
    ],
    timeline: [
      {
        id: 'tl-1',
        type: 'applied',
        title: 'Aplico a la vacante',
        detail: 'Se registro desde portal de empleos.',
        at: withDays(0),
        author: 'Sistema',
      },
      {
        id: 'tl-2',
        type: 'cv-reviewed',
        title: 'CV revisado',
        detail: 'Perfil validado por reclutamiento y marcado como apto.',
        at: withDays(1, 2),
        author: 'Mariana Ortega',
      },
      {
        id: 'tl-3',
        type: 'stage-changed',
        title: 'Cambio de etapa',
        detail: `Movido a ${id === '2' ? 'En revision' : 'Entrevista'}.`,
        at: withDays(2, 4),
        author: 'Sistema ATS',
      },
      {
        id: 'tl-4',
        type: 'comment',
        title: 'Comentario interno',
        detail: 'Muy buen nivel tecnico y comunicacion clara.',
        at: withDays(3, 1),
        author: 'Lead Hiring Manager',
      },
      {
        id: 'tl-5',
        type: 'interview',
        title: 'Entrevista agendada',
        detail: 'Entrevista por video confirmada para esta semana.',
        at: withDays(5, 3),
        author: 'Talent Acquisition',
      },
    ],
  }
}

function renderStars(rating: number) {
  return [...Array(5)].map((_, index) => (
    <Star
      key={index}
      className={`h-4 w-4 ${index < rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
    />
  ))
}

function cardClassName(extra?: string) {
  return `rounded-2xl border border-slate-200 bg-white shadow-sm ${extra ?? ''}`
}

export default function CandidateDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()

  const [user, setUser] = useState<UserSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [showToast, setShowToast] = useState<string | null>(null)
  const [detail, setDetail] = useState<CandidateDetail | null>(null)
  const [currentStage, setCurrentStage] = useState<CandidateStage>(CandidateStage.APPLIED)
  const [confirmConvertOpen, setConfirmConvertOpen] = useState(false)
  const [employeeFormOpen, setEmployeeFormOpen] = useState(false)
  const [employeeFormDraft, setEmployeeFormDraft] = useState<EmployeeFormValues | null>(null)
  const [convertingEmployee, setConvertingEmployee] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
      return
    }

    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        setUser(JSON.parse(userStr))
      } catch {
        router.replace('/login')
        return
      }
    }

    const id = params?.id ?? '1'
    const candidateDetail = mockCandidateById(id)
    setDetail(candidateDetail)
    setCurrentStage(candidateDetail.candidate.stage)
    setEmployeeFormDraft(toEmployeeInitialValues(candidateDetail.candidate))
    setLoading(false)
  }, [params?.id, router])

  useEffect(() => {
    if (!showToast) return
    const timer = window.setTimeout(() => setShowToast(null), 2400)
    return () => window.clearTimeout(timer)
  }, [showToast])

  const sortedTimeline = useMemo(() => {
    if (!detail) return []
    return [...detail.timeline].sort(
      (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
    )
  }, [detail])

  if (loading || !user || !detail) {
    return <div className="min-h-screen bg-white" />
  }

  const candidate = detail.candidate

  const onChangeStage = (stage: CandidateStage) => {
    persistPipelineStage(candidate.id, stage)
    setCurrentStage(stage)
    setDetail((prev) => {
      if (!prev) return prev
      const timelineEvent: TimelineItem = {
        id: `tl-new-stage-${Date.now()}`,
        type: 'stage-changed',
        title: 'Cambio de etapa',
        detail: `Movido a ${stageLabels[stage]}.`,
        at: new Date().toISOString(),
        author: 'Reclutador actual',
      }
      return {
        ...prev,
        candidate: {
          ...prev.candidate,
          stage,
          updatedAt: new Date().toISOString(),
        },
        timeline: [timelineEvent, ...prev.timeline],
      }
    })
    setShowToast(`Etapa actualizada a ${stageLabels[stage]}`)
  }

  const onScheduleInterview = () => {
    const newInterview: Interview = {
      id: `int-${Date.now()}`,
      candidateId: candidate.id,
      type: InterviewType.VIDEO,
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      time: '11:30',
      interviewer: 'Panel Hiring',
      notes: 'Sesion enfocada en competencias y colaboracion.',
      result: 'pending',
    }

    setDetail((prev) => {
      if (!prev) return prev
      const timelineEvent: TimelineItem = {
        id: `tl-new-interview-${Date.now()}`,
        type: 'interview',
        title: 'Entrevista agendada',
        detail: `Nueva entrevista ${interviewTypeLabels[newInterview.type]} para ${formatDateTime(newInterview.date)}.`,
        at: new Date().toISOString(),
        author: 'Talent Acquisition',
      }
      return {
        ...prev,
        interviews: [newInterview, ...prev.interviews],
        timeline: [timelineEvent, ...prev.timeline],
      }
    })
    setShowToast('Entrevista agendada correctamente')
  }

  const onDownloadCv = () => {
    if (candidate.cvUrl) {
      window.open(candidate.cvUrl, '_blank', 'noopener,noreferrer')
      setShowToast('Descargando CV')
      return
    }
    setShowToast('No hay CV disponible')
  }

  const onOpenConvertFlow = () => {
    setConfirmConvertOpen(true)
  }

  const onConfirmConversion = () => {
    setConfirmConvertOpen(false)

    // Smooth transition between modals
    window.setTimeout(() => {
      setEmployeeFormOpen(true)
    }, 140)
  }

  const onCreateEmployee = async (values: EmployeeFormValues) => {
    setConvertingEmployee(true)

    try {
      const createdEmployee = await employeesService.createEmployee(values)
      const now = new Date().toISOString()

      persistPipelineStage(candidate.id, CandidateStage.HIRED)
      setCurrentStage(CandidateStage.HIRED)

      setDetail((prev) => {
        if (!prev) return prev

        const stageEvent: TimelineItem = {
          id: `tl-convert-stage-${Date.now()}`,
          type: 'stage-changed',
          title: 'Cambio de etapa',
          detail: 'Movido a Contratado tras conversion a empleado.',
          at: now,
          author: 'Talent Acquisition',
        }

        const conversionEvent: TimelineItem = {
          id: `tl-convert-comment-${Date.now()}`,
          type: 'comment',
          title: 'Candidato convertido en empleado',
          detail: `Se creo el perfil de empleado ${createdEmployee.fullName} (${createdEmployee.id}).`,
          at: now,
          author: 'Sistema ATS',
        }

        return {
          ...prev,
          candidate: {
            ...prev.candidate,
            stage: CandidateStage.HIRED,
            updatedAt: now,
          },
          timeline: [conversionEvent, stageEvent, ...prev.timeline],
        }
      })

      setEmployeeFormDraft(values)
      setEmployeeFormOpen(false)
      setShowToast('Empleado creado y pipeline actualizado')
    } catch (error) {
      setShowToast(
        error instanceof Error
          ? `No se pudo crear el empleado: ${error.message}`
          : 'No se pudo crear el empleado'
      )
      throw error
    } finally {
      setConvertingEmployee(false)
    }
  }

  const onRejectCandidate = () => {
    onChangeStage(CandidateStage.REJECTED)
    setShowToast('Candidato rechazado')
  }

  return (
    <AppLayout
      user={user}
      breadcrumbs={[
        { label: 'NexoRH' },
        { label: 'Reclutamiento', href: '/recruitment' },
        { label: candidate.fullName },
      ]}
    >
      <div className="space-y-6 pb-10">
        <section className={cardClassName('overflow-hidden')}>
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="h-24 w-24 overflow-hidden rounded-3xl border-4 border-white/20 bg-white/10 shadow-lg">
                  {candidate.avatar ? (
                    <img src={candidate.avatar} alt={candidate.fullName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-white">
                      {candidate.fullName.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                      {candidate.fullName}
                    </h1>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${stageBadgeClasses[currentStage]}`}
                    >
                      {stageLabels[currentStage]}
                    </span>
                  </div>

                  <p className="text-base text-slate-200 md:text-lg">{candidate.position}</p>

                  <div className="flex flex-wrap items-center gap-5 text-sm text-slate-200">
                    <span className="inline-flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {candidate.email}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {candidate.phone ?? 'Sin telefono'}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="h-4 w-4" />
                      Fuente: {sourceLabels[candidate.source]}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-300">Rating</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center gap-1">{renderStars(candidate.rating ?? 0)}</div>
                  <span className="text-sm font-semibold text-white">{candidate.rating ?? 0}/5</span>
                </div>
                <p className="mt-2 text-sm text-slate-200">Score global: {candidate.score ?? 0}/10</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 p-4 md:p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <button
                onClick={() => onChangeStage(CandidateStage.SCREENING)}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
              >
                Cambiar etapa
              </button>
              <button
                onClick={onScheduleInterview}
                className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
              >
                Agendar entrevista
              </button>
              <button
                onClick={onDownloadCv}
                className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-medium text-sky-700 transition hover:bg-sky-100"
              >
                Descargar CV
              </button>
              <button
                onClick={onOpenConvertFlow}
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
              >
                Convertir en empleado
              </button>
              <button
                onClick={onRejectCandidate}
                className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
              >
                Rechazar candidato
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <article className={cardClassName('p-5 md:p-6')}>
              <header className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">1. Informacion personal</h2>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">Perfil</span>
              </header>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Ubicacion</p>
                  <p className="mt-1 text-sm text-slate-800">{detail.location}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Disponibilidad</p>
                  <p className="mt-1 text-sm text-slate-800">{detail.availability}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Nivel de ingles</p>
                  <p className="mt-1 text-sm text-slate-800">{detail.englishLevel}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Pretension salarial</p>
                  <p className="mt-1 text-sm text-slate-800">{detail.salaryExpectation}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Experiencia total</p>
                  <p className="mt-1 text-sm text-slate-800">{detail.yearsOfExperience} anios</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Reclutador</p>
                  <p className="mt-1 text-sm text-slate-800">{candidate.recruiter ?? 'Sin asignar'}</p>
                </div>
              </div>
            </article>

            <article className={cardClassName('p-5 md:p-6')}>
              <header className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">2. Experiencia</h2>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {detail.experience.length} roles
                </span>
              </header>
              <div className="space-y-3">
                {detail.experience.map((item) => (
                  <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{item.role}</p>
                      <span className="text-xs font-medium text-slate-500">{item.period}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-700">{item.company}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.summary}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className={cardClassName('p-5 md:p-6')}>
              <header className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">3. Skills</h2>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {detail.skills.length} skills
                </span>
              </header>
              <div className="space-y-3">
                {detail.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-800">{skill.name}</span>
                      <span className="text-slate-500">{skill.level}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {candidate.tags && candidate.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {candidate.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>

            <article className={cardClassName('p-5 md:p-6')}>
              <header className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">5. Entrevistas</h2>
                <button
                  onClick={onScheduleInterview}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Nueva entrevista
                </button>
              </header>

              <div className="space-y-3">
                {detail.interviews.map((interview) => (
                  <div key={interview.id} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                        {interviewTypeLabels[interview.type]}
                      </span>
                      <span className="text-xs text-slate-500">{formatDateTime(interview.date)}</span>
                      <span className="text-xs text-slate-500">{interview.interviewer ?? 'Sin entrevistador'}</span>
                      <span className="ml-auto rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600">
                        Resultado: {interview.result ?? 'pending'}
                      </span>
                    </div>
                    {interview.notes && (
                      <p className="mt-2 text-sm text-slate-600">{interview.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="space-y-6">
            <article className={cardClassName('p-5 md:p-6')}>
              <header className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">4. Timeline actividad</h2>
                <p className="mt-1 text-sm text-slate-500">Actividad reciente del candidato</p>
              </header>

              <div className="relative pl-6">
                <div className="absolute bottom-0 left-2 top-0 w-px bg-slate-200" />
                <div className="space-y-4">
                  {sortedTimeline.map((event) => (
                    <div key={event.id} className="relative">
                      <div
                        className={`absolute -left-[1.65rem] top-0 grid h-8 w-8 place-items-center rounded-full ring-4 ${timelineColorByType[event.type]}`}
                      >
                        {getTimelineIcon(event.type)}
                      </div>
                      <div className="rounded-xl border border-slate-200 p-3.5">
                        <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{event.detail}</p>
                        <p className="mt-2 text-xs text-slate-500">
                          {formatDateTime(event.at)} · {event.author}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className={cardClassName('p-5 md:p-6')}>
              <header className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">6. Archivos</h2>
                <p className="mt-1 text-sm text-slate-500">Documentacion del proceso</p>
              </header>

              <div className="space-y-2.5">
                {detail.files.map((file) => (
                  <a
                    key={file.id}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <div className="rounded-lg bg-slate-100 p-2 text-slate-600 group-hover:bg-slate-200">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
                      <p className="text-xs text-slate-500">
                        {file.kind} · {file.size} · {formatDate(file.uploadedAt)}
                      </p>
                    </div>
                    <Download className="h-4 w-4 text-slate-500" />
                  </a>
                ))}
              </div>
            </article>

            <article className={cardClassName('p-5 md:p-6')}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Notas del reclutador</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{candidate.notes ?? 'Sin notas registradas.'}</p>
              <p className="mt-4 text-xs text-slate-500">Actualizado el {formatDateTime(candidate.updatedAt)}</p>
            </article>
          </div>
        </section>
      </div>

      <Modal
        open={confirmConvertOpen}
        onClose={() => setConfirmConvertOpen(false)}
        title="Convertir candidato en empleado"
        description="Se abrira el formulario de empleado con datos precargados para completar la alta."
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmConvertOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={onConfirmConversion}>
              Continuar
            </Button>
          </div>
        }
      >
        <div className="space-y-3 text-sm text-slate-700">
          <p>
            Se conservaran los datos actuales del candidato y podras completar los campos faltantes antes de crear el empleado.
          </p>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-emerald-700">
            Al finalizar, el estado del pipeline se actualizara automaticamente a <strong>Contratado</strong>.
          </div>
        </div>
      </Modal>

      <Modal
        open={employeeFormOpen}
        onClose={() => setEmployeeFormOpen(false)}
        title="Alta de empleado desde candidato"
        description="Formulario precargado con informacion del candidato. Completa los datos requeridos para continuar."
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-600">
            Datos mantenidos: nombre, correo, telefono y contexto de vacante. Puedes editarlos antes de crear el empleado.
          </div>

          {employeeFormDraft ? (
            <EmployeeForm
              initialValues={employeeFormDraft}
              submitLabel={convertingEmployee ? 'Creando empleado...' : 'Crear empleado'}
              onCancel={() => setEmployeeFormOpen(false)}
              onValuesChange={(values) => setEmployeeFormDraft(values)}
              onSubmit={onCreateEmployee}
            />
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Preparando formulario...
            </div>
          )}
        </div>
      </Modal>

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            {currentStage === CandidateStage.REJECTED ? (
              <XCircle className="h-4 w-4 text-rose-600" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            )}
            {showToast}
          </div>
        </div>
      )}
    </AppLayout>
  )
}
