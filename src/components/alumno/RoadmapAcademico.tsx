import React, { useState, useEffect } from "react";
import { Row, Col, Card, Modal, Button, Badge } from "react-bootstrap";

//tipos de alumnos
import {
  Materia,
  EstadoMateria,
  PlanEstudio,
  RequisitosMateria,
} from "../../types/alumnoTypes";

//servicios de alumnos
import { MateriasService } from "../../services/api/alumno/materiasService";
import { PlanEstudioService } from "../../services/api/alumno/planEstudioService";
import { CursabilidadService } from "../../services/api/alumno/cursabilidadService";

// Componente para mostrar el estado de la materia
const EstadoBadge = ({ estado }) => {
  const getVariant = () => {
    switch (estado) {
      case EstadoMateria.PROMOCION:
        return "success";
      case EstadoMateria.REGULAR:
        return "primary";
      case EstadoMateria.CURSANDO:
        return "info";
      case EstadoMateria.LIBRE:
        return "warning";
      case EstadoMateria.FALTA_CORRELATIVA:
        return "danger";
      case EstadoMateria.NO_CURSADO:
      default:
        return "secondary";
    }
  };

  //renderizar el estado de la materia
  return <Badge bg={getVariant()}>{estado}</Badge>;
};

// Componente para renderizar una materia en el roadmap
const MateriaCard = ({ materia, onClick }) => {
  const getBorderColor = () => {
    switch (materia.estado) {
      case EstadoMateria.PROMOCION:
        return "success";
      case EstadoMateria.REGULAR:
        return "primary";
      case EstadoMateria.CURSANDO:
        return "info";
      case EstadoMateria.LIBRE:
        return "warning";
      case EstadoMateria.FALTA_CORRELATIVA:
        return "danger";
      case EstadoMateria.NO_CURSADO:
      default:
        return "secondary";
    }
  };

  //renderizar la materia en el roadmap
  return (
    //renderizar la materia en el roadmap
    <Card
      className="mb-3 materia-card"
      border={getBorderColor()}
      onClick={() => onClick(materia.id)}
      style={{ cursor: "pointer" }}
    >
      {/* renderizar el header de la materia */}
      <Card.Header className="d-flex justify-content-between align-items-center">
        {/* renderizar el codigo de la materia */}
        <small>{materia.codigo}</small>
        {/* renderizar el estado de la materia */}
        <EstadoBadge estado={materia.estado} />
      </Card.Header>
      {/* renderizar el body de la materia */}
      <Card.Body>
        {/* renderizar el nombre de la materia */}
        <Card.Title>{materia.nombre}</Card.Title>
      </Card.Body>
    </Card>
  );
};

