import { Task, TaskStatus, Department, Team } from '../types';
import { TaskService } from './taskService';
import { getTasksWithStage } from './mockData/tasks';
import { teamService, departmentService } from './api';
import { 
  adaptBackendTeamsResponse, 
  adaptBackendDepartmentsResponse,
  updateTeamsWithCurrentLoad,
  getTeamNameById,
  getDepartmentNameById
} from './dataAdapters';

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
  status?: TaskStatus[];
}

// Función para convertir Date a string formato YYYY-MM-DD
const formatDateForGantt = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Función para obtener el color/clase CSS según el estado de la tarea
const getTaskClass = (task: Task): string => {
  switch (task.status) {
    case TaskStatus.TODO:
      return 'gantt-task-planned';
    case TaskStatus.DOING:
      return 'gantt-task-progress';
    case TaskStatus.DEMO:
    case TaskStatus.DONE:
      return 'gantt-task-completed';
    default:
      return 'gantt-task-backlog';
  }
};

// Función para calcular el progreso de una tarea
const calculateProgress = (task: Task): number => {
  if (!task.startDate || !task.endDate) {
    return 0;
  }

  const now = new Date();
  const start = new Date(task.startDate);
  const end = new Date(task.endDate);
  
  // Si no ha empezado
  if (now < start) {
    return 0;
  }
  
  // Si ya terminó
  if (now > end) {
    return 100;
  }

  // Calcular progreso basado en estado
  switch (task.status) {
    case TaskStatus.DONE:
      return 100;
    case TaskStatus.DEMO:
      return 90;
    case TaskStatus.DOING:
      // Calcular basado en tiempo transcurrido
      const totalTime = end.getTime() - start.getTime();
      const elapsed = now.getTime() - start.getTime();
      return Math.min(Math.round((elapsed / totalTime) * 100), 80); // Máximo 80% si está en progreso
    case TaskStatus.TODO:
      return 10; // Ha empezado pero no está en desarrollo activo
    default:
      return 0;
  }
};

// Función para obtener el nombre del departamento
const getDepartmentName = async (departmentId: number): Promise<string> => {
  return await getDepartmentNameById(departmentId);
};

// Función para obtener el nombre del equipo
const getTeamName = async (teamId?: number): Promise<string> => {
  if (!teamId) return 'Sin Equipo';
  return await getTeamNameById(teamId);
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
      (task.status === TaskStatus.TODO || 
       task.status === TaskStatus.DOING || 
       task.status === TaskStatus.DEMO ||
       task.status === TaskStatus.DONE)
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
          filters.status!.includes(task.status)
        );
      }
    }
    
    // Convertir a formato Gantt con resolución de nombres async
    const ganttTasksPromises = filteredTasks.map(async (task) => {
      const [teamName, departmentName] = await Promise.all([
        getTeamName(task.team),
        getDepartmentName(task.department)
      ]);

      return {
        id: task.id.toString(),
        name: task.subject,
        start: formatDateForGantt(task.startDate!),
        end: formatDateForGantt(task.endDate!),
        progress: calculateProgress(task),
        custom_class: getTaskClass(task),
        team: teamName,
        department: departmentName,
        priority: task.priority,
        loadFactor: task.loadFactor
      };
    });

    const ganttTasks = await Promise.all(ganttTasksPromises);
    
    // Ordenar por fecha de inicio
    ganttTasks.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    
    return ganttTasks;
  }
  
  /**
   * Obtener estadísticas para el dashboard del Gantt
   */
  static async getGanttStats(filters?: GanttFilters): Promise<{
    totalTasks: number;
    tasksByStatus: Record<TaskStatus, number>;
    tasksByTeam: Record<string, number>;
    tasksByDepartment: Record<string, number>;
    timeRange: { start: Date; end: Date } | null;
  }> {
    const tasks = await this.getGanttTasks(filters);
    
    // Estadísticas básicas
    const stats = {
      totalTasks: tasks.length,
      tasksByStatus: {} as Record<TaskStatus, number>,
      tasksByTeam: {} as Record<string, number>,
      tasksByDepartment: {} as Record<string, number>,
      timeRange: null as { start: Date; end: Date } | null
    };
    
    // Inicializar contadores
    Object.values(TaskStatus).forEach(status => {
      stats.tasksByStatus[status] = 0;
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
    statuses: { value: TaskStatus; label: string }[];
  }> {
    try {
      // Obtener datos reales de equipos y departamentos
      const [teamsResponse, departmentsResponse] = await Promise.all([
        teamService.getTeams(),
        departmentService.getDepartments()
      ]);

      const teams = adaptBackendTeamsResponse(teamsResponse);
      const departments = adaptBackendDepartmentsResponse(departmentsResponse);
      
      // Calcular carga actual de equipos
      const tasksWithStage = getTasksWithStage();
      const teamsWithLoad = updateTeamsWithCurrentLoad(teams, tasksWithStage);
      
      const statuses = [
        { value: TaskStatus.TODO, label: 'Planificada' },
        { value: TaskStatus.DOING, label: 'En Progreso' },
        { value: TaskStatus.DEMO, label: 'En Demo' },
        { value: TaskStatus.DONE, label: 'Completada' }
      ];

      return {
        departments: departments,
        teams: teamsWithLoad,
        statuses: statuses
      };
    } catch (error) {
      console.error('Error getting filter options:', error);
      
      // Fallback básico en caso de error
      const statuses = [
        { value: TaskStatus.TODO, label: 'Planificada' },
        { value: TaskStatus.DOING, label: 'En Progreso' },
        { value: TaskStatus.DEMO, label: 'En Demo' },
        { value: TaskStatus.DONE, label: 'Completada' }
      ];

      return {
        departments: [],
        teams: [],
        statuses: statuses
      };
    }
  }
} 