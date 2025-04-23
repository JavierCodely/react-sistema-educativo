import React from "react";
import { Card } from "react-bootstrap";

const Horarios = () => (
  <Card className="mb-4 shadow-sm">
    <Card.Body>
      <Card.Title>
        <i className="bi bi-clock me-2"></i> Horarios
      </Card.Title>
      <p className="text-muted">
        Aca aparecerán tus horarios de cursada. Próximamente disponible.
      </p>
    </Card.Body>
  </Card>
);
export default Horarios;
