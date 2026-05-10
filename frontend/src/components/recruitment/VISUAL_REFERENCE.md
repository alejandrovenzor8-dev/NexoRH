# CandidateCard - Referencia Visual Completa

## 🎨 Componentes Visuales

Este documento proporciona una referencia visual completa del componente `CandidateCard` y todos sus estados.

### 📍 Cómo ver la demostración

**Para ver todos los estados en acción:**

1. Inicia sesión en la aplicación
2. Dirígete al menú lateral izquierdo
3. Haz clic en **"Reclutamiento"** bajo el menú principal
4. En la barra de navegación superior, encontrarás un enlace a **"Demo - Estados del Card"**
5. La página `/recruitment/demo` muestra todos los estados visuales

---

## 🎯 Estados Principales

### 1. **Estado Normal** (Default)
- Card en su estado base sin interacciones
- Muestra toda la información disponible del candidato
- Disponible para interacción con mouse o teclado
- Sombra sutil `shadow-sm`

**Elementos visibles:**
- Avatar con inicial o imagen
- Nombre completo (font-semibold)
- Email
- Posición/Vacante
- Seniority badge
- Fecha de aplicación (formato relativo: "2 días")
- Tags de habilidades (máx 3, +N restantes)
- Rating (estrellas 1-5)
- Score (/10)
- Priority badge (color según prioridad)
- Menú de 3 puntos

### 2. **Estado Hover**
- Elevación visual: `shadow-lg`
- Escala ligeramente aumentada: `scale-105`
- Grip indicator aparece (handle para drag)
- Transición suave: `duration-200`
- Cursor cambia a `grab`

**Comportamiento:**
```
Normal State → Hover State
shadow-sm → shadow-lg
scale-100 → scale-105
opacity-0 grip → opacity-100 grip
```

### 3. **Estado Focus** (Teclado)
- Ring azul visible: `ring-2 ring-blue-500`
- Outline cuando está en focus: `outline-2 outline-blue-500`
- Accesible via Tab
- Permite abrir menú con Space/Enter

**Técnica:**
```css
focus-visible:ring-2 focus-visible:ring-blue-500
focus-visible:outline-2 focus-visible:outline-blue-500
```

### 4. **Estado Dragging**
- Opacidad reducida: `opacity-40`
- Escala reducida: `scale-95`
- Pointer events deshabilitados
- Visual feedback de "siendo arrastrado"

**Props:**
```typescript
isDragging={true}
```

### 5. **Estado Loading**
- Opacidad reducida: `opacity-50`
- Interacciones deshabilitadas
- Indica carga de datos o procesamiento

**Props:**
```typescript
isDragging={true} // Usa isDragging para mostrar loading
```

---

## 🎨 Color Mapping por Prioridad

### Barra Izquierda (border-left-4)

| Prioridad | Color | Hex | CSS Class |
|-----------|-------|-----|-----------|
| **LOW** | Verde | `#10b981` | `border-green-500` |
| **MEDIUM** | Amarillo | `#f59e0b` | `border-yellow-500` |
| **HIGH** | Naranja | `#f97316` | `border-orange-500` |
| **CRITICAL** | Rojo | `#ef4444` | `border-red-500` |

### Badge de Prioridad

| Prioridad | Fondo | Texto |
|-----------|-------|-------|
| **LOW** | `bg-green-50` | `text-green-700` |
| **MEDIUM** | `bg-yellow-50` | `text-yellow-700` |
| **HIGH** | `bg-orange-50` | `text-orange-700` |
| **CRITICAL** | `bg-red-50` | `text-red-700` |

---

## ⌨️ Navegación por Teclado

### Tab
- Navega entre cards
- Focus ring azul indica elemento activo

### Space / Enter
- Abre el menú de acciones
- En menú: activa la opción seleccionada

### Delete
- Abre modal de confirmación para rechazar candidato

### Escape
- Cierra el menú de acciones abierto
- Regresa al estado normal

### Arrow Keys (en menú)
- **Up/Down**: Navega entre opciones del menú
- **Left**: Cierra menú
- **Right**: Abre menú

---

## 🎬 Menu Contextual (3 puntos)

El menú tiene 5 acciones principales:

1. **👁️ Ver perfil**
   - Abre modal con información completa del candidato
   - Incluye historial de entrevistas, notas, CV

2. **📅 Agendar entrevista**
   - Abre modal para programar entrevista
   - Seleccionar tipo: Phone/Video/In-person/Panel
   - Seleccionar entrevistadores
   - Agregar notas opcionales

3. **📥 Descargar CV**
   - Link directo a CV del candidato
   - Descarga el archivo PDF/DOC

4. **❌ Rechazar**
   - Abre modal de confirmación
   - Mueve candidato a estado "Rechazado"
   - Opción de agregar nota de rechazo

5. **✅ Convertir en empleado**
   - Abre formulario para crear empleado
   - Auto-completa campos con datos del candidato
   - Mueve candidato a estado "Contratado"

---

## 📱 Spacing & Sizing

### Dimensiones del Card
- **Ancho**: 100% (responsive)
- **Alto**: Auto (contenido variable)
- **Padding**: `p-4` (1rem)
- **Gap entre elementos**: `gap-3` (0.75rem)

