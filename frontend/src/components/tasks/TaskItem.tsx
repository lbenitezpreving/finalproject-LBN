import React from 'react';
import { Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faUsers, 
  faCalendarAlt, 
  faExclamationTriangle,
  faCheckCircle,
  faHourglass,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { Task, TaskStage } from '../../types';
import { getDepartmentName } from '../../services/mockData/departments';
import { getTeamName } from '../../services/mockData/teams';
import { getUserName } from '../../services/mockData/users';

interface TaskItemProps {
  task: Task & { stage: TaskStage };
  onClick?: (task: Task & { stage: TaskStage }) => void;
  actionButtons?: React.ReactNode;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onClick, actionButtons }) => {
  
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
  
  const getStageIcon = (stage: TaskStage) => {
    switch (stage) {
      case TaskStage.BACKLOG: return faClock;
      case TaskStage.PENDING_PLANNING: return faExclamationTriangle;
      case TaskStage.PLANNED: return faCalendarAlt;
      case TaskStage.IN_PROGRESS: return faHourglass;
      case TaskStage.COMPLETED: return faCheckCircle;
      default: return faClock;
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
  
  const getPriorityColor = (priority: number): string => {
    switch (priority) {
      case 1: return 'danger';
      case 2: return 'warning';
      case 3: return 'info';
      default: return 'secondary';
    }
  };
  
  const formatDate = (date: Date | undefined): string => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-ES');
  };
  
  const handleClick = () => {
    if (onClick) {
      onClick(task);
    }
  };
  
  return (
    <tr 
      className={`task-item ${onClick ? 'clickable' : ''}`}
      onClick={handleClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <td>
        <div className="d-flex align-items-center">
          <Badge 
            bg={getStageColor(task.stage)} 
            className="me-2"
          >
            <FontAwesomeIcon icon={getStageIcon(task.stage)} className="me-1" />
            {getStageText(task.stage)}
          </Badge>
        </div>
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
        <Badge bg={getPriorityColor(task.priority)}>
          Prioridad {task.priority}
        </Badge>
      </td>
      
      <td>
        <div className="d-flex align-items-center">
          <FontAwesomeIcon icon={faUser} className="me-1 text-muted" />
          <span className="small">
            {task.assignedTo ? getUserName(task.assignedTo) : 'Sin asignar'}
          </span>
        </div>
      </td>
      
      <td>
        <div className="d-flex align-items-center">
          <FontAwesomeIcon icon={faUsers} className="me-1 text-muted" />
          <span className="small">
            {task.team ? getTeamName(task.team) : 'Sin asignar'}
          </span>
        </div>
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
      
      <td>
        <div className="d-flex gap-1">
          {!task.assignedTo && (
            <Badge bg="warning" className="small">Sin responsable</Badge>
          )}
          {!task.functional && (
            <Badge bg="warning" className="small">Sin funcional</Badge>
          )}
          {!task.sprints && task.stage !== TaskStage.BACKLOG && (
            <Badge bg="danger" className="small">Sin estimación</Badge>
          )}
        </div>
      </td>
      
      <td>
        {actionButtons}
      </td>
    </tr>
  );
};

export default TaskItem; 