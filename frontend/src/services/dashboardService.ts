import { mockTasks, getTasksWithStage } from './mockData/tasks';
import { getAllTeamsWithCurrentLoad } from './mockData/teams';
import { mockDepartments, getDepartmentName } from './mockData/departments';
import { TaskStatus, TaskStage, Alert, AlertType } from '../types';

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
 * Calcular métricas del dashboard basándose en los datos mock
 */
export const calculateDashboardMetrics = (): DashboardMetrics => {
  const tasks = mockTasks;
  const tasksWithStage = getTasksWithStage();
  const teams = getAllTeamsWithCurrentLoad();

  // Métricas básicas de tareas
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(task => task.status === TaskStatus.PENDING).length;
  const inProgressTasks = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
  const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED).length;

  // Utilización promedio de equipos
  const teamUtilization = Math.round(
    teams.reduce((sum, team) => sum + (team.currentLoad / team.capacity), 0) / teams.length * 100
  );

  // Distribución por departamento
  const departmentCounts = mockDepartments.map(dept => ({
    department: dept.name,
    count: tasks.filter(task => task.department === dept.id).length,
    percentage: 0
  }));

  // Calcular porcentajes
  departmentCounts.forEach(dept => {
    dept.percentage = Math.round((dept.count / totalTasks) * 100);
  });

  // Generar alertas críticas
  const alerts = generateCriticalAlerts(tasksWithStage, teams);

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
    task.status !== TaskStatus.COMPLETED
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
    task.status === TaskStatus.PENDING && 
    task.stage === TaskStage.PENDING_PLANNING &&
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
 */
export const getUpcomingDeadlines = () => {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  return mockTasks.filter(task => 
    task.endDate && 
    task.status !== TaskStatus.COMPLETED &&
    new Date(task.endDate) >= today &&
    new Date(task.endDate) <= nextWeek
  ).map(task => ({
    id: task.id,
    subject: task.subject,
    endDate: task.endDate,
    department: getDepartmentName(task.department),
    daysRemaining: Math.ceil((new Date(task.endDate!).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }));
};

/**
 * Obtener todos los equipos ordenados por carga de trabajo
 */
export const getHighLoadTeams = () => {
  const teams = getAllTeamsWithCurrentLoad();
  
  return teams
    .map(team => ({
      ...team,
      utilization: Math.round((team.currentLoad / team.capacity) * 100)
    }))
    .sort((a, b) => b.utilization - a.utilization); // Todos los equipos ordenados por utilización
}; 