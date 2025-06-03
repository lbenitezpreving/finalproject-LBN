import { 
  Task, 
  TaskFilters, 
  PaginatedResponse, 
  SearchParams, 
  SortConfig, 
  TaskStage,
  UserRole 
} from '../types';
import { mockTasks, getTasksWithStage, getTaskStage } from './mockData/tasks';

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
} 