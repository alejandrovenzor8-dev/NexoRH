# CandidateCard - Quick Start Guide

## ⚡ Inicio Rápido

### 1. Importación

```typescript
import { CandidateCard } from '@/components/recruitment'
import type { Candidate, CandidatePriority, CandidateStage } from '@/types/recruitment'
```

### 2. Uso Básico

```tsx
<CandidateCard
  candidate={{
    id: '1',
    fullName: 'Juan García',
    email: 'juan@example.com',
    position: 'React Developer',
    source: 'linkedin' as any,
    stage: 'interview' as CandidateStage,
    priority: 'high' as CandidatePriority,
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }}
  onViewProfile={(id) => console.log('Ver perfil:', id)}
  onChangeStage={(id, stage) => console.log('Cambiar etapa:', id, stage)}
  onScheduleInterview={(id) => console.log('Agendar entrevista:', id)}
  onReject={(id) => console.log('Rechazar:', id)}
  onHire={(id) => console.log('Contratar:', id)}
/>
```

### 3. Con Todos los Datos

```tsx
<CandidateCard
  candidate={{
    id: '1',
    fullName: 'Alexandra Thompson',
    email: 'alexandra@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandra',
    position: 'Senior Engineer',
    source: 'linkedin',
    stage: 'interview',
    priority: 'critical',
    score: 9.5,
    rating: 5,
    tags: ['React', 'TypeScript', 'Node.js'],
    appliedAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    recruiter: 'María González',
    notes: 'Excelente candidato, muy recomendado',
    cvUrl: 'https://example.com/cv.pdf',
    linkedinUrl: 'https://linkedin.com/in/alexandra',
    seniority: 'Senior',
  }}
  isDragging={false}
  onViewProfile={handleViewProfile}
  onChangeStage={handleChangeStage}
  onScheduleInterview={handleScheduleInterview}
  onReject={handleReject}
  onHire={handleHire}
/>
```

---

## 🎯 Propiedades

### Requeridas

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `candidate` | `Candidate` | Objeto con datos del candidato |
| `onViewProfile` | `(id: string) => void` | Callback para ver perfil |
| `onChangeStage` | `(id: string, stage: CandidateStage) => void` | Cambiar etapa |
| `onScheduleInterview` | `(id: string) => void` | Agendar entrevista |
| `onReject` | `(id: string) => void` | Rechazar candidato |
| `onHire` | `(id: string) => void` | Contratar candidato |

### Opcionales

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `isDragging` | `boolean` | `false` | Indica si está siendo arrastrado |

---

## 📦 Candidate Interface

```typescript
interface Candidate {
  // Requeridos
  id: string
  fullName: string
  email: string
  position: string
  source: CandidateSource
  stage: CandidateStage
  priority: CandidatePriority
  appliedAt: string // ISO 8601 format
  updatedAt: string // ISO 8601 format

  // Opcionales
  phone?: string
  avatar?: string
  score?: number // 0-10
  rating?: number // 1-5 estrellas
  tags?: string[] // Skills/habilidades
  recruiter?: string // Nombre del reclutador
  notes?: string // Notas internas
  cvUrl?: string // URL del CV
  linkedinUrl?: string // Perfil LinkedIn
  seniority?: string // Senior, Mid-level, Junior, etc.
}
```

---

## 🎨 Enums

### CandidateStage
```typescript
enum CandidateStage {
  APPLIED = 'applied',        // Aplicó
  SCREENING = 'screening',    // En revisión
  INTERVIEW = 'interview',    // Entrevista
  OFFER = 'offer',            // Seleccionado
  HIRED = 'hired',            // Contratado
  REJECTED = 'rejected',      // Rechazado
}
```

### CandidatePriority
```typescript
enum CandidatePriority {
  LOW = 'low',              // 🟢 Verde
  MEDIUM = 'medium',        // 🟡 Amarillo
  HIGH = 'high',            // 🟠 Naranja
  CRITICAL = 'critical',    // 🔴 Rojo
}
```

### CandidateSource
```typescript
enum CandidateSource {
  LINKEDIN = 'linkedin',
  INDEED = 'indeed',
  REFERRAL = 'referral',
  WEBSITE = 'website',
  EMAIL = 'email',
  OTHER = 'other',
}
```

---

## 🌈 Color Scheme por Prioridad

```tsx
// Barra izquierda del card
const priorityBorderColor = {
  low: 'border-green-500',
  medium: 'border-yellow-500',
  high: 'border-orange-500',
  critical: 'border-red-500',
}

// Badge de prioridad
const priorityBadgeColor = {
  low: { bg: 'bg-green-50', text: 'text-green-700' },
  medium: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  high: { bg: 'bg-orange-50', text: 'text-orange-700' },
  critical: { bg: 'bg-red-50', text: 'text-red-700' },
}
```

---

## 🎬 Acciones del Menu

El card incluye un menú con 5 acciones integradas:

### 1. Ver Perfil
```tsx
onViewProfile={(candidateId) => {
  // Abre modal con información completa
  // - Datos personales
  // - Historial de entrevistas
  // - Notas y evaluaciones
  // - CV y documentos
})
```

### 2. Agendar Entrevista
```tsx
onScheduleInterview={(candidateId) => {
  // Abre modal para programar entrevista
  // - Seleccionar tipo (Phone/Video/In-person/Panel)
  // - Seleccionar entrevistadores
  // - Agregar notas
  // - Link de reunión (Zoom, Teams, etc.)
})
```

### 3. Descargar CV
- Descarga automática si `cvUrl` está definido
- Link en atributo `href` del elemento `<a>`

### 4. Rechazar Candidato
```tsx
onReject={(candidateId) => {
  // Abre modal de confirmación
  // - Mostrar advertencia
  // - Permitir agregar nota
  // - Confirmar y mover a "Rechazado"
})
```

