import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTasks, 
  faCalendarAlt, 
  faUsers, 
  faBuilding 
} from '@fortawesome/free-solid-svg-icons';
import { GanttFilters, GanttService } from '../../services/ganttService';
import { TaskStatus } from '../../types';

interface GanttStatsProps {
  filters: GanttFilters;
  tasksCount: number;
}

interface StatsData {
  totalTasks: number;
  tasksByStatus: Record<TaskStatus, number>;
  tasksByTeam: Record<string, number>;
  tasksByDepartment: Record<string, number>;
  timeRange: { start: Date; end: Date } | null;
}

const GanttStats: React.FC<GanttStatsProps> = ({ filters, tasksCount }) => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [filters]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const statsData = await GanttService.getGanttStats(filters);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateRange = (timeRange: { start: Date; end: Date } | null): string => {
    if (!timeRange) return 'Sin datos';
    
    const startStr = timeRange.start.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
    const endStr = timeRange.end.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
    
    return `${startStr} - ${endStr}`;
  };

  const getStatusLabel = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.BACKLOG:
        return 'Backlog';
      case TaskStatus.TODO:
        return 'To Do';
      case TaskStatus.DOING:
        return 'En Progreso';
      case TaskStatus.DEMO:
        return 'Demo';
      case TaskStatus.DONE:
        return 'Completadas';
      default:
        return status;
    }
  };

  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.BACKLOG:
        return 'secondary';
      case TaskStatus.TODO:
        return 'warning';
      case TaskStatus.DOING:
        return 'primary';
      case TaskStatus.DEMO:
        return 'info';
      case TaskStatus.DONE:
        return 'success';
      default:
        return 'light';
    }
  };

  if (loading) {
    return (
      <Card>
        <Card.Body>
          <div className="text-center">
            <Spinner animation="border" size="sm" />
            <p className="mt-2 mb-0">Cargando estadísticas...</p>
          </div>
        </Card.Body>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <Card.Body>
          <p className="text-muted mb-0">No se pudieron cargar las estadísticas.</p>
        </Card.Body>
      </Card>
    );
  }

  // Obtener los top 3 equipos y departamentos
  const topTeams = Object.entries(stats.tasksByTeam)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const topDepartments = Object.entries(stats.tasksByDepartment)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <Row>
      {/* Estadísticas principales */}
      <Col md={6} lg={3} className="mb-3">
        <Card className="h-100">
          <Card.Body className="d-flex align-items-center">
            <div className="flex-shrink-0">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                   style={{ width: '3rem', height: '3rem' }}>
                <FontAwesomeIcon icon={faTasks} />
              </div>
            </div>
            <div className="flex-grow-1 ms-3">
              <div className="fw-bold h4 mb-0">{stats.totalTasks}</div>
              <div className="text-muted small">Tareas Planificadas</div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} lg={3} className="mb-3">
        <Card className="h-100">
          <Card.Body className="d-flex align-items-center">
            <div className="flex-shrink-0">
              <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center" 
                   style={{ width: '3rem', height: '3rem' }}>
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
            </div>
            <div className="flex-grow-1 ms-3">
              <div className="fw-bold small mb-0">{formatDateRange(stats.timeRange)}</div>
              <div className="text-muted small">Rango Temporal</div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} lg={3} className="mb-3">
        <Card className="h-100">
          <Card.Body className="d-flex align-items-center">
            <div className="flex-shrink-0">
              <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" 
                   style={{ width: '3rem', height: '3rem' }}>
                <FontAwesomeIcon icon={faUsers} />
              </div>
            </div>
            <div className="flex-grow-1 ms-3">
              <div className="fw-bold h4 mb-0">{Object.keys(stats.tasksByTeam).length}</div>
              <div className="text-muted small">Equipos Activos</div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col md={6} lg={3} className="mb-3">
        <Card className="h-100">
          <Card.Body className="d-flex align-items-center">
            <div className="flex-shrink-0">
              <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center" 
                   style={{ width: '3rem', height: '3rem' }}>
                <FontAwesomeIcon icon={faBuilding} />
              </div>
            </div>
            <div className="flex-grow-1 ms-3">
              <div className="fw-bold h4 mb-0">{Object.keys(stats.tasksByDepartment).length}</div>
              <div className="text-muted small">Departamentos</div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* Distribución por estado */}
      <Col lg={4} className="mb-3">
        <Card className="h-100">
          <Card.Header>
            <h6 className="mb-0">Distribución por Estado</h6>
          </Card.Header>
          <Card.Body>
            {Object.entries(stats.tasksByStatus).map(([status, count]) => {
              if (count === 0) return null;
              const statusEnum = status as TaskStatus;
              return (
                <div key={status} className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    <div 
                      className={`bg-${getStatusColor(statusEnum)} rounded me-2`}
                      style={{ width: '12px', height: '12px' }}
                    ></div>
                    <span className="small">{getStatusLabel(statusEnum)}</span>
                  </div>
                  <span className="fw-bold">{count}</span>
                </div>
              );
            })}
          </Card.Body>
        </Card>
      </Col>

      {/* Top equipos */}
      <Col lg={4} className="mb-3">
        <Card className="h-100">
          <Card.Header>
            <h6 className="mb-0">Top Equipos</h6>
          </Card.Header>
          <Card.Body>
            {topTeams.length > 0 ? (
              topTeams.map(([team, count], index) => (
                <div key={team} className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    <span className={`badge bg-${index === 0 ? 'primary' : index === 1 ? 'secondary' : 'light'} me-2`}>
                      {index + 1}
                    </span>
                    <span className="small">{team}</span>
                  </div>
                  <span className="fw-bold">{count}</span>
                </div>
              ))
            ) : (
              <p className="text-muted small mb-0">No hay datos disponibles</p>
            )}
          </Card.Body>
        </Card>
      </Col>

      {/* Top departamentos */}
      <Col lg={4} className="mb-3">
        <Card className="h-100">
          <Card.Header>
            <h6 className="mb-0">Top Departamentos</h6>
          </Card.Header>
          <Card.Body>
            {topDepartments.length > 0 ? (
              topDepartments.map(([department, count], index) => (
                <div key={department} className="d-flex justify-content-between align-items-center mb-2">
                  <div className="d-flex align-items-center">
                    <span className={`badge bg-${index === 0 ? 'primary' : index === 1 ? 'secondary' : 'light'} me-2`}>
                      {index + 1}
                    </span>
                    <span className="small">{department}</span>
                  </div>
                  <span className="fw-bold">{count}</span>
                </div>
              ))
            ) : (
              <p className="text-muted small mb-0">No hay datos disponibles</p>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default GanttStats; 