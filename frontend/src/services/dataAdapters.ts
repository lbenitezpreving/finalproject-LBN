import { Task, TaskStatus, TaskStage, Team, Department, User } from '../types';

/**
 * Adaptador para convertir datos del backend al formato esperado por el frontend
 */

// Mapeo de estados de Redmine a nuestros estados
const STATUS_MAPPING: Record<string, TaskStatus> = {
  'New': TaskStatus.PENDING,
  'In Progress': TaskStatus.IN_PROGRESS,
  'Closed': TaskStatus.COMPLETED,
  'Resolved': TaskStatus.COMPLETED,
  'Feedback': TaskStatus.IN_PROGRESS,
  'Rejected': TaskStatus.PENDING,
};

// Mapeo de etapas del backend a nuestras etapas
const STAGE_MAPPING: Record<string, TaskStage> = {
  'sin_planificar': TaskStage.BACKLOG,
  'planificada': TaskStage.PLANNED,
  'en_curso': TaskStage.IN_PROGRESS,
  'finalizada': TaskStage.COMPLETED,
};

/**
 * Convierte una tarea del backend al formato del frontend
 */
export const adaptBackendTask = (backendTask: any): Task & { stage: TaskStage } => {
  // Determinar el status basado en el estado de Redmine
  let status = TaskStatus.PENDING;
  if (backendTask.status?.name) {
    status = STATUS_MAPPING[backendTask.status.name] || TaskStatus.PENDING;
  }

  // Determinar el stage basado en la etapa del backend
  let stage = TaskStage.BACKLOG;
  if (backendTask.etapa) {
    stage = STAGE_MAPPING[backendTask.etapa] || TaskStage.BACKLOG;
  }

  // Si no tiene etapa del backend, calcularlo basado en los datos
  if (!backendTask.etapa) {
    if (status === TaskStatus.COMPLETED) {
      stage = TaskStage.COMPLETED;
    } else if (status === TaskStatus.IN_PROGRESS) {
      stage = TaskStage.IN_PROGRESS;
    } else if (backendTask.equipo_asignado && backendTask.fecha_inicio_planificada && backendTask.fecha_fin_planificada) {
      stage = TaskStage.PLANNED;
    } else if (backendTask.tiene_responsable && backendTask.tiene_funcional && backendTask.estimacion_sprints) {
      stage = TaskStage.PENDING_PLANNING;
    } else {
      stage = TaskStage.BACKLOG;
    }
  }

  return {
    id: backendTask.id,
    subject: backendTask.subject || '',
    description: backendTask.description || '',
    status,
    priority: backendTask.priority?.id || 1,
    assignedTo: backendTask.assigned_to?.id,
    functional: backendTask.funcional,
    department: getDepartmentIdFromName(backendTask.departamento),
    createdAt: new Date(backendTask.created_on || Date.now()),
    updatedAt: new Date(backendTask.updated_on || Date.now()),
    sprints: backendTask.estimacion_sprints,
    loadFactor: backendTask.factor_carga,
    team: backendTask.equipo_asignado?.id,
    startDate: backendTask.fecha_inicio_planificada ? new Date(backendTask.fecha_inicio_planificada) : undefined,
    endDate: backendTask.fecha_fin_planificada ? new Date(backendTask.fecha_fin_planificada) : undefined,
    priorityOrder: backendTask.orden_prioridad,
    stage
  };
};

/**
 * Convierte la respuesta de tareas del backend al formato del frontend
 */
export const adaptBackendTasksResponse = (backendResponse: any) => {
  if (!backendResponse.success || !backendResponse.data) {
    throw new Error('Respuesta inválida del servidor');
  }

  const backendData = backendResponse.data;
  
  // La estructura del backend puede ser { tasks: [], total: number, ... }
  const tasks = backendData.tasks || backendData;
  const totalCount = backendData.total_count || backendData.totalCount || tasks.length;
  const offset = backendData.offset || 0;
  const limit = backendData.limit || tasks.length;
  
  return {
    data: tasks.map(adaptBackendTask),
    pagination: {
      currentPage: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / limit)
    }
  };
};

/**
 * Convierte un usuario del backend al formato del frontend
 */
