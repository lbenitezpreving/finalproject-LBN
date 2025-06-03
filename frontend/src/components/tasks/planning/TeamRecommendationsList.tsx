import React from 'react';
import { Card, Row, Col, Badge, Button, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faUsers, 
  faCalendarAlt,
  faChevronRight,
  faClock,
  faExternalLinkAlt,
  faHome
} from '@fortawesome/free-solid-svg-icons';
import { Task, TaskStage, TeamRecommendation } from '../../../types';

interface TeamRecommendationsListProps {
  recommendations: TeamRecommendation[];
  task: Task & { stage: TaskStage };
  onTeamSelect: (teamId: number) => void;
}

const TeamRecommendationsList: React.FC<TeamRecommendationsListProps> = ({
  recommendations,
  task,
  onTeamSelect
}) => {

  const getScoreClass = (score: number): string => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    if (score >= 40) return 'score-fair';
    return 'score-poor';
  };

  const getScoreText = (score: number): string => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Buena';
    if (score >= 40) return 'Regular';
    return 'Baja';
  };

  const renderAffinityStars = (affinity: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FontAwesomeIcon
        key={i}
        icon={faStar}
        className={i < affinity ? 'affinity-stars' : 'text-muted'}
      />
    ));
  };

  const getCapacityColor = (currentLoad: number, capacity: number): string => {
    const utilization = (currentLoad / capacity) * 100;
    if (utilization >= 100) return 'capacity-danger';
    if (utilization >= 80) return 'capacity-warning';
    return 'capacity-available';
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const isExternalTeam = (teamName: string): boolean => {
    return teamName.toLowerCase().includes('externo');
  };

  const getRecommendationReason = (recommendation: TeamRecommendation): string => {
    const reasons: string[] = [];
    
    if (recommendation.affinity >= 4) {
      reasons.push('Alta afinidad con el departamento');
    }
    
    if (recommendation.availableCapacity >= 1) {
      reasons.push('Capacidad disponible inmediata');
    } else if (recommendation.availableCapacity > 0) {
      reasons.push('Capacidad parcial disponible');
    }
    
    const daysUntilStart = Math.ceil(
      (new Date(recommendation.possibleStartDate).getTime() - new Date().getTime()) / (24 * 60 * 60 * 1000)
    );
    
    if (daysUntilStart <= 7) {
      reasons.push('Puede iniciar pronto');
    }
    
    if (!isExternalTeam(recommendation.teamName)) {
      reasons.push('Equipo interno');
    }
    
    return reasons.length > 0 ? reasons.join(', ') : 'Disponible para asignación';
  };

  if (recommendations.length === 0) {
    return (
      <div className="text-center py-4">
        <FontAwesomeIcon icon={faUsers} size="3x" className="text-muted mb-3" />
        <h5 className="text-muted">No hay equipos disponibles</h5>
        <p className="text-muted">
          No se encontraron equipos que puedan abordar esta tarea en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="recommendations-container">
      <Row className="g-3">
        {recommendations.map((recommendation, index) => (
          <Col lg={6} key={recommendation.teamId}>
            <Card 
              className="recommendation-card h-100"
              onClick={() => onTeamSelect(recommendation.teamId)}
            >
              <Card.Header>
                <Row className="align-items-center">
                  <Col>
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon 
                        icon={isExternalTeam(recommendation.teamName) ? faExternalLinkAlt : faHome} 
                        className="me-2" 
                      />
                      <h6 className="mb-0">{recommendation.teamName}</h6>
                      <Badge 
                        bg={isExternalTeam(recommendation.teamName) ? 'purple' : 'success'}
                        className="ms-2"
                      >
                        {isExternalTeam(recommendation.teamName) ? 'Externo' : 'Interno'}
                      </Badge>
                    </div>
                  </Col>
                  <Col xs="auto">
                    <div className="text-center">
                      <div className={`recommendation-score ${getScoreClass(recommendation.score)}`}>
                        {recommendation.score}
                      </div>
                      <small className="text-muted d-block">
                        {getScoreText(recommendation.score)}
                      </small>
                    </div>
                  </Col>
                </Row>
              </Card.Header>
              
              <Card.Body>
                {/* Ranking position */}
                <div className="d-flex align-items-center mb-3">
                  <Badge bg="primary" className="me-2">#{index + 1}</Badge>
                  <small className="text-muted">Recomendación</small>
                </div>

                {/* Afinidad */}
                <div className="mb-3">
                  <Row className="align-items-center">
                    <Col sm={4}>
                      <small className="text-muted">Afinidad:</small>
                    </Col>
                    <Col sm={8}>
                      <div className="d-flex align-items-center">
                        {renderAffinityStars(recommendation.affinity)}
                        <small className="ms-2 text-muted">
                          ({recommendation.affinity}/5)
                        </small>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Capacidad */}
                <div className="mb-3">
                  <Row className="align-items-center">
                    <Col sm={4}>
                      <small className="text-muted">Capacidad:</small>
                    </Col>
                    <Col sm={8}>
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small>
                            {recommendation.currentLoad.toFixed(1)}/2.0 utilizada
                          </small>
                          <small className="text-muted">
                            {Math.round((recommendation.currentLoad / 2) * 100)}%
                          </small>
                        </div>
                        <ProgressBar 
                          now={(recommendation.currentLoad / 2) * 100}
                          variant={
                            recommendation.currentLoad >= 2 ? 'danger' :
                            recommendation.currentLoad >= 1.6 ? 'warning' : 'success'
                          }
                          style={{ height: '6px' }}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Fechas posibles */}
                <div className="mb-3">
                  <Row>
                    <Col sm={6}>
                      <small className="text-muted d-block">Inicio posible:</small>
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-1 text-primary" />
                        <small><strong>{formatDate(recommendation.possibleStartDate)}</strong></small>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <small className="text-muted d-block">Fin estimado:</small>
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon icon={faClock} className="me-1 text-primary" />
                        <small><strong>{formatDate(recommendation.possibleEndDate)}</strong></small>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Razón de recomendación */}
                <div className="mb-3">
                  <small className="text-muted d-block mb-1">¿Por qué se recomienda?</small>
                  <small className="text-primary">
                    {getRecommendationReason(recommendation)}
                  </small>
                </div>

                {/* Disponibilidad inmediata */}
                {recommendation.availableCapacity > 0 && (
                  <Badge bg="success" className="mb-2">
                    <FontAwesomeIcon icon={faUsers} className="me-1" />
                    Disponibilidad inmediata
                  </Badge>
                )}
              </Card.Body>

              <Card.Footer className="bg-transparent">
                <Button 
                  variant="primary" 
                  className="w-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTeamSelect(recommendation.teamId);
                  }}
                >
                  Seleccionar Equipo
                  <FontAwesomeIcon icon={faChevronRight} className="ms-2" />
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TeamRecommendationsList; 