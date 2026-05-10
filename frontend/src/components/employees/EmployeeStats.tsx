import { ShieldCheck, UserCheck, UserMinus, Users } from 'lucide-react'
import StatCard from '@/components/ui/StatCard'
import { EmployeeRecord } from './types'
import { EmployeeRole, EmployeeStatus } from '@/types/employee'

interface EmployeeStatsProps {
  employees: EmployeeRecord[]
}

export default function EmployeeStats({ employees }: EmployeeStatsProps) {
  const active = employees.filter((e) => e.status === EmployeeStatus.ACTIVE).length
  const managers = employees.filter((e) => e.role === EmployeeRole.MANAGER).length
  const users = employees.filter((e) => e.role === EmployeeRole.USER).length
  const inactive = employees.filter((e) => e.status === EmployeeStatus.INACTIVE || e.status === EmployeeStatus.TERMINATED).length

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard title="Empleados activos" value={active} subtitle="Con acceso habilitado" icon={UserCheck} iconColor="text-emerald-600" />
      <StatCard title="Managers" value={managers} subtitle="Lideres de area" icon={ShieldCheck} iconColor="text-blue-600" />
      <StatCard title="Usuarios" value={users} subtitle="Miembros operativos" icon={Users} iconColor="text-indigo-600" />
      <StatCard title="Inactivos" value={inactive} subtitle="Incluye baja" icon={UserMinus} iconColor="text-gray-600" />
    </section>
  )
}
