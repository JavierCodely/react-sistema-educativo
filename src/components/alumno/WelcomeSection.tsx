// src/components/WelcomeSection.tsx

import React from "react";
import { Card, Row, Col } from "react-bootstrap";

interface WelcomeSectionProps {
  nombreEstudiante: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  nombreEstudiante,
}) => {
  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <h2 className="mb-3">¡Bienvenido, {nombreEstudiante}!</h2>
        <p className="lead">
          En este panel podrás gestionar tu información académica.
        </p>

        <Row className="mt-4">
          <Col md={6} className="mb-3">
            <Card className="h-100 border-success">
              <Card.Body>
                <h5 className="card-title ">
                  <i className="bi bi-book me-2 text-success "></i>
                  Estado de Materias
                </h5>
                <p className="card-text">
                  Consulta el estado de tus materias, organizadas por año.
                  Verifica si están en estado regular, promoción, o si necesitas
                  cursar correlativas.
                </p>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} className="mb-3">
            <Card className="h-100 border-primary">
              <Card.Body>
                <h5 className="card-title">
                  <i className="bi bi-calendar-check me-2 text-primary"></i>
                  Inscripción a Exámenes
                </h5>
                <p className="card-text">
                  Inscríbete a exámenes finales o verifica tus inscripciones
                  actuales. Puedes elegir entre las diferentes mesas
                  disponibles.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default WelcomeSection;
