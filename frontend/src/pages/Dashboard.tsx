import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTasks, 
  faExclamationTriangle, 
  faCheck, 
  faHourglass,
  faClock,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  calculateDashboardMetrics, 
  getUpcomingDeadlines, 
  getHighLoadTeams,
  DashboardMetrics 
} from '../services/dashboardService';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<any[]>([]);
  const [highLoadTeams, setHighLoadTeams] = useState<any[]>([]);

  useEffect(() => {
    // Cargar métricas del dashboard
    const dashboardMetrics = calculateDashboardMetrics();
    setMetrics(dashboardMetrics);
    
    // Cargar fechas límite próximas
    setUpcomingDeadlines(getUpcomingDeadlines());
    
    // Cargar equipos con alta carga
    setHighLoadTeams(getHighLoadTeams());
  }, []);

  // Determina qué elementos mostrar según el rol
  const isNegocio = user?.role === UserRole.NEGOCIO;
  const isTecnologia = user?.role === UserRole.TECNOLOGIA;

  if (!metrics) {
    return <div className="d-flex justify-content-center p-4">Cargando métricas...</div>;
  }

  return (
    <div className="dashboard">
      <h1 className="mb-4">Dashboard</h1>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle text-muted">Total Tareas</h6>
                  <h2 className="mt-2 mb-0">{metrics.totalTasks}</h2>
                </div>
                <div className="dashboard-icon">
                  <FontAwesomeIcon icon={faTasks} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle text-muted">Pendientes</h6>
                  <h2 className="mt-2 mb-0">{metrics.pendingTasks}</h2>
                </div>
                <div className="dashboard-icon warning">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle text-muted">En Progreso</h6>
                  <h2 className="mt-2 mb-0">{metrics.inProgressTasks}</h2>
                </div>
                <div className="dashboard-icon info">
                  <FontAwesomeIcon icon={faHourglass} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="dashboard-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-subtitle text-muted">Completadas</h6>
                  <h2 className="mt-2 mb-0">{metrics.completedTasks}</h2>
                </div>
                <div className="dashboard-icon success">
                  <FontAwesomeIcon icon={faCheck} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        {isNegocio && (
          <Col md={6} className="mb-4">
            <Card>
              <Card.Header>
                <FontAwesomeIcon icon={faTasks} className="me-2" />
                Tareas por Departamento
              </Card.Header>
              <Card.Body>
                {metrics.departmentDistribution.length > 0 ? (
                  <div className="department-distribution">
                    {metrics.departmentDistribution.map((dept, index) => (
                      <div key={index} className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="department-name">{dept.department}</span>
                          <span className="badge bg-primary">{dept.count} tareas</span>
                        </div>
                        <ProgressBar 
                          now={dept.percentage} 
                          label={`${dept.percentage}%`}
                          variant={dept.percentage > 20 ? 'primary' : 'secondary'}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No hay datos de distribución disponibles.</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        )}
        
        {isTecnologia && (
          <Col md={6} className="mb-4">
            <Card>
              <Card.Header>
                <FontAwesomeIcon icon={faUsers} className="me-2" />
                Utilización de Equipos ({metrics.teamUtilization}% promedio)
              </Card.Header>
              <Card.Body className="p-0">
                {highLoadTeams.length > 0 ? (
                  <div className="team-utilization-scroll">
                    <div className="p-3">
                      {highLoadTeams.map((team, index) => (
                        <div key={team.id} className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="team-name">{team.name}</span>
                            <span className={`badge ${team.utilization > 100 ? 'bg-danger' : team.utilization > 80 ? 'bg-warning' : 'bg-success'}`}>
                              {team.utilization}%
                            </span>
                          </div>
                          <ProgressBar 
                            now={Math.min(team.utilization, 100)} 
                            variant={team.utilization > 100 ? 'danger' : team.utilization > 80 ? 'warning' : 'success'}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-3">
                    <p className="text-muted">No hay datos de equipos disponibles.</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        )}
        
        <Col md={isTecnologia || isNegocio ? 6 : 12} className="mb-4">
          <Card>
            <Card.Header>
              <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
              Alertas Críticas ({metrics.criticalAlerts})
            </Card.Header>
            <Card.Body>
              {metrics.alerts.length > 0 ? (
                <ul className="alert-list">
                  {metrics.alerts.map((alert) => (
                    <li key={alert.id} className="alert-item">
                      <span className="alert-icon">
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                      </span>
                      <span className="alert-text">{alert.message}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted text-center">
                  <FontAwesomeIcon icon={faCheck} className="me-2" />
                  No hay alertas críticas en este momento
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Fila adicional con información complementaria */}
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <FontAwesomeIcon icon={faClock} className="me-2" />
              Próximas Fechas Límite
            </Card.Header>
            <Card.Body>
              {upcomingDeadlines.length > 0 ? (
                <Table striped size="sm">
                  <thead>
                    <tr>
                      <th>Tarea</th>
                      <th>Departamento</th>
                      <th>Días Restantes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingDeadlines.slice(0, 5).map((task) => (
                      <tr key={task.id}>
                        <td>
                          <small className="text-muted">#{task.id}</small>
                          <br />
                          {task.subject}
                        </td>
                        <td>{task.department}</td>
                        <td>
                          <span className={`badge ${task.daysRemaining <= 2 ? 'bg-danger' : task.daysRemaining <= 5 ? 'bg-warning' : 'bg-info'}`}>
                            {task.daysRemaining} días
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted text-center">No hay fechas límite próximas</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>
              <FontAwesomeIcon icon={faUsers} className="me-2" />
              Estado de Equipos
            </Card.Header>
            <Card.Body>
              {highLoadTeams.length > 0 ? (
                <div className="team-status">
                  <div className="row text-center mb-3">
                    <div className="col-4">
                      <div className="status-metric">
                        <h4 className="text-success">
                          {highLoadTeams.filter(t => t.utilization < 80).length}
                        </h4>
                        <small className="text-muted">Disponibles</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="status-metric">
                        <h4 className="text-warning">
                          {highLoadTeams.filter(t => t.utilization >= 80 && t.utilization <= 100).length}
                        </h4>
                        <small className="text-muted">Alta Carga</small>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="status-metric">
                        <h4 className="text-danger">
                          {highLoadTeams.filter(t => t.utilization > 100).length}
                        </h4>
                        <small className="text-muted">Sobrecargados</small>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <small className="text-muted">
                      Utilización promedio global: <strong>{metrics.teamUtilization}%</strong>
                    </small>
                  </div>
                </div>
              ) : (
                <p className="text-muted text-center">No hay datos de equipos disponibles</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 