export const adaptBackendUser = (backendUser: any): User => {
  return {
    id: backendUser.id,
    username: backendUser.login || backendUser.username || '',
    name: `${backendUser.firstname || ''} ${backendUser.lastname || ''}`.trim() || backendUser.name || '',
    email: backendUser.mail || backendUser.email || '',
    role: backendUser.role || 'NEGOCIO', // Por defecto, se puede mapear según la lógica de negocio
    department: backendUser.department_id
  };
};

/**
 * Convierte la respuesta de usuarios del backend al formato del frontend
 */
export const adaptBackendUsersResponse = (backendResponse: any) => {
  if (!backendResponse.success || !backendResponse.data) {
    throw new Error('Respuesta inválida del servidor');
  }

  const users = backendResponse.data.users || backendResponse.data;
  return users.map(adaptBackendUser);
};

/**
 * Convierte estadísticas del backend al formato del frontend
 */
export const adaptBackendStats = (backendResponse: any) => {
  if (!backendResponse.success || !backendResponse.data) {
    throw new Error('Respuesta inválida del servidor');
  }

  const stats = backendResponse.data;
  
  return {
    total: stats.total_tareas || 0,
    byStage: {
      [TaskStage.BACKLOG]: stats.por_etapa?.sin_planificar || 0,
      [TaskStage.PENDING_PLANNING]: stats.problematicas?.pendientes_planificar || 0,
      [TaskStage.PLANNED]: stats.por_etapa?.planificada || 0,
      [TaskStage.IN_PROGRESS]: stats.por_etapa?.en_curso || 0,
      [TaskStage.COMPLETED]: stats.por_etapa?.finalizada || 0,
    },
    byStatus: stats.por_estado || {},
    byPriority: stats.por_prioridad || {},
  };
};

/**
 * Mapeo básico de nombres de departamento a IDs
 * En una implementación real, esto vendría de una API de departamentos
 */
const DEPARTMENT_MAPPING: Record<string, number> = {
  'Tecnología': 1,
  'Marketing': 2,
  'Ventas': 3,
  'Recursos Humanos': 4,
  'Finanzas': 5,
  'Operaciones': 6,
  'Atención al Cliente': 7,
  'Producto': 8,
};

const getDepartmentIdFromName = (departmentName?: string): number => {
  if (!departmentName) return 1; // Default a Tecnología
  return DEPARTMENT_MAPPING[departmentName] || 1;
};

/**
 * Convierte filtros del frontend al formato del backend
 */
export const adaptFiltersToBackend = (frontendFilters: any) => {
  const backendFilters: any = {};

  // Mapear filtros comunes
  if (frontendFilters.department) {
    const deptName = Object.keys(DEPARTMENT_MAPPING).find(name => 
      DEPARTMENT_MAPPING[name] === frontendFilters.department
    );
    if (deptName) {
      backendFilters.departamento = deptName;
    }
  }

  if (frontendFilters.status) {
    // Mapear nuestros estados a estados de Redmine
    const redmineStatus = Object.entries(STATUS_MAPPING).find(([redmineState, ourState]) => 
      ourState === frontendFilters.status
    );
    if (redmineStatus) {
      backendFilters.status_id = redmineStatus[0];
    }
  }

  if (frontendFilters.stage) {
    // Mapear nuestras etapas a etapas del backend
    const backendStage = Object.entries(STAGE_MAPPING).find(([backendSt, ourStage]) => 
      ourStage === frontendFilters.stage
    );
    if (backendStage) {
      backendFilters.etapa = backendStage[0];
    }
  }

  if (frontendFilters.assignedTo) {
    backendFilters.assigned_to_id = frontendFilters.assignedTo;
  }

  if (frontendFilters.team) {
    backendFilters.equipo_id = frontendFilters.team;
  }

  if (frontendFilters.priority) {
    backendFilters.priority_id = frontendFilters.priority;
  }

  if (frontendFilters.startDate) {
    backendFilters.fecha_inicio_desde = frontendFilters.startDate.toISOString().split('T')[0];
  }

  if (frontendFilters.endDate) {
    backendFilters.fecha_fin_hasta = frontendFilters.endDate.toISOString().split('T')[0];
  }

  return backendFilters;
}; 