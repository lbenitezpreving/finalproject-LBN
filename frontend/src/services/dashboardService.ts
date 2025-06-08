import { mockTasks, getTasksWithStage } from './mockData/tasks';
// TODO: Reemplazar con servicios reales cuando estén implementados
// import { getAllTeamsWithCurrentLoad } from './mockData/teams';
// import { mockDepartments, getDepartmentName } from './mockData/departments';
import { TaskStatus, Alert, AlertType } from '../types';
import { TaskService } from './taskService';
import { userService } from './api';
import { adaptBackendUsersResponse } from './dataAdapters';

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
    
    // Para las funcionalidades no implementadas en backend, usar mock
    const tasksWithStage = getTasksWithStage();
    // TODO: Implementar servicios reales para equipos y departamentos
    // const teams = getAllTeamsWithCurrentLoad();

    // Métricas básicas de tareas del backend
    const totalTasks = stats.total;
    const pendingTasks = (stats.byStage?.[TaskStatus.BACKLOG] || 0) + (stats.byStage?.[TaskStatus.TODO] || 0);
    const inProgressTasks = stats.byStage?.[TaskStatus.DOING] || 0;
    const completedTasks = (stats.byStage?.[TaskStatus.DEMO] || 0) + (stats.byStage?.[TaskStatus.DONE] || 0);

    // Utilización promedio de equipos (temporalmente deshabilitado)
    const teamUtilization = 75; // Valor temporal hasta implementar servicio real

    // Distribución por departamento (temporalmente simplificada)
    const departmentCounts = [
      { department: 'Tecnología', count: Math.floor(totalTasks * 0.4), percentage: 40 },
      { department: 'Marketing', count: Math.floor(totalTasks * 0.2), percentage: 20 },
      { department: 'Ventas', count: Math.floor(totalTasks * 0.2), percentage: 20 },
      { department: 'RRHH', count: Math.floor(totalTasks * 0.1), percentage: 10 },
      { department: 'Finanzas', count: Math.floor(totalTasks * 0.1), percentage: 10 }
    ];

    // Generar alertas críticas (temporalmente simplificado)
    const alerts: Alert[] = [];

    return {
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      criticalAlerts: alerts.length,
      teamUtilization,
      departmentDistribution: departmentCounts.filter(dept => dept.count > 0),
      alerts
    };
  } catch (error) {
    console.error('Error al obtener métricas del dashboard:', error);
    
    // Fallback simplificado en caso de error
    return {
      totalTasks: 0,
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
 * Generar alertas críticas basándose en los datos actuales
 */
const generateCriticalAlerts = (tasks: any[], teams: any[]): Alert[] => {
  const alerts: Alert[] = [];
  let alertId = 1;

  // Alertas por fechas límite
  const today = new Date();
  const overdueTasks = tasks.filter(task => 
    task.endDate && 
    new Date(task.endDate) < today && 
    task.status !== TaskStatus.DONE
  );

  overdueTasks.forEach(task => {
    alerts.push({
      id: alertId++,
      type: AlertType.OVERDUE_TASK,
      taskId: task.id,
      message: `Tarea #${task.id} - "${task.subject}" - Fecha límite superada`,
      createdAt: new Date(),
      isRead: false
    });
  });

  // Alertas por equipos sobrecargados
  const overloadedTeams = teams.filter(team => 
    (team.currentLoad / team.capacity) > 1.0
  );

  overloadedTeams.forEach(team => {
    const utilizationPercent = Math.round((team.currentLoad / team.capacity) * 100);
    alerts.push({
      id: alertId++,
      type: AlertType.HIGH_LOAD,
      teamId: team.id,
      message: `${team.name} - Capacidad superada (${utilizationPercent}%)`,
      createdAt: new Date(),
      isRead: false
    });
  });

  // Alertas por tareas sin asignar a equipo
  const unassignedTasks = tasks.filter(task => 
    task.status === TaskStatus.TODO && 
    !task.team
  );

  unassignedTasks.slice(0, 3).forEach(task => { // Limitar a 3 para no saturar
    alerts.push({
      id: alertId++,
      type: AlertType.UNASSIGNED_TASK,
      taskId: task.id,
      message: `Tarea #${task.id} - "${task.subject}" - Sin equipo asignado`,
      createdAt: new Date(),
      isRead: false
    });
  });

  return alerts.slice(0, 5); // Limitar a 5 alertas máximo
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
 * Obtener todos los equipos ordenados por carga de trabajo
 * TODO: Reimplementar cuando el servicio de equipos esté listo
 */
export const getHighLoadTeams = () => {
  // Temporalmente deshabilitado
  return [];
}; 