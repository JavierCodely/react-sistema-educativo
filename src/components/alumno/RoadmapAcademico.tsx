import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Modal, Button, Badge } from 'react-bootstrap';
import { 
  getMaterias, 
  getPlanEstudio, 
  getMateriaConCorrelativas,
  getEstadoCursabilidad
} from '../../services/api/alumno/alumnosService';
import { 
  Materia, 
  EstadoMateria, 
  PlanEstudio, 
  RequisitosMateria
} from '../../types/alumnoTypes';

// Componente para mostrar el estado de la materia
const EstadoBadge = ({ estado }) => {
  const getVariant = () => {
    switch (estado) {
      case EstadoMateria.PROMOCION:
        return 'success';
      case EstadoMateria.REGULAR:
        return 'primary';
      case EstadoMateria.CURSANDO:
        return 'info';
      case EstadoMateria.LIBRE:
        return 'warning';
      case EstadoMateria.FALTA_CORRELATIVA:
        return 'danger';
      case EstadoMateria.NO_CURSADO:
      default:
        return 'secondary';
    }
  };

  return <Badge bg={getVariant()}>{estado}</Badge>;
};

// Componente para renderizar una materia en el roadmap
const MateriaCard = ({ materia, onClick }) => {
  const getBorderColor = () => {
    switch (materia.estado) {
      case EstadoMateria.PROMOCION:
        return 'success';
      case EstadoMateria.REGULAR:
        return 'primary';
      case EstadoMateria.CURSANDO:
        return 'info';
      case EstadoMateria.LIBRE:
        return 'warning';
      case EstadoMateria.FALTA_CORRELATIVA:
        return 'danger';
      case EstadoMateria.NO_CURSADO:
      default:
        return 'secondary';
    }
  };

  return (
    <Card 
      className="mb-3 materia-card" 
      border={getBorderColor()}
      onClick={() => onClick(materia.id)}
      style={{ cursor: 'pointer' }}
    >
      <Card.Header className="d-flex justify-content-between align-items-center">
        <small>{materia.codigo}</small>
        <EstadoBadge estado={materia.estado} />
      </Card.Header>
      <Card.Body>
        <Card.Title>{materia.nombre}</Card.Title>
      </Card.Body>
    </Card>
  );
};

