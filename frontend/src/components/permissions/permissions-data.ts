import { EmployeeRecord } from '@/types/employee'
import {
  PermissionRequest,
  PermissionStatus,
  PermissionType,
} from '@/types/permission'
import { EmployeeRole } from '@/types/employee'

export {
  PermissionStatus,
  PermissionType,
} from '@/types/permission'
export type { PermissionRequest } from '@/types/permission'

export const REQUEST_TYPES: PermissionType[] = [
  PermissionType.VACATION,
  PermissionType.PERSONAL,
  PermissionType.MEDICAL,
  PermissionType.REMOTE,
]

export function isoDateOffset(offsetDays: number) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

export function humanDate(date: string) {
  return new Date(date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

export function dayDiff(start: string, end: string) {
  const startMs = new Date(start).getTime()
  const endMs = new Date(end).getTime()
  return Math.max(1, Math.floor((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1)
}

export function generatePermissionRequests(employees: EmployeeRecord[]): PermissionRequest[] {
  const managers = employees.filter((e) => e.role === EmployeeRole.ADMIN || e.role === EmployeeRole.MANAGER)

  return employees.slice(0, 16).map((employee, index) => {
    const start = isoDateOffset(-index * 3)
    const end = isoDateOffset(-index * 3 + (index % 4) + 1)
    const statusCycle: PermissionStatus[] = [
      PermissionStatus.PENDING,
      PermissionStatus.APPROVED,
      PermissionStatus.REJECTED,
      PermissionStatus.CANCELLED,
    ]
    const type = REQUEST_TYPES[index % REQUEST_TYPES.length]
    const manager = managers[index % Math.max(1, managers.length)]
    const status = statusCycle[index % statusCycle.length]

    return {
      id: `req-${employee.id.slice(0, 6)}-${index}`,
      employeeId: employee.id,
      employeeName: employee.fullName,
      employeeEmail: employee.email,
      department: employee.department,
      type,
      startDate: start,
      endDate: end,
      duration: dayDiff(start, end),
      status,
      manager: manager ? manager.fullName : 'Sin asignar',
      updatedAt: isoDateOffset(-index),
      reason:
        type === PermissionType.VACATION
          ? 'Solicitud de descanso programado y coordinado con el equipo.'
          : type === PermissionType.PERSONAL
          ? 'Atencion de asuntos personales con cobertura de actividades acordada.'
          : type === PermissionType.MEDICAL
          ? 'Reposo medico temporal con justificante adjunto.'
          : 'Trabajo remoto temporal por coordinacion operativa.',
      comments: [
        'Se adjunto documentacion para revision.',
        'Manager reviso disponibilidad de cobertura.',
      ],
      attachments: [
        { id: `att-${index}-1`, name: 'comprobante.pdf', size: '220 KB' },
        { id: `att-${index}-2`, name: 'detalle-solicitud.txt', size: '12 KB' },
      ],
      approvalHistory: [
        { id: `ah-${index}-1`, actor: employee.fullName, action: 'Solicitud creada', date: isoDateOffset(-index - 2) },
        { id: `ah-${index}-2`, actor: manager ? manager.fullName : 'Sistema', action: status === PermissionStatus.PENDING ? 'En revision' : status === PermissionStatus.APPROVED ? 'Aprobada' : status === PermissionStatus.REJECTED ? 'Rechazada' : 'Cancelada', date: isoDateOffset(-index) },
      ],
      timeline: [
        {
          id: `tl-${index}-1`,
          title: 'Solicitud creada',
          description: `${employee.fullName} registro una solicitud de ${type.toLowerCase()}.`,
          date: isoDateOffset(-index - 2),
          tone: 'blue',
        },
        {
          id: `tl-${index}-2`,
          title: 'Manager notificado',
          description: `Se notifico a ${manager ? manager.fullName : 'lider de equipo'} para revision.`,
          date: isoDateOffset(-index - 1),
          tone: 'amber',
        },
        {
          id: `tl-${index}-3`,
          title: 'Estado actualizado',
          description: `La solicitud se marco como ${status}.`,
          date: isoDateOffset(-index),
          tone: status === PermissionStatus.APPROVED ? 'green' : status === PermissionStatus.REJECTED ? 'gray' : 'blue',
        },
        {
          id: `tl-${index}-4`,
          title: 'Comentarios',
          description: 'Se agregaron notas para seguimiento y trazabilidad.',
          date: isoDateOffset(-index),
          tone: 'gray',
        },
      ],
    }
  })
}
