import { getTasksWithStage } from './mockData/tasks';
// TODO: Reemplazar con servicios reales cuando estén implementados
// import { getAllTeamsWithCurrentLoad } from './mockData/teams';
// import { mockDepartments, getDepartmentName } from './mockData/departments';
import { TaskStatus, Alert, AlertType } from '../types';
import { TaskService } from './taskService';
import { userService, teamService, departmentService } from './api';
import { 
  adaptBackendUsersResponse, 
  adaptBackendTeamsResponse, 
  adaptBackendDepartmentsResponse,
  updateTeamsWithCurrentLoad,
  calculateTeamCurrentLoad
} from './dataAdapters';

export interface DashboardMetrics {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  criticalAlerts: number;
  teamUtilization: number;
  departmentDistribution: Array<{
    department: string;
    count: number;
    percentage: number;
  }>;
  alerts: Alert[];
}

/**
 * Calcular métricas del dashboard basándose en los datos reales del backend
 */
export const calculateDashboardMetrics = async (): Promise<DashboardMetrics> => {
  try {
    // Obtener estadísticas reales del backend
    const stats = await TaskService.getTaskStats();
    
    // Obtener datos reales de equipos y departamentos
    const [teamsResponse, departmentsResponse] = await Promise.all([
      teamService.getTeams(),
      departmentService.getDepartments()
    ]);

    const teams = adaptBackendTeamsResponse(teamsResponse);
    const departments = adaptBackendDepartmentsResponse(departmentsResponse);
    
    // Obtener tareas para calcular carga de equipos
    const tasksWithStage = getTasksWithStage();
    const teamsWithLoad = updateTeamsWithCurrentLoad(teams, tasksWithStage);

    // Métricas básicas de tareas del backend
    const totalTasks = stats.total;
    const pendingTasks = (stats.byStage?.[TaskStatus.BACKLOG] || 0) + (stats.byStage?.[TaskStatus.TODO] || 0);
    const inProgressTasks = stats.byStage?.[TaskStatus.DOING] || 0;
    const completedTasks = (stats.byStage?.[TaskStatus.DEMO] || 0) + (stats.byStage?.[TaskStatus.DONE] || 0);

    // Calcular utilización promedio de equipos
    const teamUtilization = calculateAverageTeamUtilization(teamsWithLoad);

    // Distribución por departamento basada en tareas reales
    const departmentDistribution = calculateDepartmentDistribution(tasksWithStage, departments);

    // Generar alertas críticas
    const alerts = await generateCriticalAlerts(teamsWithLoad, tasksWithStage);

    return {
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      criticalAlerts: alerts.length,
      teamUtilization,
      departmentDistribution,
      alerts
    };
  } catch (error) {
    console.error('Error calculating dashboard metrics:', error);
    
    // Fallback a datos básicos en caso de error
    const stats = await TaskService.getTaskStats();
    return {
      totalTasks: stats.total || 0,
      pendingTasks: 0,
      inProgressTasks: 0,
      completedTasks: 0,
      criticalAlerts: 0,
      teamUtilization: 0,
      departmentDistribution: [],
      alerts: []
    };
  }
};

/**
 * Calcular utilización promedio de equipos
 */
const calculateAverageTeamUtilization = (teams: any[]): number => {
  if (teams.length === 0) return 0;
  
  const totalUtilization = teams.reduce((sum, team) => {
    const utilization = team.capacity > 0 ? (team.currentLoad / team.capacity) * 100 : 0;
    return sum + Math.min(utilization, 100); // Cap at 100%
  }, 0);
  
  return Math.round(totalUtilization / teams.length);
};

/**
 * Calcular distribución por departamento
 */
