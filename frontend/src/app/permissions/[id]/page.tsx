'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  MessageSquareText,
  Pencil,
  ShieldAlert,
  UserRound,
  XCircle,
} from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import EmptyState from '@/components/ui/EmptyState'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { getCurrentUser, getUsers, User } from '@/services/api'
import { mapUsersToEmployees } from '@/components/employees/employee-data'
import {
  generatePermissionRequests,
  humanDate,
  PermissionRequest,
  PermissionStatus,
} from '@/components/permissions/permissions-data'

const STATUS_BADGE: Record<PermissionStatus, React.ReactNode> = {
  pending: <Badge variant="warning">Pendiente</Badge>,
  approved: <Badge variant="success">Aprobada</Badge>,
  rejected: <Badge variant="danger">Rechazada</Badge>,
  cancelled: <Badge variant="muted">Cancelada</Badge>,
}

function PermissionDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm">
        <div className="h-7 w-64 bg-gray-100 rounded mb-2" />
        <div className="h-4 w-96 bg-gray-100 rounded" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-52 bg-white rounded-2xl border border-gray-200/80" />
          ))}
        </div>
        <div className="xl:col-span-4 space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-60 bg-white rounded-2xl border border-gray-200/80" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PermissionDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [request, setRequest] = useState<PermissionRequest | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ action: 'approve' | 'reject' | 'cancel' } | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.replace('/login')
      return
    }

    Promise.all([getCurrentUser(token), getUsers(token)])
      .then(([currentUser, allUsers]) => {
        const employees = mapUsersToEmployees(allUsers)
        const requests = generatePermissionRequests(employees)
        setUser(currentUser)
        setRequest(requests.find((r) => r.id === params.id) ?? null)
      })
      .catch(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.replace('/login')
      })
      .finally(() => setLoading(false))
  }, [params.id, router])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const timelineDotColors = {
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    gray: 'bg-slate-400',
  }

  const applyAction = () => {
    if (!request || !confirmAction) return

    const nextStatusMap: Record<typeof confirmAction.action, PermissionStatus> = {
      approve: 'approved',
      reject: 'rejected',
      cancel: 'cancelled',
    }

    const nextStatus = nextStatusMap[confirmAction.action]
    setRequest({
      ...request,
      status: nextStatus,
      updatedAt: new Date().toISOString().slice(0, 10),
      timeline: [
        {
          id: `tl-manual-${Date.now()}`,
          title: 'Estado actualizado',
          description: `La solicitud fue marcada como ${nextStatus}.`,
          date: new Date().toISOString().slice(0, 10),
          tone: nextStatus === 'approved' ? 'green' : nextStatus === 'rejected' ? 'gray' : 'amber',
        },
        ...request.timeline,
      ],
    })

    setToast(
      confirmAction.action === 'approve'
        ? 'Solicitud aprobada.'
        : confirmAction.action === 'reject'
        ? 'Solicitud rechazada.'
        : 'Solicitud cancelada.',
    )

    setConfirmAction(null)
  }

  if (loading) {
    return (
      <AppLayout user={user} breadcrumbs={[{ label: 'NexoRH' }, { label: 'Permisos y Ausencias' }, { label: 'Detalle' }]}>
        <PermissionDetailSkeleton />
      </AppLayout>
    )
  }

  if (!user) return null

  if (!request) {
    return (
      <AppLayout
        user={user}
        breadcrumbs={[{ label: 'NexoRH', href: '/dashboard' }, { label: 'Permisos y Ausencias', href: '/permissions' }, { label: 'Detalle' }]}
      >
        <div className="rounded-2xl border border-gray-200/80 bg-white shadow-sm">
          <EmptyState
            icon={ShieldAlert}
            title="Solicitud no encontrada"
            description="No existe un registro con este identificador o no tienes acceso."
            action={{ label: 'Volver a permisos', onClick: () => router.push('/permissions') }}
          />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout
      user={user}
      breadcrumbs={[
        { label: 'NexoRH', href: '/dashboard' },
        { label: 'Permisos y Ausencias', href: '/permissions' },
        { label: request.employeeName },
      ]}
    >
      <Card hoverable className="mb-6">
        <CardBody className="p-6 sm:p-7">
          <div className="flex flex-col lg:flex-row lg:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 text-xl font-semibold flex items-center justify-center shrink-0">
              {request.employeeName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight truncate">{request.employeeName}</h1>
              <p className="text-sm text-gray-500 truncate mt-1">{request.type}</p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {STATUS_BADGE[request.status]}
                <Badge variant="muted">{request.department}</Badge>
                <Badge variant="muted">{humanDate(request.startDate)} - {humanDate(request.endDate)}</Badge>
              </div>
            </div>

            <div className="lg:ml-auto flex flex-wrap items-center gap-2">
              <Button onClick={() => setConfirmAction({ action: 'approve' })} disabled={request.status === 'approved' || request.status === 'cancelled'}>
                Aprobar
              </Button>
              <Button variant="danger" onClick={() => setConfirmAction({ action: 'reject' })} disabled={request.status === 'rejected' || request.status === 'cancelled'}>
                Rechazar
              </Button>
              <Button variant="ghost" leftIcon={<Pencil className="w-4 h-4" />} onClick={() => setToast('Edicion disponible en la siguiente iteracion del modulo.')}>
                Editar
              </Button>
              <Button variant="warning" onClick={() => setConfirmAction({ action: 'cancel' })} disabled={request.status === 'cancelled'}>
                Cancelar
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          <Card hoverable>
            <CardHeader title="Informacion general" description="Datos principales de la solicitud" />
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="rounded-xl border border-gray-200 p-4 bg-gray-50/40">
                  <p><strong className="text-gray-900">Empleado:</strong> {request.employeeName}</p>
                  <p className="mt-1"><strong className="text-gray-900">Correo:</strong> {request.employeeEmail}</p>
                  <p className="mt-1"><strong className="text-gray-900">Manager:</strong> {request.manager}</p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 bg-gray-50/40">
                  <p><strong className="text-gray-900">Tipo:</strong> {request.type}</p>
                  <p className="mt-1"><strong className="text-gray-900">Inicio:</strong> {humanDate(request.startDate)}</p>
                  <p className="mt-1"><strong className="text-gray-900">Fin:</strong> {humanDate(request.endDate)}</p>
                  <p className="mt-1"><strong className="text-gray-900">Duracion:</strong> {request.duration} dia(s)</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card hoverable>
            <CardHeader title="Motivo" description="Justificacion registrada" />
            <CardBody>
              <div className="rounded-xl border border-gray-200 p-4 bg-gray-50/40">
                <p className="text-sm text-gray-700 leading-relaxed">{request.reason}</p>
              </div>
            </CardBody>
          </Card>

          <Card hoverable>
            <CardHeader title="Timeline de actividad" description="Seguimiento cronologico de la solicitud" />
            <CardBody>
              <ol className="space-y-4">
                {request.timeline.map((item) => (
                  <li key={item.id} className="relative pl-6">
                    <span className={`absolute left-0 top-2.5 w-2 h-2 rounded-full ${timelineDotColors[item.tone]}`} />
                    <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-3">
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{item.description}</p>
                      <p className="text-xs text-gray-400 mt-1.5">{humanDate(item.date)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardBody>
          </Card>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <Card hoverable>
            <CardHeader title="Historial de aprobacion" description="Trazabilidad de decisiones" />
            <CardBody>
              {request.approvalHistory.length === 0 ? (
                <EmptyState
                  icon={Clock3}
                  title="Sin historial"
                  description="Aun no hay decisiones registradas para esta solicitud."
                />
              ) : (
                <ul className="space-y-3">
                  {request.approvalHistory.map((item) => (
                    <li key={item.id} className="rounded-xl border border-gray-200 p-3 bg-gray-50/40">
                      <p className="text-sm font-medium text-gray-900">{item.action}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.actor}</p>
                      <p className="text-xs text-gray-400 mt-1">{humanDate(item.date)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          <Card hoverable>
            <CardHeader title="Archivos adjuntos" description="Documentos asociados a la solicitud" />
            <CardBody>
              {request.attachments.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="Sin adjuntos"
                  description="No se subieron archivos para esta solicitud."
                />
              ) : (
                <ul className="space-y-3">
                  {request.attachments.map((file) => (
                    <li key={file.id} className="rounded-xl border border-gray-200 p-3 bg-gray-50/40 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-400">{file.size}</p>
                      </div>
                      <button
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        title="Descargar archivo"
                      >
                        Descargar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          <Card hoverable>
            <CardHeader title="Comentarios" description="Notas y observaciones" />
            <CardBody>
              {request.comments.length === 0 ? (
                <EmptyState
                  icon={MessageSquareText}
                  title="Sin comentarios"
                  description="No hay comentarios asociados a este registro."
                />
              ) : (
                <ul className="space-y-3">
                  {request.comments.map((comment, index) => (
                    <li key={`${request.id}-comment-${index}`} className="rounded-xl border border-gray-200 p-3 bg-gray-50/40 text-sm text-gray-700">
                      {comment}
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal
        open={Boolean(confirmAction)}
        onClose={() => setConfirmAction(null)}
        title="Confirmar accion"
        description="Esta accion actualizara el estado de la solicitud."
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmAction(null)}>Cancelar</Button>
            <Button onClick={applyAction}>Confirmar</Button>
          </div>
        }
      >
        <p className="text-sm text-gray-600">
          {confirmAction?.action === 'approve' && 'La solicitud sera marcada como aprobada.'}
          {confirmAction?.action === 'reject' && 'La solicitud sera marcada como rechazada.'}
          {confirmAction?.action === 'cancel' && 'La solicitud sera marcada como cancelada.'}
        </p>
      </Modal>

      {toast && (
        <div className="fixed bottom-5 right-5 z-50">
          <div className="px-4 py-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium shadow-lg inline-flex items-center gap-2">
            <UserRound className="w-4 h-4" />
            {toast}
          </div>
        </div>
      )}
    </AppLayout>
  )
}