### 5. Convertir en Empleado
```tsx
onHire={(candidateId) => {
  // Abre formulario para crear empleado
  // - Auto-completa con datos del candidato
  // - Permite ajustar información
  // - Crea empleado y mueve candidato a "Contratado"
})
```

---

## ♿ Accesibilidad

El componente es completamente accesible:

### Navegación con Teclado
```typescript
// Tab - Navega entre cards
// Space/Enter - Abre menú
// Delete - Abre confirmación de rechazo
// Escape - Cierra menú
// Arrow Up/Down - Navega opciones del menú
```

### ARIA Attributes
```typescript
// El card tiene tabIndex={0} para accesibilidad
// El menú tiene role="menu" con aria-label descriptivo
// Los botones tienen aria-label apropiados
```

### Semantic HTML
```typescript
// Usa <button> para todas las acciones
// Estructura correcta de elementos
// Labels descriptivos
```

---

## 🧪 Testing en Demo

Accede a `/recruitment/demo` para ver:

1. **Todos los estados visuales**
   - Normal, Hover, Focus, Dragging, Loading
   
2. **Todas las prioridades**
   - LOW (verde), MEDIUM (amarillo), HIGH (naranja), CRITICAL (rojo)

3. **Configuraciones variadas**
   - Con/sin avatar, tags, rating, CV
   - Con/sin datos opcionales

4. **Interacciones**
   - Prueba hover, focus, menu
   - Prueba drag & drop (en el Kanban)
   - Prueba navegación con teclado

---

## 📱 En el Kanban

El `CandidateCard` se usa dentro de `RecruitmentBoard`:

```tsx
import { RecruitmentBoard } from '@/components/recruitment'
import { useRecruitment } from '@/hooks/useRecruitment'

export function MyRecruitmentPage() {
  const {
    candidatesByStage,
    moveCandidate,
    rejectCandidate,
    hireCandidate,
    updateFilters,
  } = useRecruitment()

  return (
    <RecruitmentBoard
      candidatesByStage={candidatesByStage}
      onMoveCandidate={moveCandidate}
      onRejectCandidate={rejectCandidate}
      onHireCandidate={hireCandidate}
      onUpdateFilters={updateFilters}
    />
  )
}
```

El Kanban:
- Maneja el drag & drop nativo (HTML5)
- Llama a `onMoveCandidate` cuando se suelta en una columna
- Las acciones del menu abren modales (implementar según necesidad)

---

## 🎯 Casos de Uso Comunes

### Mostrar candidatos de una etapa específica
```tsx
const [candidates, setCandidates] = useState<Candidate[]>([])

useEffect(() => {
  // Cargar de API
  recruitmentService.getCandidates({ stage: 'interview' })
    .then(setCandidates)
}, [])

return (
  <div className="grid gap-4">
    {candidates.map(candidate => (
      <CandidateCard
        key={candidate.id}
        candidate={candidate}
        onViewProfile={handleViewProfile}
        // ... otros callbacks
      />
    ))}
  </div>
)
```

### Filtrar por prioridad
```tsx
const [priority, setPriority] = useState<CandidatePriority>('high')
const filtered = candidates.filter(c => c.priority === priority)

return (
  <>
    <select onChange={(e) => setPriority(e.target.value)}>
      <option value="low">Baja</option>
      <option value="medium">Media</option>
      <option value="high">Alta</option>
      <option value="critical">Crítica</option>
    </select>
    
    <div className="space-y-3">
      {filtered.map(candidate => (
        <CandidateCard key={candidate.id} candidate={candidate} {...} />
      ))}
    </div>
  </>
)
```

### Integración con formularios
```tsx
const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)

const handleHire = (candidateId: string) => {
  const candidate = candidates.find(c => c.id === candidateId)
  setSelectedCandidate(candidate)
  // Abre modal o formula para crear empleado
}

return (
  <>
    {/* Cards */}
    {candidates.map(c => (
      <CandidateCard
        key={c.id}
        candidate={c}
        onHire={handleHire}
        {...}
      />
    ))}
    
    {/* Modal o formulario */}
    {selectedCandidate && (
      <HireModal
        candidate={selectedCandidate}
        onConfirm={async (employeeData) => {
          await recruitmentService.hireCandidate(selectedCandidate.id, employeeData)
          setSelectedCandidate(null)
        }}
        onCancel={() => setSelectedCandidate(null)}
      />
    )}
  </>
)
```

---

## 🔧 Troubleshooting

### Card no se ve
- ✅ Verifica que `candidate` tenga `id`, `fullName`, `email`
- ✅ Revisa la estructura del tipo `Candidate`

### Menu no abre
- ✅ Asegúrate que los callbacks estén definidos
- ✅ Verifica que no haya overflow hidden en el contenedor

### Styles no aplican
- ✅ Revisa que Tailwind esté configurado
- ✅ Verifica que los colores de prioridad estén en `tailwind.config.ts`

### Drag & drop no funciona
- ✅ El drag funciona solo dentro del RecruitmentBoard
- ✅ Verifica que `isDragging` se pase correctamente

---

## 📚 Documentación Relacionada

- [CANDIDATE_CARD_GUIDE.md](./CANDIDATE_CARD_GUIDE.md) - Guía técnica completa
- [VISUAL_REFERENCE.md](./VISUAL_REFERENCE.md) - Referencia visual y de colores
- [SHOWCASE.tsx](./SHOWCASE.tsx) - Ejemplos de código
- [STATES_DEMO.tsx](./STATES_DEMO.tsx) - Página de demostración interactiva

---

**Versión**: 1.0  
**Última actualización**: Enero 2024
