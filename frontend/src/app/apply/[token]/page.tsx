'use client'

import { useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  CheckCircle2,
  FileText,
  Loader2,
  UploadCloud,
  Building2,
  Link as LinkIcon,
  Mail,
  Phone,
  User,
  MessageSquare,
  Briefcase,
  X,
} from 'lucide-react'

type ApplyFormValues = {
  fullName: string
  email: string
  phone: string
  linkedin: string
  portfolio: string
  message: string
  cvFile: File | null
}

type ApplyFormErrors = Partial<Record<keyof ApplyFormValues, string>>

type Opportunity = {
  companyName: string
  roleTitle: string
  location: string
  mode: string
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
const ACCEPTED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
const ACCEPTED_FILE_EXTENSIONS = ['.pdf', '.docx']

function getOpportunityByToken(token: string): Opportunity {
  const catalog: Record<string, Opportunity> = {
    'ux-2026-premium': {
      companyName: 'NexoRH',
      roleTitle: 'Senior Product Designer',
      location: 'CDMX, Mexico',
      mode: 'Hibrido',
    },
    'be-2026-node': {
      companyName: 'NexoRH',
      roleTitle: 'Backend Engineer (Node.js)',
      location: 'Guadalajara, Mexico',
      mode: 'Remoto',
    },
  }

  return (
    catalog[token] ?? {
      companyName: 'NexoRH',
      roleTitle: 'Vacante abierta',
      location: 'Latam',
      mode: 'Remoto',
    }
  )
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidUrl(value: string) {
  if (!value.trim()) return true
  try {
    const normalized = value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`
    const url = new URL(normalized)
    return Boolean(url.hostname)
  } catch {
    return false
  }
}

function normalizeUrl(value: string) {
  if (!value.trim()) return ''
  if (value.startsWith('http://') || value.startsWith('https://')) return value
  return `https://${value}`
}

function validateFile(file: File | null): string {
  if (!file) return 'Adjunta tu CV en PDF o DOCX.'

  const lowerName = file.name.toLowerCase()
  const hasValidExtension = ACCEPTED_FILE_EXTENSIONS.some((extension) => lowerName.endsWith(extension))
  const hasValidType = ACCEPTED_MIME_TYPES.includes(file.type)

  if (!hasValidType && !hasValidExtension) {
    return 'Formato no valido. Solo PDF o DOCX.'
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return 'El archivo supera 5MB.'
  }

  return ''
}

function validate(values: ApplyFormValues): ApplyFormErrors {
  const errors: ApplyFormErrors = {}

  if (!values.fullName.trim()) {
    errors.fullName = 'Ingresa tu nombre completo.'
  } else if (values.fullName.trim().length < 3) {
    errors.fullName = 'Minimo 3 caracteres.'
  }

  if (!values.email.trim()) {
    errors.email = 'Ingresa tu correo.'
  } else if (!isValidEmail(values.email.trim())) {
    errors.email = 'Correo invalido.'
  }

  if (!values.phone.trim()) {
    errors.phone = 'Ingresa tu telefono.'
  } else if (values.phone.replace(/\D/g, '').length < 10) {
    errors.phone = 'Ingresa al menos 10 digitos.'
  }

  if (!values.linkedin.trim()) {
    errors.linkedin = 'Comparte tu perfil de LinkedIn.'
  } else if (!isValidUrl(values.linkedin.trim())) {
    errors.linkedin = 'URL invalida para LinkedIn.'
  }

  if (values.portfolio.trim() && !isValidUrl(values.portfolio.trim())) {
    errors.portfolio = 'URL invalida para portfolio.'
  }

  if (!values.message.trim()) {
    errors.message = 'Cuéntanos brevemente por que te interesa esta vacante.'.replace('é', 'e')
  } else if (values.message.trim().length < 20) {
    errors.message = 'Minimo 20 caracteres.'
  }

  const fileError = validateFile(values.cvFile)
  if (fileError) {
    errors.cvFile = fileError
  }

  return errors
}

function fieldBaseClass(hasError: boolean) {
  return [
    'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all',
    'placeholder:text-slate-400 focus:outline-none focus:ring-2',
    hasError
      ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
      : 'border-slate-200 focus:border-sky-400 focus:ring-sky-100',
  ].join(' ')
}

export default function PublicApplicationPage() {
  const params = useParams<{ token: string }>()
  const token = params?.token ?? 'open-role'
  const opportunity = useMemo(() => getOpportunityByToken(token), [token])

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [values, setValues] = useState<ApplyFormValues>({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    message: '',
    cvFile: null,
  })
  const [errors, setErrors] = useState<ApplyFormErrors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof ApplyFormValues, boolean>>>({})
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const canSubmit = useMemo(() => Object.keys(validate(values)).length === 0, [values])

  const setField = (name: keyof ApplyFormValues, value: string | File | null) => {
    setValues((prev) => ({ ...prev, [name]: value }))

    if (touched[name]) {
      const next = { ...values, [name]: value } as ApplyFormValues
      const nextErrors = validate(next)
      setErrors(nextErrors)
    }
  }

  const touchField = (name: keyof ApplyFormValues) => {
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors(validate(values))
  }

  const handleFileSelection = (file: File | null) => {
    setField('cvFile', file)
    setTouched((prev) => ({ ...prev, cvFile: true }))
  }

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    handleFileSelection(file)
  }

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragActive(false)
    const file = event.dataTransfer.files?.[0] ?? null
    handleFileSelection(file)
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (isSubmitting) return

    const validationErrors = validate(values)
    setErrors(validationErrors)
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      linkedin: true,
      portfolio: true,
      message: true,
      cvFile: true,
    })

    if (Object.keys(validationErrors).length > 0) return

    setIsSubmitting(true)
    setUploadProgress(0)

    await new Promise<void>((resolve) => {
      let progress = 0
      const timer = window.setInterval(() => {
        progress += Math.floor(Math.random() * 16) + 8
        const clamped = Math.min(progress, 100)
        setUploadProgress(clamped)

        if (clamped >= 100) {
          window.clearInterval(timer)
          resolve()
        }
      }, 170)
    })

    // Mock submit request
    await new Promise((resolve) => window.setTimeout(resolve, 550))

    setIsSubmitting(false)
    setIsSuccess(true)
  }

  if (isSuccess) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-sky-200/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        </div>

        <section className="relative mx-auto max-w-2xl rounded-3xl border border-slate-200/80 bg-white/95 p-8 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Solicitud enviada</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Tu solicitud fue enviada correctamente</h1>
          <p className="mt-3 text-slate-600">
            Gracias por postularte a {opportunity.companyName}. Nuestro equipo revisara tu perfil y se pondra en contacto contigo.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-600">
              Vacante: <span className="font-semibold text-slate-800">{opportunity.roleTitle}</span>
            </p>
            <p className="mt-1 text-sm text-slate-600">Token de referencia: {token}</p>
          </div>

          <button
            onClick={() => {
              setIsSuccess(false)
              setValues({
                fullName: '',
                email: '',
                phone: '',
                linkedin: '',
                portfolio: '',
                message: '',
                cvFile: null,
              })
              setTouched({})
              setErrors({})
              setUploadProgress(0)
            }}
            className="mt-6 inline-flex rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            Enviar otra postulacion
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-sky-200/45 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-[-4rem] h-72 w-72 rounded-full bg-indigo-200/35 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-3xl rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
        <header className="border-b border-slate-200 px-6 py-6 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 text-sm font-bold text-white">N</div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{opportunity.companyName}</p>
                <p className="text-xs text-slate-500">Careers</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              <Building2 className="h-3.5 w-3.5" />
              {opportunity.location} · {opportunity.mode}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Postulacion publica</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{opportunity.roleTitle}</h1>
            <p className="mt-2 text-sm text-slate-600">
              Completa este formulario para enviar tu perfil. Te tomara menos de 5 minutos.
            </p>
          </div>
        </header>

        <form onSubmit={onSubmit} className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <User className="h-4 w-4 text-slate-400" />
                Nombre
              </label>
              <input
                value={values.fullName}
                onChange={(e) => setField('fullName', e.target.value)}
                onBlur={() => touchField('fullName')}
                placeholder="Tu nombre completo"
                className={fieldBaseClass(Boolean(errors.fullName && touched.fullName))}
                disabled={isSubmitting}
              />
              {errors.fullName && touched.fullName ? <p className="mt-1 text-xs text-rose-600">{errors.fullName}</p> : null}
            </div>

            <div>
              <label className="mb-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <Mail className="h-4 w-4 text-slate-400" />
                Correo
              </label>
              <input
                type="email"
                value={values.email}
                onChange={(e) => setField('email', e.target.value)}
                onBlur={() => touchField('email')}
                placeholder="tu@correo.com"
                className={fieldBaseClass(Boolean(errors.email && touched.email))}
                disabled={isSubmitting}
              />
              {errors.email && touched.email ? <p className="mt-1 text-xs text-rose-600">{errors.email}</p> : null}
            </div>

            <div>
              <label className="mb-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <Phone className="h-4 w-4 text-slate-400" />
                Telefono
              </label>
              <input
                value={values.phone}
                onChange={(e) => setField('phone', e.target.value)}
                onBlur={() => touchField('phone')}
                placeholder="+52 55 0000 0000"
                className={fieldBaseClass(Boolean(errors.phone && touched.phone))}
                disabled={isSubmitting}
              />
              {errors.phone && touched.phone ? <p className="mt-1 text-xs text-rose-600">{errors.phone}</p> : null}
            </div>

            <div>
              <label className="mb-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <LinkIcon className="h-4 w-4 text-slate-400" />
                LinkedIn
              </label>
              <input
                value={values.linkedin}
                onChange={(e) => setField('linkedin', e.target.value)}
                onBlur={() => {
                  touchField('linkedin')
                  if (!errors.linkedin) {
                    setField('linkedin', normalizeUrl(values.linkedin.trim()))
                  }
                }}
                placeholder="linkedin.com/in/tu-perfil"
                className={fieldBaseClass(Boolean(errors.linkedin && touched.linkedin))}
                disabled={isSubmitting}
              />
              {errors.linkedin && touched.linkedin ? <p className="mt-1 text-xs text-rose-600">{errors.linkedin}</p> : null}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <Briefcase className="h-4 w-4 text-slate-400" />
                Portfolio
              </label>
              <input
                value={values.portfolio}
                onChange={(e) => setField('portfolio', e.target.value)}
                onBlur={() => {
                  touchField('portfolio')
                  if (values.portfolio.trim() && !errors.portfolio) {
                    setField('portfolio', normalizeUrl(values.portfolio.trim()))
                  }
                }}
                placeholder="behance.net/tu-portfolio o dribbble.com/tu-perfil"
                className={fieldBaseClass(Boolean(errors.portfolio && touched.portfolio))}
                disabled={isSubmitting}
              />
              {errors.portfolio && touched.portfolio ? <p className="mt-1 text-xs text-rose-600">{errors.portfolio}</p> : null}
            </div>
          </div>

          <div>
            <label className="mb-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <FileText className="h-4 w-4 text-slate-400" />
              CV upload
            </label>

            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragActive(true)
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                setDragActive(false)
              }}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={[
                'group cursor-pointer rounded-2xl border border-dashed p-5 transition',
                dragActive
                  ? 'border-sky-400 bg-sky-50'
                  : errors.cvFile && touched.cvFile
                  ? 'border-rose-300 bg-rose-50/40'
                  : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100/70',
              ].join(' ')}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={onFileInputChange}
                disabled={isSubmitting}
              />

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl bg-white p-2 text-slate-600 shadow-sm">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">Arrastra tu CV aqui o haz click para subirlo</p>
                  <p className="mt-1 text-xs text-slate-500">Formatos: PDF o DOCX · Tamano maximo: 5MB</p>

                  {values.cvFile ? (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600">
                      <FileText className="h-4 w-4 text-slate-500" />
                      <span className="max-w-[260px] truncate font-medium text-slate-700">{values.cvFile.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleFileSelection(null)
                        }}
                        className="rounded-md p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Quitar archivo"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {errors.cvFile && touched.cvFile ? <p className="mt-1 text-xs text-rose-600">{errors.cvFile}</p> : null}
          </div>

          <div>
            <label className="mb-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <MessageSquare className="h-4 w-4 text-slate-400" />
              Mensaje
            </label>
            <textarea
              value={values.message}
              onChange={(e) => setField('message', e.target.value)}
              onBlur={() => touchField('message')}
              rows={5}
              placeholder="Comparte tu motivacion, experiencia relevante y por que te interesa NexoRH."
              className={fieldBaseClass(Boolean(errors.message && touched.message)) + ' resize-y min-h-[120px]'}
              disabled={isSubmitting}
            />
            <div className="mt-1 flex items-center justify-between">
              {errors.message && touched.message ? <p className="text-xs text-rose-600">{errors.message}</p> : <span />}
              <p className="text-xs text-slate-400">{values.message.length} caracteres</p>
            </div>
          </div>

          {isSubmitting ? (
            <div className="rounded-xl border border-sky-200 bg-sky-50 p-3">
              <div className="mb-1.5 flex items-center gap-2 text-sm font-medium text-sky-700">
                <Loader2 className="h-4 w-4 animate-spin" />
                Subiendo CV y enviando solicitud...
              </div>
              <div className="h-2 rounded-full bg-sky-100">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="mt-1 text-right text-xs font-medium text-sky-700">{uploadProgress}%</p>
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Al enviar, aceptas que NexoRH procese tus datos para fines de reclutamiento.
            </p>

            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar postulacion'}
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