### Espaciado Interno
```
┌─────────────────────────┐
│  Padding: 1rem         │
│  ┌───────────────────┐  │
│  │ Avatar  Nombre    │  │
│  │ Email             │  │
│  │ Vacante / Seniority  │
│  │ Fecha  |  Tags    │  │
│  │ Rating  Score     │  │
│  │ [Priority] [Menu] │  │
│  └───────────────────┘  │
│  Padding: 1rem         │
└─────────────────────────┘
```

---

## 🌊 Animaciones

### Hover Elevation
```typescript
transition-all duration-200
hover:shadow-lg hover:scale-105
```

### Focus Ring
```typescript
focus-visible:ring-2 focus-visible:ring-blue-500
transition-ring duration-200
```

### Menu Animation
```typescript
// Aparición suave del menú
opacity-0 scale-95 → opacity-100 scale-100
duration-150
```

---

## ♿ Accesibilidad

### ARIA Attributes
```typescript
role="menuitem" // Para items del menú
aria-label="Acciones para {candidato}"
aria-expanded={menuOpen}
tabIndex={0} // Card accesible con Tab
```

### Semantic HTML
- Usa `<button>` para todas las acciones
- Estructura semántica de encabezados
- Labels descriptivos para campos

### Color No es Única Indicadora
- Priority mostrada como texto + color
- Estados indicados por icon + texto
- Rating mostrado como número + estrellas

---

## 🎯 Props Interface

```typescript
interface CandidateCardProps {
  // Datos del candidato
  candidate: Candidate
  
  // Callbacks de acciones
  onViewProfile: (candidateId: string) => void
  onChangeStage: (candidateId: string, newStage: CandidateStage) => void
  onScheduleInterview: (candidateId: string) => void
  onReject: (candidateId: string) => void
  onHire: (candidateId: string) => void
  
  // Estados opcionales
  isDragging?: boolean
}

interface Candidate {
  id: string
  fullName: string
  email: string
  phone?: string
  avatar?: string
  position: string
  source: CandidateSource
  stage: CandidateStage
  priority: CandidatePriority
  score?: number // 0-10
  rating?: number // 1-5 stars
  tags?: string[] // Skills
  appliedAt: string // ISO date
  updatedAt: string // ISO date
  recruiter?: string
  notes?: string
  cvUrl?: string
  linkedinUrl?: string
  seniority?: string
}
```

---

## 📊 Ejemplo de Renderizado

```tsx
<CandidateCard
  candidate={{
    id: '1',
    fullName: 'Alexandra Thompson',
    email: 'alexandra@example.com',
    avatar: 'https://...',
    position: 'Senior Engineer',
    source: 'linkedin',
    stage: CandidateStage.INTERVIEW,
    priority: CandidatePriority.CRITICAL,
    score: 9.5,
    rating: 5,
    tags: ['React', 'TypeScript', 'Node.js'],
    appliedAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    recruiter: 'María',
    cvUrl: 'https://example.com/cv.pdf',
  }}
  isDragging={false}
  onViewProfile={() => console.log('Ver perfil')}
  onChangeStage={() => console.log('Cambiar etapa')}
  onScheduleInterview={() => console.log('Agendar')}
  onReject={() => console.log('Rechazar')}
  onHire={() => console.log('Contratar')}
/>
```

---

## 🔍 Inspección de Estilos

### Classes Aplicadas

**Normal State:**
```css
.candidate-card {
  @apply bg-white border-2 border-gray-200 rounded-lg 
         shadow-sm hover:shadow-lg hover:scale-105
         transition-all duration-200 cursor-grab
         border-l-4 border-l-{priority-color}
}
```

**Hover State:**
```css
.candidate-card:hover {
  @apply shadow-lg scale-105
}

.candidate-card:hover .grip-icon {
  @apply opacity-100
}
```

**Focus State:**
```css
.candidate-card:focus-visible {
  @apply outline-2 outline-blue-500
         ring-2 ring-blue-500/20
}
```

---

## 🧪 Testing el Componente

### Escenarios a Probar

1. **Render Básico**
   - Card aparece con todos los datos
   - Avatar se muestra correctamente
   - Colores de prioridad son correctos

2. **Interacciones Mouse**
   - Hover muestra grip icon
   - Hover eleva el card
   - Click en menu abre opciones

3. **Interacciones Teclado**
   - Tab navega entre cards
   - Space abre menu
   - Escape cierra menu
   - Enter activa opciones

4. **Responsive**
   - En mobile, menu es accesible
   - Layout se adapta a pantalla
   - Texto no se trunca inapropiadamente

5. **Estados Especiales**
   - isDragging={true} reduce opacidad
   - Sin avatar muestra gradient
   - Sin tags no muestra sección
   - Sin score no muestra número

---

## 📚 Documentación Relacionada

- [CANDIDATE_CARD_GUIDE.md](./CANDIDATE_CARD_GUIDE.md) - Guía técnica completa
- [SHOWCASE.tsx](./SHOWCASE.tsx) - Componente con ejemplos
- [STATES_DEMO.tsx](./STATES_DEMO.tsx) - Página interactiva de demostración
- [CandidateCard.tsx](./CandidateCard.tsx) - Código fuente del componente

---

**Última actualización**: Enero 2024
**Version**: 1.0
