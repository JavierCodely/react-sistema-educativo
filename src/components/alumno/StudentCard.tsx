// src/components/StudentCard.tsx

import React from 'react';
import { Card } from 'react-bootstrap';
import { Estudiante } from '../../types/alumnoTypes';

interface StudentCardProps {
  estudiante: Estudiante;
}

const StudentCard: React.FC<StudentCardProps> = ({ estudiante }) => {
  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Card.Title className="mb-3">
          <i className="bi bi-person-circle me-2"></i>
          {estudiante.nombre} {estudiante.apellido}
        </Card.Title>
        <div className="d-flex flex-wrap">
          <div className="me-4 mb-3">
            <div className="text-muted small">Carrera</div>
            <div className="fw-bold">{estudiante.carrera}</div>
          </div>
          <div className="me-4 mb-3">
            <div className="text-muted small">Materias Aprobadas</div>
            <div className="fw-bold">{estudiante.materiasAprobadas}</div>
          </div>
          <div className="mb-3">
            <div className="text-muted small">Promedio</div>
            <div className="fw-bold">{estudiante.promedio.toFixed(2)}</div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StudentCard;