// Componente principal del Roadmap
const RoadmapAcademico = () => {
  //materias
  const [materias, setMaterias] = useState<Materia[]>([]);
  //plan de estudio
  const [planEstudio, setPlanEstudio] = useState<PlanEstudio | null>(null);
  //materia seleccionada
  const [selectedMateria, setSelectedMateria] = useState<string | null>(null);
  //detalles de la materia
  const [materiaDetails, setMateriaDetails] = useState<{
    //materia
    materia?: Materia;
    //correlativas
    correlativas: Materia[];
    //requisitos
    requisitos?: RequisitosMateria;
  } | null>(null);
  //mostrar el modal
  const [showModal, setShowModal] = useState(false);
  //cargando los datos
  const [loading, setLoading] = useState(true);

  //obtener los datos del roadmap
  useEffect(() => {
    const fetchData = async () => {
      try {
        //obtener los datos del roadmap
        const [materiasData, planData] = await Promise.all([
          MateriasService.getMaterias(),
          PlanEstudioService.getPlanEstudio(),
        ]);
        //setear los datos del roadmap
        setMaterias(materiasData);
        setPlanEstudio(planData);
      } catch (error) {
        console.error("Error al cargar datos para el roadmap:", error);
      } finally { 
        //setear el cargando en false
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //obtener los detalles de la materia
  const handleMateriaClick = async (materiaId: string) => {
    setSelectedMateria(materiaId);
    try {
      //obtener los detalles de la materia
      const details =
        await MateriasService.getMateriaConCorrelativas(materiaId);
      setMateriaDetails(details);
      //mostrar el modal
      setShowModal(true);
    } catch (error) {
      console.error(
        `Error al obtener detalles de la materia ${materiaId}:`,
        error
      );
    }
  };

  //cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMateria(null);
    setMateriaDetails(null);
  };

  // Renderizar las materias según el plan de estudio
  const renderMaterias = (anio: number, cuatrimestre: number) => {
    if (!planEstudio) return null;
    //obtener el anio del plan de estudio
    const anioPlan = planEstudio.anios.find((a) => a.anio === anio);
    if (!anioPlan) return null;
    //obtener el cuatrimestre del plan de estudio
    const cuatrimestrePlan = anioPlan.cuatrimestres.find(
      (c) => c.cuatrimestre === cuatrimestre
    );
    if (!cuatrimestrePlan) return null;
    //obtener las materias del cuatrimestre
    return cuatrimestrePlan.materias.map((materiaId) => {
      const materia = materias.find((m) => m.id === materiaId);
      if (!materia) return null;

      return (
        //renderizar la materia en el cuatrimestre
        <Col md={6} lg={4} key={materia.id}>
          <MateriaCard materia={materia} onClick={handleMateriaClick} />
        </Col>
      );
    });
  };

  // Renderizar el modal de detalles de la materia
  const renderMateriaModal = () => {
    //si no hay detalles de la materia o no hay materia, no renderizar el modal
    if (!materiaDetails || !materiaDetails.materia) return null;
    //obtener los detalles de la materia
    const { materia, correlativas, requisitos } = materiaDetails;
    //obtener el estado de cursabilidad de la materia
    const estadoCursabilidad = CursabilidadService.getEstadoCursabilidad(
      materia,
      materias
    );
    //renderizar el modal
    return (
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        {/* renderizar el header del modal */}
        <Modal.Header closeButton>
          {/* renderizar el titulo del modal */}
          <Modal.Title>
            {/* renderizar el nombre de la materia */}
            {materia.nombre} <EstadoBadge estado={materia.estado} />
          </Modal.Title>
        </Modal.Header>
        {/* renderizar el body del modal */}
        <Modal.Body>
          <h5>Información General</h5>
          <p>
            <strong>Código:</strong> {materia.codigo}
            <br />
            <strong>Año:</strong> {materia.anio}
            <br />
            <strong>Estado:</strong> {materia.estado}
          </p>
          {/* renderizar las correlativas de la materia */}
          <h5>Correlativas</h5>
          {correlativas.length > 0 ? (
            <Row>
              {/* renderizar las correlativas de la materia */}
              {correlativas.map((correlativa) => (
                <Col md={6} key={correlativa.id}>
                  <Card
                    className="mb-2"
                    border={
                      correlativa.estado === EstadoMateria.PROMOCION ||
                      correlativa.estado === EstadoMateria.REGULAR
                        ? "success"
                        : "danger"
                    }
                  >
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
          {/* renderizar las correlativas pendientes de la materia */}
          {estadoCursabilidad.correlativasFaltantes.length > 0 && (
            <div className="alert alert-danger mt-2">
              <h6>Correlativas pendientes:</h6>
              <ul>
                {estadoCursabilidad.correlativasFaltantes.map((materia) => (
                  <li key={materia.id}>
                    {materia.nombre} - {materia.estado}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* renderizar los requisitos de la materia */}
          {requisitos && (
            <>
              {/* renderizar los requisitos para promocionar la materia */}
              <h5 className="mt-4">Requisitos para Promocionar</h5>
              {requisitos.requisitosPromocion.length > 0 ? (
                <>
                  <ul>
                    {requisitos.requisitosPromocion.map((reqId) => {
                      //obtener la materia
                      const reqMateria = materias.find((m) => m.id === reqId);
                      //renderizar la materia
                      return reqMateria ? (
                        <li key={reqId}>
                          {/* renderizar el nombre de la materia */}
                          {reqMateria.nombre}{" "}
                          {/* renderizar el estado de la materia */}
                          <EstadoBadge estado={reqMateria.estado} />
                        </li>
                      ) : null;
                    })}
                  </ul>
                  {/* renderizar la descripcion para promocionar la materia */}
                  {requisitos.descripcionPromocion && (
                    <p>{requisitos.descripcionPromocion}</p>
                  )}
                </>
              ) : (
                <p>
                  No hay requisitos específicos para promocionar esta materia.
                </p>
              )}
              {/* renderizar los requisitos para rendir el final de la materia */}
              <h5 className="mt-4">Requisitos para Rendir Final</h5>
              {requisitos.requisitosFinales.length > 0 ? (
                <>
                  <ul>
                    {/* renderizar los requisitos para rendir el final de la materia */}
                    {requisitos.requisitosFinales.map((reqId) => {
                      //obtener la materia
                      const reqMateria = materias.find((m) => m.id === reqId);
                      //renderizar la materia
                      return reqMateria ? (
                        <li key={reqId}>
                          {/* renderizar el nombre de la materia */}
                          {reqMateria.nombre}{" "}
                          {/* renderizar el estado de la materia */}
                          <EstadoBadge estado={reqMateria.estado} />
                        </li>
                      ) : null;
                    })}
                  </ul>
                  {/* renderizar la descripcion para rendir el final de la materia */}
                  {requisitos.descripcionFinal && (
                    <p>{requisitos.descripcionFinal}</p>
                  )}
                </>
              ) : (
                <p>
                  No hay requisitos específicos para rendir el final de esta
                  materia.
                </p>
              )}
            </>
          )}
          {/* renderizar el footer del modal */}
        </Modal.Body>
        <Modal.Footer>
          {/* renderizar el boton para cerrar el modal */}
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  //si esta cargando, renderizar un mensaje de cargando
  if (loading) {
    return <div className="text-center p-5">Cargando plan de estudio...</div>;
  }

  //renderizar el roadmap
  return (
    <div className="roadmap-container">
      {/* renderizar el titulo del roadmap */}
      <h2 className="text-center mb-4">Plan de Estudio</h2>
      {/* renderizar los anios del plan de estudio */}
      {planEstudio?.anios.map((anio) => (
        <div key={anio.anio} className="mb-5">
          {/* renderizar el titulo del anio */}
          <h3 className="text-center mb-3">Año {anio.anio}</h3>
          {/* renderizar los cuatrimestres del anio */}
          {anio.cuatrimestres.map((cuatrimestre) => (
            <div
              //renderizar el titulo del cuatrimestre
              key={`${anio.anio}-${cuatrimestre.cuatrimestre}`}
              className="mb-4"
            >
              {/* renderizar el titulo del cuatrimestre */}
              <h4 className="text-center mb-3">
                {cuatrimestre.cuatrimestre}° Cuatrimestre
              </h4>
              {/* renderizar las materias del cuatrimestre */}
              <Row>{renderMaterias(anio.anio, cuatrimestre.cuatrimestre)}</Row>
            </div>
          ))}
        </div>
      ))}
      {/* renderizar el modal de detalles de la materia */}
      {renderMateriaModal()}
    </div>
  );
};

export default RoadmapAcademico;
