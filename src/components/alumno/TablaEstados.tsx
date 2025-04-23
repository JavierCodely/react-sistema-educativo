import React, { useState } from "react";
import { Row, Col, Tab, Nav } from "react-bootstrap";
import MateriasPorAnio from "./MateriasPorAnio";
import Examenes from "./Examenes";
import { Materia, MesaDisponible, InscripcionExamen } from "../../types/alumnoTypes";

interface TablaEstadosProps {
  materias: Materia[];
  mesasDisponibles: MesaDisponible[];
  inscripciones: InscripcionExamen[];
  onInscripcionActualizada: () => Promise<void>;
}

const TablaEstados: React.FC<TablaEstadosProps> = ({
  materias,
  mesasDisponibles,
  inscripciones,
  onInscripcionActualizada,
}) => {
  const [activeTab, setActiveTab] = useState<string>("materias");

  return (
    <Row>
      <Col>
        <Tab.Container
          id="student-tabs"
          activeKey={activeTab}
          onSelect={(k) => k && setActiveTab(k)}
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
