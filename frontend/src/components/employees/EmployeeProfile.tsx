import { useMemo, useState } from 'react'
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  KeyRound,
  Mail,
  Phone,
  Shield,
  UserMinus,
} from 'lucide-react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import StatusBadge from '@/components/ui/StatusBadge'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import EmptyState from '@/components/ui/EmptyState'
import { EmployeeRecord } from './types'

interface EmployeeProfileProps {
  employee: EmployeeRecord
  onEdit: () => void
}

interface ActivityItem {
  id: string
  label: string
  detail: string
  date: string
  tone: 'blue' | 'green' | 'gray'
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  })
}

export default function EmployeeProfile({ employee, onEdit }: EmployeeProfileProps) {
  const [confirmDeactivateOpen, setConfirmDeactivateOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [isInactive, setIsInactive] = useState(employee.status === 'inactive')

  const activity: ActivityItem[] = useMemo(
    () => [
      {
        id: 'a1',
        label: 'Acceso al dashboard',
        detail: 'Inicio de sesion exitoso en plataforma',
        date: 'Hace 2 horas',
        tone: 'blue',
      },
      {
        id: 'a2',
        label: 'Actualizacion de perfil',
        detail: 'Se modifico informacion de contacto',
        date: 'Hace 1 dia',
        tone: 'green',
      },
      {
        id: 'a3',
        label: 'Cambio de rol',
        detail: 'Asignacion de permisos revisada por RRHH',
        date: 'Hace 8 dias',
        tone: 'gray',
      },
    ],
    [],
  )

  const activityDotColor: Record<ActivityItem['tone'], string> = {
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    gray: 'bg-slate-400',
  }

  const absenceSummary = {
    pending: 1,
    approved: 4,
    rejected: 0,
  }

  const historyEvents = [
    { id: 'h1', title: 'Creacion de perfil', date: formatDate(employee.createdAt) },
    { id: 'h2', title: 'Asignacion a departamento', date: '03 enero 2026' },
    { id: 'h3', title: 'Revision de permisos', date: '11 marzo 2026' },
  ]

  const showStatus = employee.status === 'baja' ? 'baja' : isInactive ? 'inactive' : 'active'

  const triggerToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2200)
  }

  const handleDeactivate = () => {
    setIsInactive(true)
    setConfirmDeactivateOpen(false)
    triggerToast('Empleado desactivado correctamente')
  }

  const handleResetPassword = () => {
    triggerToast('Se envio un enlace para reiniciar la contrasena')
  }

  return (
    <section className="space-y-6">
      <Card hoverable>
        <CardBody className="p-6 sm:p-7">
          <div className="flex flex-col lg:flex-row lg:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-blue-100 text-blue-700 text-2xl font-semibold flex items-center justify-center shrink-0">
              {employee.fullName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-gray-900 tracking-tight truncate">{employee.fullName}</h1>
              <p className="text-sm text-gray-500 truncate mt-1">{employee.email}</p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <StatusBadge value={employee.role} variant="role" />
                {showStatus === 'baja' ? <Badge variant="danger">Baja</Badge> : <StatusBadge value={showStatus} variant="status" />}
                <Badge variant="muted">{employee.department}</Badge>
              </div>
            </div>

            <div className="lg:ml-auto flex flex-wrap items-center gap-2">
              <Button onClick={onEdit}>Editar empleado</Button>
              <Button
                variant="warning"
                leftIcon={<UserMinus className="w-4 h-4" />}
                onClick={() => setConfirmDeactivateOpen(true)}
                disabled={showStatus === 'inactive' || showStatus === 'baja'}
              >
                Desactivar
              </Button>
              <Button variant="ghost" leftIcon={<KeyRound className="w-4 h-4" />} onClick={handleResetPassword}>
                Reiniciar contrasena
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-7 space-y-6">
          <Card hoverable>
            <CardHeader
              title="Informacion general"
              description="Datos personales y de contacto del colaborador"
            />
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-gray-200 p-4 bg-gray-50/40">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Contacto</p>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {employee.email}</p>
                    <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {employee.phone || 'Sin telefono'}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 bg-gray-50/40">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Identidad</p>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong className="text-gray-900">ID:</strong> {employee.id.slice(0, 8).toUpperCase()}</p>
                    <p><strong className="text-gray-900">Empresa:</strong> {employee.companyId.slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card hoverable>
            <CardHeader
              title="Informacion laboral"
              description="Resumen de estructura, posicion y vigencia"
            />
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="rounded-xl border border-gray-200 p-4 bg-gray-50/40">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Organizacion</p>
                  <div className="space-y-2 text-gray-700">
                    <p className="flex items-center gap-2"><Building2 className="w-4 h-4 text-gray-400" /> {employee.department}</p>
                    <p className="flex items-center gap-2"><Shield className="w-4 h-4 text-gray-400" /> Rol: {employee.role}</p>
                    <p className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-gray-400" /> Ingreso: {formatDate(employee.createdAt)}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 bg-gray-50/40">
                  <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Estado contractual</p>
                  <div className="space-y-2 text-gray-700">
                    <p>Modalidad: Tiempo completo</p>
                    <p>Jornada: 09:00 - 18:00</p>
                    <p>Supervisor: Recursos Humanos</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card hoverable>
            <CardHeader
              title="Actividad reciente"
              description="Timeline de eventos de cuenta y uso"
            />
            <CardBody>
              {activity.length === 0 ? (
                <EmptyState
                  icon={Clock3}
                  title="Sin actividad reciente"
                  description="Aun no hay eventos registrados para este empleado."
                />
              ) : (
                <ol className="space-y-4">
                  {activity.map((item) => (
                    <li key={item.id} className="relative pl-6">
                      <span className={`absolute left-0 top-2.5 w-2 h-2 rounded-full ${activityDotColor[item.tone]}`} />
                      <div className="rounded-xl border border-gray-200 bg-gray-50/40 p-3">
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{item.detail}</p>
                        <p className="text-xs text-gray-400 mt-1.5">{item.date}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="xl:col-span-5 space-y-6">
          <Card hoverable>
            <CardHeader
              title="Permisos y ausencias"
              description="Control y balance de solicitudes"
            />
            <CardBody>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
                  <p className="text-2xl font-semibold text-emerald-700">{absenceSummary.approved}</p>
                  <p className="text-xs text-emerald-700/90">Aprobadas</p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
                  <p className="text-2xl font-semibold text-amber-700">{absenceSummary.pending}</p>
                  <p className="text-xs text-amber-700/90">Pendientes</p>
                </div>
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-center">
                  <p className="text-2xl font-semibold text-rose-700">{absenceSummary.rejected}</p>
                  <p className="text-xs text-rose-700/90">Rechazadas</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card hoverable>
            <CardHeader
              title="Historial"
              description="Eventos administrativos relevantes"
            />
            <CardBody>
              {historyEvents.length === 0 ? (
                <EmptyState
                  icon={Clock3}
                  title="Sin historial"
                  description="No hay cambios administrativos registrados."
                />
              ) : (
                <ul className="space-y-3">
                  {historyEvents.map((event) => (
                    <li key={event.id} className="rounded-xl border border-gray-200 p-3 bg-gray-50/40">
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{event.date}</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal
        open={confirmDeactivateOpen}
        onClose={() => setConfirmDeactivateOpen(false)}
        title="Confirmar desactivacion"
        description="Esta accion bloquea el acceso del empleado al sistema."
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmDeactivateOpen(false)}>Cancelar</Button>
            <Button variant="warning" onClick={handleDeactivate}>Desactivar</Button>
          </div>
        }
      >
        <p className="text-sm text-gray-600">
          El perfil seguira visible para auditoria, pero el usuario no podra iniciar sesion.
        </p>
      </Modal>

      {toast && (
        <div className="fixed bottom-5 right-5 z-50">
          <div className="px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium shadow-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {toast}
          </div>
        </div>
      )}
    </section>
  )
}
