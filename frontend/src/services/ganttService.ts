import { Task, TaskStatus, Department, Team } from '../types';
import { TaskService } from './taskService';
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

// Función para calcular el progreso de una tarea (versión para datos reales del backend)
const calculateTaskProgress = (task: any): number => {
  if (!task.fecha_inicio_planificada || !task.fecha_fin_planificada) {
    return 0;
  }

  const now = new Date();
  const start = new Date(task.fecha_inicio_planificada);
  const end = new Date(task.fecha_fin_planificada);
  
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
    case 'Done':
      return 100;
    case 'Demo':
      return 90;
    case 'Doing':
      // Calcular basado en tiempo transcurrido
      const totalTime = end.getTime() - start.getTime();
      const elapsed = now.getTime() - start.getTime();
      return Math.min(Math.round((elapsed / totalTime) * 100), 80); // Máximo 80% si está en progreso
    case 'To Do':
      return 10; // Ha empezado pero no está en desarrollo activo
    default:
      return 0;
  }
};

// Función para obtener el color/clase CSS según el estado de la tarea (versión para datos reales)
const getTaskClassFromStatus = (status: string): string => {
  switch (status) {
    case 'To Do':
      return 'gantt-task-planned';
    case 'Doing':
      return 'gantt-task-progress';
    case 'Demo':
    case 'Done':
      return 'gantt-task-completed';
    default:
      return 'gantt-task-backlog';
  }
};

// Paleta de colores para equipos
const TEAM_COLORS = [
  '#3498db', // Azul
  '#e74c3c', // Rojo
  '#2ecc71', // Verde
  '#f39c12', // Naranja
  '#9b59b6', // Púrpura
  '#1abc9c', // Turquesa
  '#e67e22', // Naranja oscuro
  '#34495e', // Azul grisáceo
  '#f1c40f', // Amarillo
  '#95a5a6', // Gris
  '#16a085', // Verde azulado
  '#8e44ad', // Púrpura oscuro
  '#2980b9', // Azul oscuro
  '#27ae60', // Verde oscuro
  '#d35400'  // Naranja rojizo
];

// Cache para colores de equipos
const teamColorCache = new Map<string, string>();

// Función para obtener un color único para cada equipo
const getTeamColor = (teamName: string): string => {
  if (!teamName || teamName === 'Sin Equipo') {
    return '#bdc3c7'; // Gris claro para tareas sin equipo
  }
  
  // Si ya tenemos un color asignado para este equipo, lo devolvemos
  if (teamColorCache.has(teamName)) {
    return teamColorCache.get(teamName)!;
  }
  
  // Asignar un nuevo color basado en el número de equipos ya registrados
  const colorIndex = teamColorCache.size % TEAM_COLORS.length;
  const color = TEAM_COLORS[colorIndex];
  
  teamColorCache.set(teamName, color);
  return color;
};

