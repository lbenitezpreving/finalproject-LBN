import { Task, TaskStage, Department, Team } from '../types';
import { TaskService } from './taskService';
import { getTasksWithStage } from './mockData/tasks';
import { getAllTeamsWithCurrentLoad } from './mockData/teams';
import { mockDepartments } from './mockData/departments';

// Interfaz para representar una tarea en el Gantt
export interface GanttTask {
  id: string;
  name: string;
  start: string; // fecha en formato YYYY-MM-DD
  end: string; // fecha en formato YYYY-MM-DD
  progress: number; // porcentaje de progreso (0-100)
  custom_class?: string; // clase CSS personalizada para colores
  dependencies?: string; // IDs de tareas dependientes (separados por coma)
  // Campos adicionales para mostrar información
  team?: string;
  department?: string;
  priority?: number;
  assignedTo?: string;
  loadFactor?: number;
}

// Interfaz para filtros del Gantt
export interface GanttFilters {
  departments?: number[];
  teams?: number[];
  startDate?: Date;
  endDate?: Date;
  status?: string[];
}

// Función para convertir Date a string formato YYYY-MM-DD
const formatDateForGantt = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Función para obtener el color/clase CSS según el estado de la tarea
const getTaskClass = (task: Task & { stage: TaskStage }): string => {
  switch (task.stage) {
    case TaskStage.PLANNED:
      return 'gantt-planned';
    case TaskStage.IN_PROGRESS:
      return 'gantt-in-progress';
    case TaskStage.COMPLETED:
      return 'gantt-completed';
    default:
      return 'gantt-default';
  }
};

// Función para calcular el progreso de una tarea
const calculateProgress = (task: Task & { stage: TaskStage }): number => {
  const now = new Date();
  
  if (!task.startDate || !task.endDate) return 0;
  
  const startTime = task.startDate.getTime();
  const endTime = task.endDate.getTime();
  const currentTime = now.getTime();
  
  if (currentTime < startTime) return 0; // No ha comenzado
  if (currentTime > endTime) return 100; // Ya terminó
  
  // Calcular progreso basado en tiempo transcurrido
  const totalDuration = endTime - startTime;
  const elapsedDuration = currentTime - startTime;
  const timeProgress = (elapsedDuration / totalDuration) * 100;
  
  // Ajustar según el estado de la tarea
  switch (task.stage) {
    case TaskStage.COMPLETED:
      return 100;
    case TaskStage.IN_PROGRESS:
      return Math.min(Math.max(timeProgress, 10), 95); // Entre 10% y 95%
    case TaskStage.PLANNED:
      return Math.min(timeProgress, 5); // Máximo 5% si está planificada
    default:
      return 0;
  }
};

// Función para obtener el nombre del departamento
const getDepartmentName = (departmentId: number): string => {
  const department = mockDepartments.find(d => d.id === departmentId);
  return department?.name || 'Sin Departamento';
};

// Función para obtener el nombre del equipo
const getTeamName = (teamId?: number): string => {
  if (!teamId) return 'Sin Equipo';
  const teams = getAllTeamsWithCurrentLoad();
  const team = teams.find(t => t.id === teamId);
  return team?.name || 'Sin Equipo';
};

export class GanttService {
  /**
   * Obtener tareas formateadas para el Gantt
   */
  static async getGanttTasks(filters?: GanttFilters): Promise<GanttTask[]> {
    // Obtener todas las tareas con stage
    const allTasks = getTasksWithStage();
    
    // Filtrar solo las tareas que tienen fechas de inicio y fin (planificadas, en progreso o completadas)
    let filteredTasks = allTasks.filter(task => 
      task.startDate && 
      task.endDate && 
      (task.stage === TaskStage.PLANNED || 
       task.stage === TaskStage.IN_PROGRESS || 
       task.stage === TaskStage.COMPLETED)
    );
    
    // Aplicar filtros si se proporcionan
    if (filters) {
      if (filters.departments && filters.departments.length > 0) {
        filteredTasks = filteredTasks.filter(task => 
          filters.departments!.includes(task.department)
        );
      }
      
      if (filters.teams && filters.teams.length > 0) {
        filteredTasks = filteredTasks.filter(task => 
          task.team && filters.teams!.includes(task.team)
        );
      }
      
      if (filters.startDate) {
        filteredTasks = filteredTasks.filter(task => 
          task.endDate! >= filters.startDate!
        );
      }
      
      if (filters.endDate) {
        filteredTasks = filteredTasks.filter(task => 
          task.startDate! <= filters.endDate!
        );
      }
      
      if (filters.status && filters.status.length > 0) {
        filteredTasks = filteredTasks.filter(task => 
          filters.status!.includes(task.stage)
        );
      }
    }
    
    // Convertir a formato Gantt
    const ganttTasks: GanttTask[] = filteredTasks.map(task => ({
      id: task.id.toString(),
      name: task.subject,
      start: formatDateForGantt(task.startDate!),
      end: formatDateForGantt(task.endDate!),
      progress: calculateProgress(task),
      custom_class: getTaskClass(task),
      team: getTeamName(task.team),
      department: getDepartmentName(task.department),
      priority: task.priority,
      loadFactor: task.loadFactor
    }));
    
    // Ordenar por fecha de inicio
    ganttTasks.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    
    return ganttTasks;
  }
  
  /**
   * Obtener estadísticas para el dashboard del Gantt
   */
  static async getGanttStats(filters?: GanttFilters): Promise<{
    totalTasks: number;
    tasksByStage: Record<TaskStage, number>;
    tasksByTeam: Record<string, number>;
    tasksByDepartment: Record<string, number>;
    timeRange: { start: Date; end: Date } | null;
  }> {
    const tasks = await this.getGanttTasks(filters);
    
    // Estadísticas básicas
    const stats = {
      totalTasks: tasks.length,
      tasksByStage: {} as Record<TaskStage, number>,
      tasksByTeam: {} as Record<string, number>,
      tasksByDepartment: {} as Record<string, number>,
      timeRange: null as { start: Date; end: Date } | null
    };
    
    // Inicializar contadores
    Object.values(TaskStage).forEach(stage => {
      stats.tasksByStage[stage] = 0;
    });
    
    if (tasks.length > 0) {
      let minDate = new Date(tasks[0].start);
      let maxDate = new Date(tasks[0].end);
      
      tasks.forEach(task => {
        // Contar por equipo
        if (task.team) {
          stats.tasksByTeam[task.team] = (stats.tasksByTeam[task.team] || 0) + 1;
        }
        
        // Contar por departamento
        if (task.department) {
          stats.tasksByDepartment[task.department] = (stats.tasksByDepartment[task.department] || 0) + 1;
        }
        
        // Calcular rango de fechas
        const taskStart = new Date(task.start);
        const taskEnd = new Date(task.end);
        
        if (taskStart < minDate) minDate = taskStart;
        if (taskEnd > maxDate) maxDate = taskEnd;
      });
      
      stats.timeRange = { start: minDate, end: maxDate };
    }
    
    return stats;
  }
  
  /**
   * Obtener opciones para los filtros
   */
  static async getFilterOptions(): Promise<{
    departments: Department[];
    teams: Team[];
    statuses: { value: TaskStage; label: string }[];
  }> {
    const teams = getAllTeamsWithCurrentLoad();
    
    const statuses = [
      { value: TaskStage.PLANNED, label: 'Planificada' },
      { value: TaskStage.IN_PROGRESS, label: 'En Progreso' },
      { value: TaskStage.COMPLETED, label: 'Completada' }
    ];
    
    return {
      departments: mockDepartments,
      teams: teams,
      statuses: statuses
    };
  }
} 