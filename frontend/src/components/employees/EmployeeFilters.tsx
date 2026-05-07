import { Search } from 'lucide-react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { EmployeesFiltersValue } from './types'

interface EmployeeFiltersProps {
  value: EmployeesFiltersValue
  departments: string[]
  onChange: (next: EmployeesFiltersValue) => void
  onReset: () => void
}

export default function EmployeeFilters({ value, departments, onChange, onReset }: EmployeeFiltersProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3 mb-5">
      <div className="xl:col-span-2">
        <Input
          value={value.query}
          onChange={(e) => onChange({ ...value, query: e.target.value })}
          placeholder="Buscar por nombre o correo..."
          aria-label="Buscar empleados"
        />
      </div>

      <Select
        value={value.role}
        onChange={(e) => onChange({ ...value, role: e.target.value as EmployeesFiltersValue['role'] })}
        options={[
          { label: 'Todos los roles', value: 'all' },
          { label: 'Admin', value: 'ADMIN' },
          { label: 'Manager', value: 'MANAGER' },
          { label: 'Usuario', value: 'USER' },
        ]}
      />

      <Select
        value={value.status}
        onChange={(e) => onChange({ ...value, status: e.target.value as EmployeesFiltersValue['status'] })}
        options={[
          { label: 'Todos los estados', value: 'all' },
          { label: 'Activo', value: 'active' },
          { label: 'Inactivo', value: 'inactive' },
          { label: 'Baja', value: 'baja' },
        ]}
      />

      <Select
        value={value.sort}
        onChange={(e) => onChange({ ...value, sort: e.target.value as EmployeesFiltersValue['sort'] })}
        options={[
          { label: 'Nombre A-Z', value: 'name-asc' },
          { label: 'Nombre Z-A', value: 'name-desc' },
          { label: 'Ingreso reciente', value: 'date-desc' },
          { label: 'Ingreso antiguo', value: 'date-asc' },
        ]}
      />

      <div className="grid grid-cols-2 gap-2">
        <Select
          value={value.department}
          onChange={(e) => onChange({ ...value, department: e.target.value })}
          options={[
            { label: 'Departamento', value: 'all' },
            ...departments.map((d) => ({ label: d, value: d })),
          ]}
        />
        <Button variant="ghost" onClick={onReset} title="Limpiar filtros">
          Limpiar
        </Button>
      </div>

      <div className="md:col-span-2 xl:col-span-5 flex items-center gap-2 text-xs text-gray-400 -mt-1">
        <Search className="w-3.5 h-3.5" />
        Actualiza resultados en tiempo real
      </div>
    </section>
  )
}
