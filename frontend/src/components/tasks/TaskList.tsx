import React, { useState, useEffect, useCallback } from 'react';
import { Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Task, TaskStage, TaskFilters, PaginationInfo, SortConfig } from '../../types';
import { TaskService } from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import { useUrlParams } from '../../hooks/useUrlParams';
import TaskFilterPanel from './TaskFilterPanel';
import TaskTable from './TaskTable';
import TaskEstimationModal from './estimation/TaskEstimationModal';
import './TaskList.css';

const TaskList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getFiltersFromUrl, updateUrlFromFilters, clearFilters, getActiveFiltersCount } = useUrlParams();
  
  // Estados principales
  const [tasks, setTasks] = useState<(Task & { stage: TaskStage })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0
  });
  
  // Estados de filtros y ordenamiento
  const [filters, setFilters] = useState<TaskFilters>({});
  const [sort, setSort] = useState<SortConfig>({ field: 'id', direction: 'desc' });
  
  // Estados del modal de estimación
  const [showEstimationModal, setShowEstimationModal] = useState(false);
  const [selectedTaskForEstimation, setSelectedTaskForEstimation] = useState<(Task & { stage: TaskStage }) | null>(null);
  
  // Cargar filtros desde URL al montar el componente
  useEffect(() => {
    const urlFilters = getFiltersFromUrl();
    setFilters(urlFilters);
  }, [getFiltersFromUrl]);
  
  // Función para cargar tareas
  const loadTasks = useCallback(async (
    currentFilters: TaskFilters = filters,
    currentPagination: { page: number; pageSize: number } = { page: pagination.currentPage, pageSize: pagination.pageSize },
    currentSort: SortConfig = sort
  ) => {
    try {
      setLoading(true);
      setError(undefined);
      
      const response = await TaskService.getTasks(
        currentFilters,
        currentPagination,
        undefined, // search params - se implementará en US-08-03
        currentSort,
        user?.role,
        user?.department
      );
      
      setTasks(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError('Error al cargar las tareas. Por favor, inténtelo de nuevo.');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.pageSize, sort, user?.role, user?.department]);
  
  // Cargar tareas cuando cambien los filtros, paginación o ordenamiento
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);
  
  // Manejar click en tarea para estimación
  const handleEstimateTask = useCallback((task: Task & { stage: TaskStage }) => {
    setSelectedTaskForEstimation(task);
    setShowEstimationModal(true);
  }, []);

  // Manejar click en tarea para planificación
  const handlePlanTask = useCallback((task: Task & { stage: TaskStage }) => {
    navigate(`/tasks/${task.id}/plan`);
  }, [navigate]);

  // Manejar guardado de estimación
  const handleSaveEstimation = useCallback(async (taskId: number, sprints: number, loadFactor: number) => {
    try {
      await TaskService.updateTaskEstimation(taskId, sprints, loadFactor);
      
      // Recargar las tareas para mostrar los cambios
      await loadTasks();
      
      // Mostrar mensaje de éxito
      setError(undefined);
    } catch (err) {
      console.error('Error updating task estimation:', err);
      throw err; // Re-lanzar para que el modal lo maneje
    }
  }, [loadTasks]);

  // Cerrar modal de estimación
  const handleCloseEstimationModal = useCallback(() => {
    setShowEstimationModal(false);
    setSelectedTaskForEstimation(null);
  }, []);
  
  // Manejar cambios en filtros
  const handleFiltersChange = useCallback((newFilters: TaskFilters) => {
    setFilters(newFilters);
    updateUrlFromFilters(newFilters);
    // Resetear a la primera página cuando cambien los filtros
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, [updateUrlFromFilters]);
  
  // Manejar limpieza de filtros
  const handleClearFilters = useCallback(() => {
    const emptyFilters: TaskFilters = {};
    setFilters(emptyFilters);
    clearFilters();
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, [clearFilters]);
  
  // Manejar cambio de página
  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  }, []);
  
  // Manejar cambio de ordenamiento
  const handleSortChange = useCallback((field: string) => {
    setSort(prevSort => ({
      field,
      direction: prevSort.field === field && prevSort.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);
  
  // Manejar click en tarea (para futuras funcionalidades)
  const handleTaskClick = useCallback((task: Task & { stage: TaskStage }) => {
    console.log('Task clicked:', task);
    // Aquí se puede implementar navegación a detalle de tarea
  }, []);
  
  // Contar filtros activos
  const activeFiltersCount = getActiveFiltersCount(filters);
  
  // Calcular estadísticas para mostrar
  const getFilteredStats = () => {
    const total = pagination.totalItems;
    const showing = tasks.length;
    const page = pagination.currentPage;
    const pageSize = pagination.pageSize;
    const startItem = (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, total);
    
    return {
      total,
      showing,
      startItem,
      endItem,
      hasFilters: activeFiltersCount > 0
    };
  };
  
  const stats = getFilteredStats();
  
  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error al cargar las tareas</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }
  
  return (
    <div className="task-list">
      {/* Panel de filtros expandible */}
      <TaskFilterPanel
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        activeFiltersCount={activeFiltersCount}
        userRole={user?.role}
        userDepartment={user?.department}
        loading={loading}
      />
      
      {/* Tarjeta principal con tabla */}
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">
                Gestión de Tareas
                {stats.total > 0 && (
                  <span className="text-muted ms-2">
                    ({stats.hasFilters ? `${stats.showing} de ${stats.total}` : `${stats.total}`} tareas)
                  </span>
                )}
              </h5>
              {stats.hasFilters && stats.total > 0 && (
                <small className="text-muted">
                  Mostrando {stats.startItem}-{stats.endItem} de {stats.total} resultados
                  {activeFiltersCount > 0 && ` con ${activeFiltersCount} filtro${activeFiltersCount !== 1 ? 's' : ''} aplicado${activeFiltersCount !== 1 ? 's' : ''}`}
                </small>
              )}
            </Col>
          </Row>
        </Card.Header>
        
        <Card.Body className="p-0">
          <TaskTable
            tasks={tasks}
            loading={loading}
            error={error}
            pagination={pagination}
            sort={sort}
            onTaskClick={handleTaskClick}
            onPageChange={handlePageChange}
            onSortChange={handleSortChange}
            onEstimateTask={handleEstimateTask}
            onPlanTask={handlePlanTask}
          />
        </Card.Body>
      </Card>

      {/* Modal de estimación */}
      <TaskEstimationModal
        show={showEstimationModal}
        task={selectedTaskForEstimation}
        onHide={handleCloseEstimationModal}
        onSave={handleSaveEstimation}
      />
    </div>
  );
};

export default TaskList; 