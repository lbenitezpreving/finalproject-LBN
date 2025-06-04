import { 
  Task, 
  TaskFilters, 
  PaginatedResponse, 
  SearchParams, 
  SortConfig, 
  TaskStage,
  UserRole,
  TeamRecommendation
} from '../types';
import { mockTasks, getTasksWithStage, getTaskStage } from './mockData/tasks';
import { mockTeams, getTeamById } from './mockData/teams';
import { getAffinityByTeamAndDepartment } from './mockData/affinityMatrix';
import { getCurrentProjectsByTeam, getProjectConflicts } from './mockData/currentProjects';

// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class TaskService {
  
  /**
   * Obtener tareas con filtros, paginación y búsqueda
   */
  static async getTasks(
    filters?: TaskFilters,
    pagination?: { page: number; pageSize: number },
    search?: SearchParams,
    sort?: SortConfig,
    userRole?: UserRole,
    userDepartment?: number
  ): Promise<PaginatedResponse<Task & { stage: TaskStage }>> {
    await delay(300); // Simular latencia de red
    
    let filteredTasks = getTasksWithStage();
    
    // Filtrar por rol de usuario (negocio solo ve su departamento)
    if (userRole === UserRole.NEGOCIO && userDepartment) {
      filteredTasks = filteredTasks.filter(task => task.department === userDepartment);
    }
    
    // Aplicar filtros
    if (filters) {
      filteredTasks = this.applyFilters(filteredTasks, filters);
    }
    
    // Aplicar búsqueda
    if (search && search.query.trim()) {
      filteredTasks = this.applySearch(filteredTasks, search);
    }
    
    // Aplicar ordenamiento
    if (sort) {
      filteredTasks = this.applySort(filteredTasks, sort);
    }
    
    // Aplicar paginación
    const page = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);
    
    return {
      data: paginatedTasks,
      pagination: {
        currentPage: page,
        pageSize,
        totalItems: filteredTasks.length,
        totalPages: Math.ceil(filteredTasks.length / pageSize)
      }
    };
  }
  
  /**
   * Obtener una tarea por ID
   */
  static async getTaskById(id: number): Promise<Task | null> {
    await delay(200);
    const task = mockTasks.find(t => t.id === id);
    return task || null;
  }
  
  /**
   * Obtener tareas pendientes de planificar
   */
  static async getPendingPlanningTasks(
    userRole?: UserRole,
    userDepartment?: number
  ): Promise<(Task & { stage: TaskStage })[]> {
    await delay(250);
    
    let tasks = getTasksWithStage().filter(task => 
      task.stage === TaskStage.PENDING_PLANNING
    );
    
    // Filtrar por departamento si es usuario de negocio
    if (userRole === UserRole.NEGOCIO && userDepartment) {
      tasks = tasks.filter(task => task.department === userDepartment);
    }
    
    return tasks.sort((a, b) => (a.priorityOrder || 999) - (b.priorityOrder || 999));
  }
  
  /**
   * Obtener estadísticas de tareas
   */
  static async getTaskStats(
    userRole?: UserRole,
    userDepartment?: number
  ): Promise<{
    total: number;
    byStage: Record<TaskStage, number>;
    byStatus: Record<string, number>;
    byPriority: Record<number, number>;
  }> {
    await delay(200);
    
    let tasks = getTasksWithStage();
    
    // Filtrar por departamento si es usuario de negocio
    if (userRole === UserRole.NEGOCIO && userDepartment) {
      tasks = tasks.filter(task => task.department === userDepartment);
    }
    
    const stats = {
      total: tasks.length,
      byStage: {} as Record<TaskStage, number>,
      byStatus: {} as Record<string, number>,
      byPriority: {} as Record<number, number>
    };
    
    // Inicializar contadores
    Object.values(TaskStage).forEach(stage => {
      stats.byStage[stage] = 0;
    });
    
    // Contar por categorías
    tasks.forEach(task => {
      stats.byStage[task.stage]++;
      stats.byStatus[task.status] = (stats.byStatus[task.status] || 0) + 1;
      stats.byPriority[task.priority] = (stats.byPriority[task.priority] || 0) + 1;
    });
    
    return stats;
  }
  
  /**
   * Aplicar filtros a las tareas
   */
  private static applyFilters(
    tasks: (Task & { stage: TaskStage })[], 
    filters: TaskFilters
  ): (Task & { stage: TaskStage })[] {
    return tasks.filter(task => {
      if (filters.department && task.department !== filters.department) return false;
      if (filters.status && task.status !== filters.status) return false;
      if (filters.assignedTo && task.assignedTo !== filters.assignedTo) return false;
      if (filters.team && task.team !== filters.team) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.stage && task.stage !== filters.stage) return false;
      
      // Filtros booleanos
      if (filters.hasResponsible !== undefined) {
        const hasResponsible = !!task.assignedTo;
        if (filters.hasResponsible !== hasResponsible) return false;
      }
      
      if (filters.hasFunctional !== undefined) {
        const hasFunctional = !!task.functional;
        if (filters.hasFunctional !== hasFunctional) return false;
      }
      
      if (filters.hasEstimation !== undefined) {
        const hasEstimation = !!task.sprints;
        if (filters.hasEstimation !== hasEstimation) return false;
      }
      
      // Filtros de fecha
      if (filters.startDate && task.startDate && task.startDate < filters.startDate) return false;
      if (filters.endDate && task.endDate && task.endDate > filters.endDate) return false;
      
      return true;
    });
  }
  
  /**
   * Aplicar búsqueda por texto
   */
  private static applySearch(
    tasks: (Task & { stage: TaskStage })[], 
    search: SearchParams
  ): (Task & { stage: TaskStage })[] {
    const query = search.query.toLowerCase();
    
    return tasks.filter(task => {
      // Buscar en campos especificados o en todos por defecto
      const fieldsToSearch = search.fields.length > 0 ? search.fields : ['subject', 'description'];
      
      return fieldsToSearch.some(field => {
        const value = (task as any)[field];
        return value && value.toString().toLowerCase().includes(query);
      });
    });
  }
  
  /**
   * Aplicar ordenamiento
   */
  private static applySort(
    tasks: (Task & { stage: TaskStage })[], 
    sort: SortConfig
  ): (Task & { stage: TaskStage })[] {
    return [...tasks].sort((a, b) => {
      const aValue = (a as any)[sort.field];
      const bValue = (b as any)[sort.field];
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }
  
  /**
   * Exportar tareas (simulado)
   */
  static async exportTasks(
    format: 'excel' | 'csv',
    filters?: TaskFilters,
    userRole?: UserRole,
    userDepartment?: number
  ): Promise<{ url: string; filename: string }> {
    await delay(1000); // Simular procesamiento
    
    // En una implementación real, aquí se generaría el archivo
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `tareas_${timestamp}.${format}`;
    
    return {
      url: `#download-${filename}`, // URL simulada
      filename
    };
  }
  
  /**
   * Actualizar estimación de una tarea
   */
  static async updateTaskEstimation(
    taskId: number,
    sprints: number,
    loadFactor: number
  ): Promise<Task & { stage: TaskStage }> {
    await delay(500); // Simular delay de red
    
    const taskIndex = mockTasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error(`Tarea con ID ${taskId} no encontrada`);
    }
    
    const task = mockTasks[taskIndex];
    
    // Verificar que la tarea esté en estado correcto para estimación
    const currentStage = getTaskStage(task);
    if (currentStage !== TaskStage.PENDING_PLANNING) {
      throw new Error(`No se puede estimar la tarea en estado: ${currentStage}`);
    }
    
    // Validar datos de entrada
    if (!sprints || sprints <= 0) {
      throw new Error('La estimación en sprints debe ser mayor a 0');
    }
    
    if (!loadFactor || loadFactor <= 0) {
      throw new Error('El factor de carga debe ser mayor a 0');
    }
    
    // Actualizar la tarea
    mockTasks[taskIndex] = {
      ...task,
      sprints,
      loadFactor,
      updatedAt: new Date()
    };
    
    // Retornar la tarea actualizada con su stage
    const updatedTask = mockTasks[taskIndex];
    return {
      ...updatedTask,
      stage: getTaskStage(updatedTask)
    };
  }

  /**
   * Obtener recomendaciones de equipos para una tarea
   */
  static async getTeamRecommendations(taskId: number): Promise<TeamRecommendation[]> {
    await delay(800); // Simular algoritmo complejo
    
    const task = mockTasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`Tarea con ID ${taskId} no encontrada`);
    }

    // Verificar que la tarea esté en estado correcto
    const currentStage = getTaskStage(task);
    if (currentStage !== TaskStage.PENDING_PLANNING) {
      throw new Error(`No se pueden obtener recomendaciones para tarea en estado: ${currentStage}`);
    }

    if (!task.sprints || !task.loadFactor) {
      throw new Error('La tarea debe tener estimación para obtener recomendaciones');
    }

    // Obtener tareas planificadas para calcular cargas
    const plannedTasks = getTasksWithStage().filter(t => 
      t.stage === TaskStage.PLANNED || t.stage === TaskStage.IN_PROGRESS
    );

    const recommendations: TeamRecommendation[] = [];

    // Evaluar cada equipo
    for (const team of mockTeams) {
      // Calcular fechas posibles
      const { possibleStartDate, possibleEndDate } = this.calculatePossibleDates(
        team.id, 
        task.sprints, 
        task.loadFactor, 
        plannedTasks
      );

      // Obtener afinidad con el departamento
      const affinity = getAffinityByTeamAndDepartment(team.id, task.department);

      // Calcular capacidad disponible
      const availableCapacity = Math.max(0, team.capacity - team.currentLoad);

      // Obtener proyectos actuales del equipo
      const currentProjects = getCurrentProjectsByTeam(team.id);

      // Calcular puntuación
      const score = this.calculateRecommendationScore(
        affinity,
        availableCapacity,
        team.capacity,
        possibleStartDate,
        team.isExternal
      );

      recommendations.push({
        teamId: team.id,
        teamName: team.name,
        affinity,
        currentLoad: team.currentLoad,
        availableCapacity,
        possibleStartDate,
        possibleEndDate,
        score,
        currentProjects
      });
    }

    // Ordenar por puntuación (mayor a menor)
    return recommendations.sort((a, b) => b.score - a.score);
  }

  /**
   * Asignar equipo y fechas a una tarea
   */
  static async assignTeamAndDates(
    taskId: number,
    teamId: number,
    startDate: Date,
    endDate: Date
  ): Promise<Task & { stage: TaskStage }> {
    await delay(600); // Simular procesamiento
    
    const taskIndex = mockTasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error(`Tarea con ID ${taskId} no encontrada`);
    }

    const task = mockTasks[taskIndex];
    
    // Verificar que la tarea esté en estado correcto
    const currentStage = getTaskStage(task);
    if (currentStage !== TaskStage.PENDING_PLANNING) {
      throw new Error(`No se puede planificar la tarea en estado: ${currentStage}`);
    }

    // Verificar que el equipo existe
    const team = getTeamById(teamId);
    if (!team) {
      throw new Error(`Equipo con ID ${teamId} no encontrado`);
    }

    // Validar fechas
    if (endDate <= startDate) {
      throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
    }

    // Actualizar la tarea
    mockTasks[taskIndex] = {
      ...task,
      team: teamId,
      startDate,
      endDate,
      updatedAt: new Date()
    };
    
    // Retornar la tarea actualizada con su nuevo stage
    const updatedTask = mockTasks[taskIndex];
    return {
      ...updatedTask,
      stage: getTaskStage(updatedTask)
    };
  }

  /**
   * Verificar conflictos de planificación para un equipo
   */
  static async checkTeamConflicts(
    teamId: number,
    startDate: Date,
    endDate: Date,
    excludeTaskId?: number
  ): Promise<{ hasConflicts: boolean; conflicts: string[]; warnings: string[] }> {
    await delay(300);

    const team = getTeamById(teamId);
    if (!team) {
      throw new Error(`Equipo con ID ${teamId} no encontrado`);
    }

    const conflicts: string[] = [];
    const warnings: string[] = [];

    // Verificar conflictos con proyectos actuales usando la nueva lógica
    const { conflictingProjects, overlapDetails } = getProjectConflicts(teamId, startDate, endDate);
    
    if (conflictingProjects.length > 0) {
      warnings.push(...overlapDetails);
    }

    // Obtener tareas planificadas del equipo (mantenemos la lógica existente para tareas del sistema)
    const teamTasks = getTasksWithStage().filter(t => 
      t.team === teamId && 
      (t.stage === TaskStage.PLANNED || t.stage === TaskStage.IN_PROGRESS) &&
      t.id !== excludeTaskId
    );

    // Verificar solapamientos con tareas del sistema TaskDistributor
    for (const existingTask of teamTasks) {
      if (existingTask.startDate && existingTask.endDate) {
        const taskStart = new Date(existingTask.startDate);
        const taskEnd = new Date(existingTask.endDate);

        // Verificar solapamiento
        if (
          (startDate >= taskStart && startDate <= taskEnd) ||
          (endDate >= taskStart && endDate <= taskEnd) ||
          (startDate <= taskStart && endDate >= taskEnd)
        ) {
          warnings.push(
            `Solapamiento con tarea TaskDistributor #${existingTask.id} "${existingTask.subject}" (${taskStart.toLocaleDateString('es-ES')} - ${taskEnd.toLocaleDateString('es-ES')})`
          );
        }
      }
    }

    // Calcular carga proyectada incluyendo proyectos actuales
    const currentProjectsLoad = getCurrentProjectsByTeam(teamId)
      .filter(project => {
        const projectEnd = new Date(project.endDate);
        return projectEnd >= startDate; // Solo proyectos que se solapan con el período propuesto
      })
      .reduce((total, project) => total + project.loadFactor, 0);

    const projectedLoad = currentProjectsLoad + 1; // Asumir que la nueva tarea añade 1 de carga

    if (projectedLoad > team.capacity) {
      warnings.push(
        `El equipo estaría sobrecargado: ${projectedLoad.toFixed(1)}/${team.capacity} de capacidad considerando proyectos actuales`
      );
    }

    // Verificar disponibilidad (simplificado)
    const today = new Date();
    if (startDate < today) {
      conflicts.push('La fecha de inicio no puede ser anterior a hoy');
    }

    return {
      hasConflicts: conflicts.length > 0,
      conflicts,
      warnings
    };
  }

  /**
   * Calcular fechas posibles para un equipo
   */
  private static calculatePossibleDates(
    teamId: number,
    sprints: number,
    loadFactor: number,
    plannedTasks: (Task & { stage: TaskStage })[]
  ): { possibleStartDate: Date; possibleEndDate: Date } {
    const team = getTeamById(teamId);
    if (!team) {
      throw new Error(`Equipo ${teamId} no encontrado`);
    }

    // Obtener la última fecha de finalización del equipo
    const teamTasks = plannedTasks.filter(t => t.team === teamId && t.endDate);
    
    let latestEndDate = new Date();
    if (teamTasks.length > 0) {
      const endDates = teamTasks.map(t => new Date(t.endDate!));
      latestEndDate = new Date(Math.max(...endDates.map(d => d.getTime())));
    }

    // Calcular fecha de inicio posible
    // Si el equipo tiene capacidad disponible, puede empezar antes
    const availableCapacity = team.capacity - team.currentLoad;
    const possibleStartDate = availableCapacity >= loadFactor 
      ? new Date() // Puede empezar ahora
      : new Date(latestEndDate.getTime() + 24 * 60 * 60 * 1000); // Día siguiente al último proyecto

    // Calcular fecha de fin (sprints * 2 semanas)
    const durationMs = sprints * 14 * 24 * 60 * 60 * 1000; // 14 días por sprint
    const possibleEndDate = new Date(possibleStartDate.getTime() + durationMs);

    return { possibleStartDate, possibleEndDate };
  }

  /**
   * Calcular puntuación de recomendación
   */
  private static calculateRecommendationScore(
    affinity: number,
    availableCapacity: number,
    totalCapacity: number,
    possibleStartDate: Date,
    isExternal: boolean
  ): number {
    let score = 0;

    // Factor de afinidad (40% del peso)
    score += (affinity / 5) * 40;

    // Factor de disponibilidad (35% del peso)
    const capacityRatio = availableCapacity / totalCapacity;
    score += capacityRatio * 35;

    // Factor de tiempo (15% del peso) - cuanto antes pueda empezar, mejor
    const today = new Date();
    const daysUntilStart = Math.max(0, (possibleStartDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    const timeScore = Math.max(0, 15 - (daysUntilStart / 7)); // Menos puntos por cada semana de retraso
    score += timeScore;

    // Penalización por equipos externos (10% del peso)
    if (!isExternal) {
      score += 10; // Bonus por equipo interno
    }

    return Math.round(score * 10) / 10; // Redondear a 1 decimal
  }
} 