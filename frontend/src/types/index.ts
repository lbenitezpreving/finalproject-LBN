// Tipos de usuario
export enum UserRole {
  NEGOCIO = 'negocio',
  TECNOLOGIA = 'tecnologia',
  ADMIN = 'admin'
}

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  department?: number; // ID del departamento (solo para usuarios de negocio)
}

// Tipos para tareas
export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export interface Task {
  id: number;
  subject: string;
  description: string;
  status: TaskStatus;
  priority: number;
  assignedTo?: number; // ID del usuario responsable
  functional?: string; // Documento funcional
  department: number; // ID del departamento
  createdAt: Date;
  updatedAt: Date;
  // Campos extendidos que no están en Redmine
  sprints?: number; // Estimación en sprints
  loadFactor?: number; // Factor de carga (1-5)
  team?: number; // ID del equipo asignado
  startDate?: Date; // Fecha de inicio planificada
  endDate?: Date; // Fecha de fin planificada
  priorityOrder?: number; // Orden de prioridad en el backlog
}

// Tipos para equipos
export interface Team {
  id: number;
  name: string;
  capacity: number; // Capacidad total del equipo
  currentLoad: number; // Carga actual del equipo
  isExternal: boolean; // Si es un equipo externo o interno
}

// Tipos para departamentos
export interface Department {
  id: number;
  name: string;
}

// Matriz de afinidad
export interface AffinityMatrix {
  id: number;
  teamId: number;
  departmentId: number;
  affinityLevel: number; // Nivel de afinidad (1-5)
}

// Tipo para recomendaciones
export interface TeamRecommendation {
  teamId: number;
  teamName: string;
  affinity: number;
  currentLoad: number;
  availableCapacity: number;
  possibleStartDate: Date;
  possibleEndDate: Date;
  score: number; // Puntuación global de la recomendación
}

// Tipos para alertas
export enum AlertType {
  APPROACHING_DEADLINE = 'approaching_deadline',
  OVERDUE_TASK = 'overdue_task',
  UNASSIGNED_TASK = 'unassigned_task',
  HIGH_LOAD = 'high_load'
}

export interface Alert {
  id: number;
  type: AlertType;
  taskId?: number;
  teamId?: number;
  message: string;
  createdAt: Date;
  isRead: boolean;
} 