import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Task, TaskStatus, TaskFilters, PaginationInfo, SortConfig } from '../../types';
import { TaskService } from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';
import { useUrlParams } from '../../hooks/useUrlParams';
import TaskFilterPanel from './TaskFilterPanel';
import TaskTable from './TaskTable';
import TaskEstimationModal from './estimation/TaskEstimationModal';
import './TaskList.css';
import TaskFiltersComponent from './TaskFilters';

const TaskList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getFiltersFromUrl, updateUrlFromFilters, clearFilters, getActiveFiltersCount } = useUrlParams();
  
  // Estados principales
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  
  // Estados de filtros y ordenamiento
  const [filters, setFilters] = useState<TaskFilters>({});
  const [sort, setSort] = useState<SortConfig>({ field: 'id', direction: 'desc' });
  
  // Estados del modal de estimación
  const [showEstimationModal, setShowEstimationModal] = useState(false);
  const [selectedTaskForEstimation, setSelectedTaskForEstimation] = useState<Task | null>(null);
  
  // Cargar filtros desde URL al montar el componente
  useEffect(() => {
    const urlFilters = getFiltersFromUrl();
    setFilters(urlFilters);
  }, [getFiltersFromUrl]);
  
  // Función para cargar tareas
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await TaskService.getTasks(
        filters,
        { page: 1, pageSize: 20 },
        undefined, // search
        sort,
        user?.role,
        user?.department
      );

      setTasks(result.data);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  };
  
  // Cargar tareas cuando cambien los filtros, paginación o ordenamiento
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);
  
  // Manejar click en tarea para estimación
  const handleEstimateTask = useCallback((task: Task) => {
    setSelectedTaskForEstimation(task);
    setShowEstimationModal(true);
  }, []);

  // Manejar click en tarea para planificación
  const handlePlanTask = useCallback((task: Task) => {
    navigate(`/tasks/${task.id}/plan`);
  }, [navigate]);

  // Manejar guardado de estimación
  const handleSaveEstimation = useCallback(async (taskId: number, sprints: number, loadFactor: number) => {
    try {
      await TaskService.updateTaskEstimation(taskId, sprints, loadFactor);
      // Recargar tareas para ver los cambios
      loadTasks();
    } catch (error) {
      throw error; // Re-lanzar para que el modal pueda manejar el error
    }
  }, []);

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
    setPagination(prev => prev ? { 
      currentPage: 1, 
      pageSize: prev.pageSize, 
      totalItems: prev.totalItems, 
      totalPages: prev.totalPages 
    } : null);
  }, [updateUrlFromFilters]);
  
  // Manejar limpieza de filtros
  const handleClearFilters = useCallback(() => {
    const emptyFilters: TaskFilters = {};
    setFilters(emptyFilters);
    clearFilters();
    setPagination(prev => prev ? { 
      currentPage: 1, 
      pageSize: prev.pageSize, 
      totalItems: prev.totalItems, 
      totalPages: prev.totalPages 
    } : null);
  }, [clearFilters]);
  
  // Manejar cambio de página
  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => prev ? { 
      currentPage: page, 
      pageSize: prev.pageSize, 
      totalItems: prev.totalItems, 
      totalPages: prev.totalPages 
    } : null);
  }, []);
  
  // Manejar cambio de ordenamiento
  const handleSortChange = useCallback((field: string) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);
  
  // Manejar click en tarea (para futuras funcionalidades)
  const handleTaskClick = useCallback((task: Task) => {
    console.log('Task clicked:', task.id);
    // Aquí se puede implementar navegación a detalle de tarea
  }, []);
  
  // Contar filtros activos
  const activeFiltersCount = getActiveFiltersCount(filters);
  
  // Calcular estadísticas para mostrar
  const getFilteredStats = () => {
    const total = pagination?.totalItems || 0;
    const showing = tasks.length;
    const page = pagination?.currentPage || 1;
    const pageSize = pagination?.pageSize || 10;
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
  
  // Filtros adaptados al rol del usuario
  const adaptedFilters = useMemo(() => {
    if (!user) return filters;
    
    const adapted = { ...filters };
    
    // Si es usuario de negocio, filtrar por su departamento
    if (user.role === 'NEGOCIO' && user.department) {
      adapted.department = user.department;
    }
    
    return adapted;
  }, [filters, user]);
  
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
        filters={adaptedFilters}
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
            error={error || undefined}
            pagination={pagination || undefined}
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