// Función para generar clase CSS personalizada por equipo
const getTaskClassFromTeam = (teamName: string, status: string): string => {
  const baseClass = getTaskClassFromStatus(status);
  const teamClass = teamName ? `gantt-team-${teamName.toLowerCase().replace(/\s+/g, '-')}` : 'gantt-no-team';
  return `${baseClass} ${teamClass}`;
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
   * Generar estilos CSS dinámicos para los equipos
   */
  static generateTeamStyles(): string {
    let styles = '';
    
    teamColorCache.forEach((color, teamName) => {
      const teamClass = teamName.toLowerCase().replace(/\s+/g, '-');
      styles += `
        .gantt-team-${teamClass} .bar {
          fill: ${color} !important;
        }
        .gantt-team-${teamClass} .bar-progress {
          fill: ${color} !important;
          opacity: 0.8;
        }
        .gantt-team-${teamClass} .bar-label {
          fill: white !important;
          font-weight: bold;
        }
      `;
    });
    
    // Estilo para tareas sin equipo
    styles += `
      .gantt-no-team .bar {
        fill: #bdc3c7 !important;
      }
      .gantt-no-team .bar-progress {
        fill: #bdc3c7 !important;
        opacity: 0.8;
      }
      .gantt-no-team .bar-label {
        fill: white !important;
      }
    `;
    
    return styles;
  }

  /**
   * Aplicar estilos CSS dinámicos al documento
   */
  static applyTeamStyles(): void {
    // Remover estilos anteriores si existen
    const existingStyle = document.getElementById('gantt-team-styles');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    // Crear y aplicar nuevos estilos
    const styleElement = document.createElement('style');
    styleElement.id = 'gantt-team-styles';
    styleElement.textContent = this.generateTeamStyles();
    document.head.appendChild(styleElement);
  }

  /**
   * Obtener información de la leyenda de equipos
   */
  static getTeamLegend(tasks: GanttTask[]): { teamName: string; color: string; taskCount: number }[] {
    const teamCounts = new Map<string, number>();
    
    // Contar tareas por equipo
    tasks.forEach(task => {
      const teamName = task.team || 'Sin Equipo';
      teamCounts.set(teamName, (teamCounts.get(teamName) || 0) + 1);
    });
    
    // Crear array de leyenda
    const legend: { teamName: string; color: string; taskCount: number }[] = [];
    
    teamCounts.forEach((count, teamName) => {
      const color = getTeamColor(teamName);
      legend.push({
        teamName,
        color,
        taskCount: count
      });
    });
    
    // Ordenar por nombre de equipo
    legend.sort((a, b) => a.teamName.localeCompare(b.teamName));
    
    return legend;
  }

  /**
   * Obtener tareas formateadas para el Gantt
   */
  static async getGanttTasks(filters?: GanttFilters): Promise<GanttTask[]> {
    try {
      // Construir filtros para el backend
      const backendFilters: any = {};
      
      // Convertir filtros de Gantt a formato del backend
      if (filters?.departments && filters.departments.length > 0) {
        backendFilters.departamento = filters.departments[0]; // Por ahora tomar el primero
      }
      
      if (filters?.status && filters.status.length > 0) {
        // Mapear estados del enum a nombres esperados por el backend
        const statusMapping: Record<TaskStatus, string> = {
          [TaskStatus.BACKLOG]: 'Backlog',
          [TaskStatus.TODO]: 'To Do',
          [TaskStatus.DOING]: 'Doing',
          [TaskStatus.DEMO]: 'Demo', 
          [TaskStatus.DONE]: 'Done'
        };
        backendFilters.status_id = statusMapping[filters.status[0]]; // Por ahora tomar el primero
      }
      
             // Obtener tareas del backend con datos reales
       const response = await TaskService.getTasks(
         backendFilters,
         { page: 1, pageSize: 50 } // paginación
       );
       
       const allTasks = response.data || [];
      
      // Filtrar solo las tareas que tienen fechas de planificación
      let filteredTasks = allTasks.filter((task: any) => 
        task.startDate && 
        task.endDate && 
        (task.status === 'Backlog' ||
         task.status === 'To Do' || 
         task.status === 'Doing' || 
         task.status === 'Demo' ||
         task.status === 'Done')
      );
      
      // Aplicar filtros adicionales de fecha si se proporcionan
      if (filters?.startDate) {
        filteredTasks = filteredTasks.filter((task: any) => 
          new Date(task.endDate) >= filters.startDate!
        );
      }
      
      if (filters?.endDate) {
        filteredTasks = filteredTasks.filter((task: any) => 
          new Date(task.startDate) <= filters.endDate!
        );
      }
      
             // Aplicar filtro de equipos
       if (filters?.teams && filters.teams.length > 0) {
         filteredTasks = filteredTasks.filter((task: any) => 
           task.team && filters.teams!.includes(task.team)
         );
       }
    
       // Convertir a formato Gantt con resolución de nombres async
       const ganttTasksPromises = filteredTasks.map(async (task: any) => {
         const [teamName, departmentName] = await Promise.all([
           getTeamName(task.team),
           getDepartmentName(task.department)
         ]);

         return {
           id: task.id.toString(),
           name: task.subject,
           start: formatDateForGantt(new Date(task.startDate)),
           end: formatDateForGantt(new Date(task.endDate)),
           progress: calculateTaskProgress(task),
           custom_class: getTaskClassFromTeam(teamName, task.status),
           team: teamName,
           department: departmentName,
           priority: task.priority,
           loadFactor: task.loadFactor
         };
       });

       const ganttTasks = await Promise.all(ganttTasksPromises);
    
       // Ordenar por fecha de inicio
       ganttTasks.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    
       // Aplicar estilos CSS dinámicos para los equipos
       this.applyTeamStyles();
    
       return ganttTasks;
     } catch (error) {
       console.error('Error loading Gantt tasks:', error);
       return [];
     }
  }
  
    /**
   * Obtener estadísticas para el dashboard del Gantt
   */
  static async getGanttStats(filters?: GanttFilters): Promise<{
    totalTasks: number;
    tasksByStatus: Record<string, number>;
    tasksByTeam: Record<string, number>;
    tasksByDepartment: Record<string, number>;
    timeRange: { start: Date; end: Date } | null;
  }> {
    try {
      console.log('Getting Gantt stats with filters:', filters);
      
      // Obtener todas las tareas del backend (sin filtros inicialmente para debug)
      const response = await TaskService.getTasks(
        {}, // Sin filtros para obtener todas las tareas
        { page: 1, pageSize: 500 } // Aumentar límite para obtener más datos
      );
      
      const allTasks = response.data || [];
      console.log('Total tasks from backend:', allTasks.length);
      console.log('Sample task:', allTasks[0]); // Para ver la estructura de datos
      
      // Estadísticas básicas
      const stats = {
        totalTasks: allTasks.length,
        tasksByStatus: {} as Record<string, number>,
        tasksByTeam: {} as Record<string, number>,
        tasksByDepartment: {} as Record<string, number>,
        timeRange: null as { start: Date; end: Date } | null
      };
      
      // Inicializar contadores para los estados reales
      const statusList = ['Backlog', 'To Do', 'Doing', 'Demo', 'Done'];
      statusList.forEach(status => {
        stats.tasksByStatus[status] = 0;
      });
      
      if (allTasks.length > 0) {
        let minDate: Date | null = null;
        let maxDate: Date | null = null;
        
        // Procesar cada tarea para estadísticas
        for (const task of allTasks) {
          console.log(`Processing task ${task.id}: status=${task.status}, team=${task.team}, dept=${task.departmentName}`);
          
          // Contar por estado
          if (task.status) {
            // Convertir el enum a string para comparación
            const statusString = task.status.toString();
            // Normalizar el estado para que coincida con nuestros valores esperados
            let normalizedStatus = statusString;
            if (statusString === 'To do') normalizedStatus = 'To Do'; // Normalizar caso
            
            if (statusList.includes(normalizedStatus)) {
              stats.tasksByStatus[normalizedStatus] = (stats.tasksByStatus[normalizedStatus] || 0) + 1;
            } else {
              console.warn('Unknown status found:', statusString);
            }
          }
          
          // Contar por departamento (usar directamente el campo departmentName)
          if (task.departmentName) {
            stats.tasksByDepartment[task.departmentName] = (stats.tasksByDepartment[task.departmentName] || 0) + 1;
          }
          
          // Para equipos, usar un enfoque más simple por ahora
          if (task.team) {
            // Usar el ID del equipo como clave temporal
            const teamKey = `Equipo ${task.team}`;
            stats.tasksByTeam[teamKey] = (stats.tasksByTeam[teamKey] || 0) + 1;
          }
          
          // Calcular rango de fechas (solo para tareas planificadas)
          if (task.startDate && task.endDate) {
            const taskStart = new Date(task.startDate);
            const taskEnd = new Date(task.endDate);
            
            if (!minDate || taskStart < minDate) minDate = taskStart;
            if (!maxDate || taskEnd > maxDate) maxDate = taskEnd;
          }
        }
        
        if (minDate && maxDate) {
          stats.timeRange = { start: minDate, end: maxDate };
        }
      }
      
      console.log('Gantt stats calculated:', stats);
      return stats;
      
    } catch (error) {
      console.error('Error calculating Gantt stats:', error);
      
      // Fallback con estadísticas vacías
      return {
        totalTasks: 0,
        tasksByStatus: {
          'Backlog': 0,
          'To Do': 0,
          'Doing': 0,
          'Demo': 0,
          'Done': 0
        },
        tasksByTeam: {},
        tasksByDepartment: {},
        timeRange: null
      };
    }
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
      
      // Obtener tareas reales para calcular carga de equipos
      const tasksResponse = await TaskService.getTasks({}, { page: 1, pageSize: 100 });
      const tasksWithStage = tasksResponse.data || [];
      const teamsWithLoad = updateTeamsWithCurrentLoad(teams, tasksWithStage);
      
      const statuses = [
        { value: TaskStatus.BACKLOG, label: 'Backlog' },
        { value: TaskStatus.TODO, label: 'To Do' },
        { value: TaskStatus.DOING, label: 'Doing' },
        { value: TaskStatus.DEMO, label: 'Demo' },
        { value: TaskStatus.DONE, label: 'Done' }
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
        { value: TaskStatus.BACKLOG, label: 'Backlog' },
        { value: TaskStatus.TODO, label: 'To Do' },
        { value: TaskStatus.DOING, label: 'Doing' },
        { value: TaskStatus.DEMO, label: 'Demo' },
        { value: TaskStatus.DONE, label: 'Done' }
      ];

      return {
        departments: [],
        teams: [],
        statuses: statuses
      };
    }
  }
} 