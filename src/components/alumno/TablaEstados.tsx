import React, { useState } from "react";
import { Row, Col, Tab, Nav } from "react-bootstrap";
import MateriasPorAnio from "./MateriasPorAnio";
import Examenes from "./Examenes/Examenes";
import { Materia, MesaDisponible, InscripcionExamen } from "../../types/alumnoTypes";

interface TablaEstadosProps {
  materias: Materia[]; // Materias del alumno
  mesasDisponibles: MesaDisponible[]; // Mesas disponibles para inscripción
  inscripciones: InscripcionExamen[]; // Inscripciones del alumno
  onInscripcionActualizada: () => Promise<void>; // Función para actualizar las inscripciones
}

const TablaEstados: React.FC<TablaEstadosProps> = ({
  materias, // Materias del alumno
  mesasDisponibles, // Mesas disponibles para inscripción
  inscripciones, // Inscripciones del alumno
  onInscripcionActualizada, // Función para actualizar las inscripciones
}) => {
  const [activeTab, setActiveTab] = useState<string>("materias"); // Estado del tab activo

  return (
    <Row>
      <Col>
        <Tab.Container
          id="student-tabs" 
          activeKey={activeTab} // Tab activo
          onSelect={(k) => k && setActiveTab(k)} // Función para cambiar el tab activo
        >
          <Nav variant="pills" fill className="mb-3">
            <Nav.Item>
              <Nav.Link
                eventKey="materias"
                className="d-flex align-items-center"
              >
                <i className="bi bi-book me-2"></i>
                Estado de Materias
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="examenes"
                className="d-flex align-items-center"
              >
                <i className="bi bi-pencil me-2"></i>
                Inscripción a Exámenes
                {inscripciones.length > 0 && (
                  <span className="badge bg-danger rounded-pill ms-2">
                    {inscripciones.length}
                  </span>
                )}
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            <Tab.Pane eventKey="materias">
              <MateriasPorAnio materias={materias} />
            </Tab.Pane>
            <Tab.Pane eventKey="examenes">
              <Examenes
                mesasDisponibles={mesasDisponibles}
                inscripciones={inscripciones}
                onInscripcionActualizada={onInscripcionActualizada}
              />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Col>
    </Row>
  );
};

export default TablaEstados;