// Componente principal del Roadmap
const RoadmapAcademico = () => {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [planEstudio, setPlanEstudio] = useState<PlanEstudio | null>(null);
  const [selectedMateria, setSelectedMateria] = useState<string | null>(null);
  const [materiaDetails, setMateriaDetails] = useState<{
    materia?: Materia;
    correlativas: Materia[];
    requisitos?: RequisitosMateria;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materiasData, planData] = await Promise.all([
          getMaterias(),
          getPlanEstudio()
        ]);
        setMaterias(materiasData);
        setPlanEstudio(planData);
      } catch (error) {
        console.error('Error al cargar datos para el roadmap:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMateriaClick = async (materiaId: string) => {
    setSelectedMateria(materiaId);
    try {
      const details = await getMateriaConCorrelativas(materiaId);
      setMateriaDetails(details);
      setShowModal(true);
    } catch (error) {
      console.error(`Error al obtener detalles de la materia ${materiaId}:`, error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMateria(null);
    setMateriaDetails(null);
  };

  // Renderizar las materias según el plan de estudio
  const renderMaterias = (anio: number, cuatrimestre: number) => {
    if (!planEstudio) return null;

    const anioPlan = planEstudio.anios.find(a => a.anio === anio);
    if (!anioPlan) return null;

    const cuatrimestrePlan = anioPlan.cuatrimestres.find(c => c.cuatrimestre === cuatrimestre);
    if (!cuatrimestrePlan) return null;

    return cuatrimestrePlan.materias.map(materiaId => {
      const materia = materias.find(m => m.id === materiaId);
      if (!materia) return null;

      return (
        <Col md={6} lg={4} key={materia.id}>
          <MateriaCard materia={materia} onClick={handleMateriaClick} />
        </Col>
      );
    });
  };

  // Renderizar el modal de detalles de la materia
  const renderMateriaModal = () => {
    if (!materiaDetails || !materiaDetails.materia) return null;

    const { materia, correlativas, requisitos } = materiaDetails;
    const estadoCursabilidad = getEstadoCursabilidad(materia, materias);

    return (
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {materia.nombre} <EstadoBadge estado={materia.estado} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Información General</h5>
          <p>
            <strong>Código:</strong> {materia.codigo}<br />
            <strong>Año:</strong> {materia.anio}<br />
            <strong>Estado:</strong> {materia.estado}
          </p>

          <h5>Correlativas</h5>
          {correlativas.length > 0 ? (
            <Row>
              {correlativas.map(correlativa => (
                <Col md={6} key={correlativa.id}>
                  <Card className="mb-2" border={
                    correlativa.estado === EstadoMateria.PROMOCION || 
                    correlativa.estado === EstadoMateria.REGULAR ? 'success' : 'danger'
                  }>
                    <Card.Body>
                      <Card.Title>{correlativa.nombre}</Card.Title>
                      <EstadoBadge estado={correlativa.estado} />
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <p>Esta materia no tiene correlativas.</p>
          )}

          {estadoCursabilidad.correlativasFaltantes.length > 0 && (
            <div className="alert alert-danger mt-2">
              <h6>Correlativas pendientes:</h6>
              <ul>
                {estadoCursabilidad.correlativasFaltantes.map(materia => (
                  <li key={materia.id}>{materia.nombre} - {materia.estado}</li>
                ))}
              </ul>
            </div>
          )}

          {requisitos && (
            <>
              <h5 className="mt-4">Requisitos para Promocionar</h5>
              {requisitos.requisitosPromocion.length > 0 ? (
                <>
                  <ul>
                    {requisitos.requisitosPromocion.map(reqId => {
                      const reqMateria = materias.find(m => m.id === reqId);
                      return reqMateria ? (
                        <li key={reqId}>
                          {reqMateria.nombre} <EstadoBadge estado={reqMateria.estado} />
                        </li>
                      ) : null;
                    })}
                  </ul>
                  {requisitos.descripcionPromocion && (
                    <p>{requisitos.descripcionPromocion}</p>
                  )}
                </>
              ) : (
                <p>No hay requisitos específicos para promocionar esta materia.</p>
              )}

              <h5 className="mt-4">Requisitos para Rendir Final</h5>
              {requisitos.requisitosFinales.length > 0 ? (
                <>
                  <ul>
                    {requisitos.requisitosFinales.map(reqId => {
                      const reqMateria = materias.find(m => m.id === reqId);
                      return reqMateria ? (
                        <li key={reqId}>
                          {reqMateria.nombre} <EstadoBadge estado={reqMateria.estado} />
                        </li>
                      ) : null;
                    })}
                  </ul>
                  {requisitos.descripcionFinal && (
                    <p>{requisitos.descripcionFinal}</p>
                  )}
                </>
              ) : (
                <p>No hay requisitos específicos para rendir el final de esta materia.</p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  if (loading) {
    return <div className="text-center p-5">Cargando plan de estudio...</div>;
  }

  return (
    <div className="roadmap-container">
      <h2 className="text-center mb-4">Plan de Estudio</h2>
      
      {planEstudio?.anios.map(anio => (
        <div key={anio.anio} className="mb-5">
          <h3 className="text-center mb-3">Año {anio.anio}</h3>
          
          {anio.cuatrimestres.map(cuatrimestre => (
            <div key={`${anio.anio}-${cuatrimestre.cuatrimestre}`} className="mb-4">
              <h4 className="text-center mb-3">{cuatrimestre.cuatrimestre}° Cuatrimestre</h4>
              <Row>
                {renderMaterias(anio.anio, cuatrimestre.cuatrimestre)}
              </Row>
            </div>
          ))}
        </div>
      ))}

      {renderMateriaModal()}
    </div>
  );
};

export default RoadmapAcademico;