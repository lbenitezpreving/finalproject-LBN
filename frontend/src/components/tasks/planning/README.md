# US-06: Asignación de Equipo y Planificación de Tarea

Esta carpeta contiene la implementación frontend de la US-06: Asignación de equipo y planificación de tarea.

## Componentes Implementados

### 1. TaskPlanningPage
- **Ubicación**: `TaskPlanningPage.tsx`
- **Descripción**: Página principal para la planificación de tareas
- **Funcionalidades**:
  - Carga de información de la tarea
  - Obtención de recomendaciones de equipos
  - Navegación entre pasos de recomendación y planificación
  - Gestión de conflictos y validaciones
  - Guardado de planificación

### 2. TeamRecommendationsList
- **Ubicación**: `TeamRecommendationsList.tsx`
- **Descripción**: Lista de equipos recomendados con métricas
- **Funcionalidades**:
  - Visualización de equipos ordenados por puntuación
  - Métricas de afinidad, capacidad y disponibilidad
  - Fechas posibles de inicio y fin
  - Justificación de recomendaciones
  - Selección de equipo

### 3. PlanningForm
- **Ubicación**: `PlanningForm.tsx`
- **Descripción**: Formulario para asignar fechas y confirmar planificación
- **Funcionalidades**:
  - Selector de fechas con validaciones
  - Verificación de conflictos en tiempo real
  - Resumen de planificación
  - Confirmación y guardado

## Servicios Añadidos

### TaskService (Extensiones)
- `getTeamRecommendations(taskId)`: Obtiene recomendaciones de equipos
- `assignTeamAndDates(taskId, teamId, startDate, endDate)`: Asigna equipo y fechas
- `checkTeamConflicts(teamId, startDate, endDate)`: Verifica conflictos

### Datos Mock
- **AffinityMatrix**: Matriz de afinidad entre equipos y departamentos
- **Algoritmo de Recomendación**: Sistema de puntuación basado en múltiples factores

## Algoritmo de Recomendación

El sistema evalúa cada equipo basándose en:

### Factores de Puntuación (100 puntos máximo)
1. **Afinidad departamental (40%)**: Nivel de afinidad del equipo con el departamento
2. **Disponibilidad (35%)**: Capacidad disponible del equipo
3. **Tiempo de inicio (15%)**: Qué tan pronto puede empezar
4. **Tipo de equipo (10%)**: Bonus por equipos internos

### Métricas Mostradas
- **Puntuación total**: Combinación ponderada de todos los factores
- **Afinidad**: Nivel 1-5 con visualización en estrellas
- **Capacidad**: Barra de progreso con utilización actual
- **Fechas**: Inicio y fin posibles calculadas dinámicamente

## Flujo de Usuario

1. **Acceso**: Botón "Planificar" en tareas con estimación en estado PENDING_PLANNING
2. **Recomendaciones**: Ver lista ordenada de equipos recomendados
3. **Selección**: Elegir equipo y proceder a planificación
4. **Fechas**: Asignar fechas de inicio y fin con validaciones
5. **Confirmación**: Revisar resumen y confirmar planificación
6. **Resultado**: Tarea cambia a estado PLANNED

## Validaciones Implementadas

### Permisos
- Solo usuarios con rol TECNOLOGIA pueden planificar
- Solo tareas en estado PENDING_PLANNING son planificables
- Tareas deben tener estimación (sprints y loadFactor)

### Fechas
- Fecha inicio no puede ser anterior a hoy
- Fecha fin debe ser posterior a fecha inicio
- Duración mínima de 1 día

### Conflictos (Informativos)
- Solapamiento con otras tareas del equipo
- Sobrecarga de capacidad del equipo
- Advertencias no bloquean la asignación

## Estilos CSS

Los estilos están definidos en `TaskPlanningPage.css` e incluyen:
- Diseño responsive
- Animaciones de hover
- Códigos de color para diferentes estados
- Barras de progreso para capacidad
- Estilos para alertas y conflictos

## Integración

### Rutas
- `/tasks/:taskId/plan` - Página de planificación

### Estado Global
- Integrado con AuthContext para permisos
- Usa React Router para navegación

### APIs Mock
- Todas las funciones simulan delay de red
- Validaciones completas del lado cliente
- Datos de ejemplo realistas

## Próximos Pasos

Esta implementación cumple con todos los criterios de aceptación de la US-06. Las extensiones futuras podrían incluir:

1. Integración con backend real
2. Notificaciones en tiempo real
3. Calendario visual para selección de fechas
4. Historial de cambios en planificación
5. Métricas avanzadas de recomendación 