const calculateDepartmentDistribution = (tasks: any[], departments: any[]) => {
  const departmentCounts: Record<number, number> = {};
  
  // Contar tareas por departamento
  tasks.forEach(task => {
    if (task.department) {
      departmentCounts[task.department] = (departmentCounts[task.department] || 0) + 1;
    }
  });

  const totalTasks = tasks.length;
  
  // Crear distribución con nombres de departamentos
  return departments
    .map(dept => ({
      department: dept.name,
      count: departmentCounts[dept.id] || 0,
      percentage: totalTasks > 0 ? Math.round(((departmentCounts[dept.id] || 0) / totalTasks) * 100) : 0
    }))
    .filter(dept => dept.count > 0)
    .sort((a, b) => b.count - a.count);
};

/**
 * Generar alertas críticas basadas en datos reales
 */
const generateCriticalAlerts = async (teams: any[], tasks: any[]): Promise<Alert[]> => {
  const alerts: Alert[] = [];
  const now = new Date();

  // Alertas de equipos con alta carga
  teams.forEach(team => {
    if (team.capacity > 0) {
      const utilizationPercent = (team.currentLoad / team.capacity) * 100;
      if (utilizationPercent > 90) {
        alerts.push({
          id: Date.now() + team.id,
          type: AlertType.HIGH_LOAD,
          teamId: team.id,
          message: `El equipo ${team.name} tiene una carga del ${Math.round(utilizationPercent)}%`,
          createdAt: now,
          isRead: false
        });
      }
    }
  });

  // Alertas de tareas próximas a vencer
  tasks.forEach(task => {
    if (task.endDate && task.status !== TaskStatus.DONE) {
      const daysUntilDeadline = Math.ceil((task.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDeadline < 0) {
        alerts.push({
          id: Date.now() + task.id + 1000,
          type: AlertType.OVERDUE_TASK,
          taskId: task.id,
          message: `La tarea "${task.subject}" está vencida`,
          createdAt: now,
          isRead: false
        });
      } else if (daysUntilDeadline <= 3) {
        alerts.push({
          id: Date.now() + task.id + 2000,
          type: AlertType.APPROACHING_DEADLINE,
          taskId: task.id,
          message: `La tarea "${task.subject}" vence en ${daysUntilDeadline} días`,
          createdAt: now,
          isRead: false
        });
      }
    }

    // Alertas de tareas sin asignar
    if (!task.assignedTo) {
      alerts.push({
        id: Date.now() + task.id + 3000,
        type: AlertType.UNASSIGNED_TASK,
        taskId: task.id,
        message: `La tarea "${task.subject}" no tiene responsable asignado`,
        createdAt: now,
        isRead: false
      });
    }
  });

  return alerts.slice(0, 10); // Limitar a 10 alertas más críticas
};

/**
 * Obtener tareas próximas a vencer (en los próximos 7 días)
 * TODO: Reimplementar cuando el servicio de departamentos esté listo
 */
export const getUpcomingDeadlines = () => {
  // Temporalmente deshabilitado
  return [];
};

/**
 * Obtener todos los equipos con carga actual calculada
 */
export const getAllTeamsWithCurrentLoad = async () => {
  try {
    const [teamsResponse, tasks] = await Promise.all([
      teamService.getTeams(),
      getTasksWithStage() // Usar función existente para obtener tareas
    ]);

    const teams = adaptBackendTeamsResponse(teamsResponse);
    return updateTeamsWithCurrentLoad(teams, tasks);
  } catch (error) {
    console.error('Error getting teams with current load:', error);
    return [];
  }
};

/**
 * Obtener equipos con alta carga de trabajo
 */
export const getHighLoadTeams = async () => {
  try {
    const teams = await getAllTeamsWithCurrentLoad();
    
    return teams
      .filter(team => {
        if (team.capacity <= 0) return false;
        const utilizationPercent = (team.currentLoad / team.capacity) * 100;
        return utilizationPercent > 80; // Equipos con más del 80% de utilización
      })
      .sort((a, b) => {
        const utilizationA = (a.currentLoad / a.capacity) * 100;
        const utilizationB = (b.currentLoad / b.capacity) * 100;
        return utilizationB - utilizationA;
      });
  } catch (error) {
    console.error('Error getting high load teams:', error);
    return [];
  }
}; 