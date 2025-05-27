import React, { useState, useEffect } from 'react';
import { Card, Table, Spinner, Alert, Badge } from 'react-bootstrap';
import { Task, TaskStage } from '../../types';
import { TaskService } from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import { getDepartmentName } from '../../services/mockData/departments';
import { getTeamName } from '../../services/mockData/teams';
import { getUserName } from '../../services/mockData/users';
import './TaskList.css';

const TaskList: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<(Task & { stage: TaskStage })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const response = await TaskService.getTasks(
          {},
          { page: 1, pageSize: 20 },
          undefined,
          { field: 'id', direction: 'desc' },
          user?.role,
          user?.department
        );
        setTasks(response.data);
      } catch (err) {
        setError('Error al cargar las tareas');
        console.error('Error loading tasks:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadTasks();
  }, [user]);
  
  const getStageColor = (stage: TaskStage): string => {
    switch (stage) {
      case TaskStage.BACKLOG: return 'secondary';
      case TaskStage.PENDING_PLANNING: return 'warning';
      case TaskStage.PLANNED: return 'info';
      case TaskStage.IN_PROGRESS: return 'primary';
      case TaskStage.COMPLETED: return 'success';
      default: return 'secondary';
    }
  };
  
  const getStageText = (stage: TaskStage): string => {
    switch (stage) {
      case TaskStage.BACKLOG: return 'Backlog';
      case TaskStage.PENDING_PLANNING: return 'Pendiente Planificación';
      case TaskStage.PLANNED: return 'Planificada';
      case TaskStage.IN_PROGRESS: return 'En Progreso';
      case TaskStage.COMPLETED: return 'Completada';
      default: return 'Desconocido';
    }
  };
  
  const formatDate = (date: Date | undefined): string => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-ES');
  };
  
  if (error) {
    return (
      <Alert variant="danger">
        <strong>Error:</strong> {error}
      </Alert>
    );
  }
  
  return (
    <div className="task-list">
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            Gestión de Tareas
            {tasks.length > 0 && (
              <span className="text-muted ms-2">
                ({tasks.length} tareas)
              </span>
            )}
          </h5>
        </Card.Header>
        
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover striped className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Estado</th>
                  <th>ID / Departamento</th>
                  <th>Tarea</th>
                  <th>Prioridad</th>
                  <th>Responsable</th>
                  <th>Equipo</th>
                  <th>Estimación</th>
                  <th>Fechas</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4">
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </Spinner>
                      <div className="mt-2">Cargando tareas...</div>
                    </td>
                  </tr>
                ) : tasks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-muted">
                      No se encontraron tareas.
                    </td>
                  </tr>
                ) : (
                  tasks.map(task => (
                    <tr key={task.id} className="task-item">
                      <td>
                        <Badge bg={getStageColor(task.stage)}>
                          {getStageText(task.stage)}
                        </Badge>
                      </td>
                      <td>
                        <div>
                          <strong>#{task.id}</strong>
                          <div className="text-muted small">
                            {getDepartmentName(task.department)}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-bold">{task.subject}</div>
                          <div className="text-muted small text-truncate" style={{ maxWidth: '300px' }}>
                            {task.description}
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge bg={task.priority === 1 ? 'danger' : task.priority === 2 ? 'warning' : 'info'}>
                          Prioridad {task.priority}
                        </Badge>
                      </td>
                      <td>
                        <span className="small">
                          {task.assignedTo ? getUserName(task.assignedTo) : 'Sin asignar'}
                        </span>
                      </td>
                      <td>
                        <span className="small">
                          {task.team ? getTeamName(task.team) : 'Sin asignar'}
                        </span>
                      </td>
                      <td>
                        <div className="small">
                          {task.sprints ? `${task.sprints} sprints` : '-'}
                        </div>
                      </td>
                      <td>
                        <div className="small">
                          <div>Inicio: {formatDate(task.startDate)}</div>
                          <div>Fin: {formatDate(task.endDate)}</div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TaskList; 