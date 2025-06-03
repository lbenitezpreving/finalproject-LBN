import React from 'react';
import { Table, Pagination, Alert, Spinner, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSort, 
  faSortUp, 
  faSortDown,
  faCalculator
} from '@fortawesome/free-solid-svg-icons';
import { Task, TaskStage, PaginationInfo, SortConfig } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import TaskItem from './TaskItem';

interface TaskTableProps {
  tasks: (Task & { stage: TaskStage })[];
  loading?: boolean;
  error?: string;
  pagination?: PaginationInfo;
  sort?: SortConfig;
  onTaskClick?: (task: Task & { stage: TaskStage }) => void;
  onPageChange?: (page: number) => void;
  onSortChange?: (field: string) => void;
  onEstimateTask?: (task: Task & { stage: TaskStage }) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  loading = false,
  error,
  pagination,
  sort,
  onTaskClick,
  onPageChange,
  onSortChange,
  onEstimateTask
}) => {
  const { user } = useAuth();

  const getSortIcon = (field: string) => {
    if (!sort || sort.field !== field) {
      return faSort;
    }
    return sort.direction === 'asc' ? faSortUp : faSortDown;
  };
  
  const handleSort = (field: string) => {
    if (onSortChange) {
      onSortChange(field);
    }
  };

  const canEstimate = (task: Task & { stage: TaskStage }): boolean => {
    return user?.role === UserRole.TECNOLOGIA && task.stage === TaskStage.PENDING_PLANNING;
  };

  const renderActionButtons = (task: Task & { stage: TaskStage }) => {
    return (
      <div className="d-flex gap-1">
        {canEstimate(task) && (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEstimateTask?.(task);
            }}
            title="Estimar tarea"
          >
            <FontAwesomeIcon icon={faCalculator} />
          </Button>
        )}
      </div>
    );
  };

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;
    
    const items = [];
    const { currentPage, totalPages } = pagination;
    
    // Botón anterior
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={currentPage === 1}
        onClick={() => onPageChange && onPageChange(currentPage - 1)}
      />
    );
    
    // Páginas
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
      items.push(<Pagination.Item key={1} onClick={() => onPageChange && onPageChange(1)}>1</Pagination.Item>);
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="ellipsis1" />);
      }
    }
    
    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange && onPageChange(page)}
        >
          {page}
        </Pagination.Item>
      );
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="ellipsis2" />);
      }
      items.push(
        <Pagination.Item 
          key={totalPages} 
          onClick={() => onPageChange && onPageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }
    
    // Botón siguiente
    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange && onPageChange(currentPage + 1)}
      />
    );
    
    return (
      <div className="d-flex justify-content-center mt-3">
        <Pagination>{items}</Pagination>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <div className="mt-2">Cargando tareas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        {error}
      </Alert>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Alert variant="info" className="m-3">
        No se encontraron tareas que coincidan con los criterios de búsqueda.
      </Alert>
    );
  }

  return (
    <div className="task-table">
      <div className="table-responsive">
        <Table hover striped>
          <thead className="table-dark">
            <tr>
              <th 
                style={{ cursor: onSortChange ? 'pointer' : 'default' }}
                onClick={() => handleSort('stage')}
              >
                Estado
                {onSortChange && (
                  <FontAwesomeIcon 
                    icon={getSortIcon('stage')} 
                    className="ms-1" 
                  />
                )}
              </th>
              <th 
                style={{ cursor: onSortChange ? 'pointer' : 'default' }}
                onClick={() => handleSort('id')}
              >
                ID / Departamento
                {onSortChange && (
                  <FontAwesomeIcon 
                    icon={getSortIcon('id')} 
                    className="ms-1" 
                  />
                )}
              </th>
              <th 
                style={{ cursor: onSortChange ? 'pointer' : 'default' }}
                onClick={() => handleSort('subject')}
              >
                Tarea
                {onSortChange && (
                  <FontAwesomeIcon 
                    icon={getSortIcon('subject')} 
                    className="ms-1" 
                  />
                )}
              </th>
              <th 
                style={{ cursor: onSortChange ? 'pointer' : 'default' }}
                onClick={() => handleSort('priority')}
              >
                Prioridad
                {onSortChange && (
                  <FontAwesomeIcon 
                    icon={getSortIcon('priority')} 
                    className="ms-1" 
                  />
                )}
              </th>
              <th>Responsable</th>
              <th>Equipo</th>
              <th>Estimación</th>
              <th>Fechas</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onClick={onTaskClick}
                actionButtons={renderActionButtons(task)}
              />
            ))}
          </tbody>
        </Table>
      </div>
      
      {renderPagination()}
    </div>
  );
};

export default TaskTable; 