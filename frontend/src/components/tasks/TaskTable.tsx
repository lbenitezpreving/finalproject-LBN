import React from 'react';
import { Table, Pagination, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { Task, TaskStage, SortConfig, PaginationInfo } from '../../types';
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
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  loading = false,
  error,
  pagination,
  sort,
  onTaskClick,
  onPageChange,
  onSortChange
}) => {
  
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
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted">
          Mostrando {((currentPage - 1) * pagination.pageSize) + 1} - {Math.min(currentPage * pagination.pageSize, pagination.totalItems)} de {pagination.totalItems} tareas
        </div>
        <Pagination className="mb-0">
          {items}
        </Pagination>
      </div>
    );
  };
  
  if (error) {
    return (
      <Alert variant="danger">
        <strong>Error:</strong> {error}
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
              <th 
                style={{ cursor: onSortChange ? 'pointer' : 'default' }}
                onClick={() => handleSort('startDate')}
              >
                Fechas
                {onSortChange && (
                  <FontAwesomeIcon 
                    icon={getSortIcon('startDate')} 
                    className="ms-1" 
                  />
                )}
              </th>
              <th>Alertas</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </Spinner>
                  <div className="mt-2">Cargando tareas...</div>
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-4 text-muted">
                  No se encontraron tareas que coincidan con los criterios de búsqueda.
                </td>
              </tr>
            ) : (
              tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onClick={onTaskClick}
                />
              ))
            )}
          </tbody>
        </Table>
      </div>
      
      {renderPagination()}
    </div>
  );
};

export default TaskTable; 