import React from 'react';
import { Card, Badge, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

interface TeamLegendItem {
  teamName: string;
  color: string;
  taskCount: number;
}

interface GanttTeamLegendProps {
  teams: TeamLegendItem[];
}

const GanttTeamLegend: React.FC<GanttTeamLegendProps> = ({ teams }) => {
  if (teams.length === 0) {
    return null;
  }

  return (
    <Card className="mb-3">
      <Card.Header>
        <h6 className="mb-0">
          <FontAwesomeIcon icon={faSquare} className="me-2" />
          Leyenda de Equipos
        </h6>
      </Card.Header>
      <Card.Body className="py-2">
        <Row>
          {teams.map((team, index) => (
            <Col key={team.teamName} xs={6} md={4} lg={3} className="mb-2">
              <div className="d-flex align-items-center">
                <FontAwesomeIcon 
                  icon={faSquare} 
                  style={{ color: team.color }} 
                  className="me-2"
                />
                <span className="small me-2">{team.teamName}</span>
                <Badge bg="secondary" className="small">
                  {team.taskCount}
                </Badge>
              </div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default GanttTeamLegend; 