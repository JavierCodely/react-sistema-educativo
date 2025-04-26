// src/components/Examenes.tsx

import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Form,
  Alert,
  Spinner,
  Modal,
  Badge,
} from "react-bootstrap";


import {
  MesaDisponible,
  InscripcionExamen,
  EstadoMateria,
} from "../../types/alumnoTypes";

//servicios de alumnos
import { InscripcionesService } from "../../services/api/alumno/inscripcionesServices";

interface ExamenesProps {
  mesasDisponibles: MesaDisponible[];
  inscripciones: InscripcionExamen[];
  onInscripcionActualizada: (nuevaInscripcion?: InscripcionExamen) => void;
}


// Función para obtener el color del badge según el estado de la materia
const getEstadoColor = (estado: EstadoMateria): string => {
  switch (estado) {
    case EstadoMateria.PROMOCION:
      return "success";
    case EstadoMateria.REGULAR:
      return "info";
    case EstadoMateria.CURSANDO:
      return "primary";
    case EstadoMateria.LIBRE:
      return "danger";
    case EstadoMateria.FALTA_CORRELATIVA:
      return "warning";
    case EstadoMateria.APROBADO:
      return "success";
    case EstadoMateria.NO_CURSADO:
    default:
      return "secondary";
  }
};

const Examenes = ({
  mesasDisponibles,
  inscripciones,
  onInscripcionActualizada,
}: ExamenesProps) => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [inscripcionAEliminar, setInscripcionAEliminar] =
    useState<InscripcionExamen | null>(null);
  const [inscripcionesLocales, setInscripcionesLocales] = useState<InscripcionExamen[]>(inscripciones);

  // Actualizamos el estado local cuando cambian las inscripciones props
  useEffect(() => {
    setInscripcionesLocales(inscripciones);
  }, [inscripciones]);

  // Filtrar las materias que ya están inscritas
  const materiasDisponibles = mesasDisponibles.filter(
    (mesa) => !inscripciones.some((insc) => insc.materiaId === mesa.materiaId)
  );

  // Función para manejar la inscripción al examen
  const handleInscripcion = async (values: { mesaId: string }) => {
    // Encuentra la materia correspondiente al mesaId

    const mesaId = values.mesaId;
    let materiaId: string | null = null;
    let materiaNombre: string | null = null;
    let estado: EstadoMateria | null = null;
    let mesaNombre: string | null = null;
    let fecha: string | null = null;

    for (const materia of materiasDisponibles) {
      const mesa = materia.mesas.find((m) => m.id === mesaId);
      if (mesa) {
        materiaId = materia.materiaId;
        materiaNombre = materia.materiaNombre;
        estado = materia.estado; // Preservamos el estado de la materia
        mesaNombre = mesa.nombre;
        fecha = mesa.fecha;
        break;
      }
    }

    if (!materiaId || !materiaNombre) return;

    setCargando(true);
    setError(null);

    try {
      // Realizamos la inscripción
      await InscripcionesService.setInscribirExamen(materiaId, mesaId);

      // Creamos manualmente la nueva inscripción con los datos que ya tenemos
      const nuevaInscripcion: InscripcionExamen = {
        materiaId,
        mesaId,
        materiaNombre,
        mesaNombre: mesaNombre || "",
        fecha: fecha || "",
        estado: estado as EstadoMateria, // Usamos el estado que ya teníamos
      };

      // Llamamos a onInscripcionActualizada pasando la nueva inscripción
      // (modificamos el tipo de la prop para que acepte este parámetro)
      onInscripcionActualizada(nuevaInscripcion);

      setExito(`Te has inscrito correctamente a ${materiaNombre}`);
    } catch (err) {
      setError("Error al realizar la inscripción. Inténtalo nuevamente.");
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  // Función para confirmar desinscripción
  const confirmarDesinscripcion = (inscripcion: InscripcionExamen) => {
    setInscripcionAEliminar(inscripcion);
    setMostrarConfirmacion(true);
  };

  // Función para manejar la desinscripción
  const handleDesinscripcion = async () => {
    if (!inscripcionAEliminar) return;

    setCargando(true);
    setError(null);
    setMostrarConfirmacion(false);

    try {
      await InscripcionesService.desinscribirExamen(
        inscripcionAEliminar.materiaId,
        inscripcionAEliminar.mesaId
      );

      // Actualizamos estado local para UI inmediata
      setInscripcionesLocales(prev =>
         prev.filter(insc =>
          !(insc.materiaId === inscripcionAEliminar.materiaId &&
            insc.mesaId === inscripcionAEliminar.mesaId)
        )
      );

      setExito(
        `Te has desinscrito correctamente de ${inscripcionAEliminar.materiaNombre}`
      );
      onInscripcionActualizada();
    } catch (err) {
      setError("Error al realizar la desinscripción. Inténtalo nuevamente.");
      console.error(err);
    } finally {
      setCargando(false);
      setInscripcionAEliminar(null);
    }
  };

  // Limpiar mensajes de éxito después de 5 segundos

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Card.Title className="mb-4 d-flex align-items-center">
          <i className="bi bi-calendar-check me-2"></i>
          Inscripción a Exámenes
        </Card.Title>

        <NotificacionesExamen
          error={error}
          setError={setError}
          exito={exito}
          setExito={setExito}
        />

        <InscripcionesActuales
          inscripciones={inscripciones}
          confirmarDesinscripcion={confirmarDesinscripcion}
          cargando={cargando}
          getEstadoColor={getEstadoColor}
        />

        <NuevasInscripciones
          materiasDisponibles={materiasDisponibles}
          handleInscripcion={handleInscripcion}
          cargando={cargando}
          getEstadoColor={getEstadoColor}
        />

        <ModalDesinscripcion
          mostrarConfirmacion={mostrarConfirmacion}
          setMostrarConfirmacion={setMostrarConfirmacion}
          inscripcionAEliminar={inscripcionAEliminar}
          handleDesinscripcion={handleDesinscripcion}
          cargando={cargando}
        />
      </Card.Body>
    </Card>
  );
};

// Componente para notificaciones
interface NotificacionesExamenProps {
  error: string | null;
  setError: (error: string | null) => void;
  exito: string | null;
  setExito: (exito: string | null) => void;
}

const NotificacionesExamen = ({
  error,
  setError,
  exito,
  setExito,
}: NotificacionesExamenProps) => (
  <>
    {error && (
      <Alert variant="danger" onClose={() => setError(null)} dismissible>
        {error}
      </Alert>
    )}

    {exito && (
      <Alert variant="success" onClose={() => setExito(null)} dismissible>
        {exito}
      </Alert>
    )}
  </>
);

// Componente para inscripciones actuales
interface InscripcionesActualesProps {
  inscripciones: InscripcionExamen[];
  confirmarDesinscripcion: (inscripcion: InscripcionExamen) => void;
  cargando: boolean;
  getEstadoColor: (estado: EstadoMateria) => string;
}

const InscripcionesActuales = ({
  inscripciones,
  confirmarDesinscripcion,
  cargando,
  getEstadoColor,
}: InscripcionesActualesProps) => (
  <section>
    <h5 className="mt-4 mb-3">Tus inscripciones actuales</h5>
    {inscripciones.length === 0 ? (
      <Alert variant="info">
        No tienes inscripciones a exámenes actualmente.
      </Alert>
    ) : (
      <Table responsive striped hover className="align-middle">
        <thead>
          <tr>
            <th>Materia</th>
            <th>Mesa</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inscripciones.map((inscripcion) => (
            <tr key={`${inscripcion.materiaId}-${inscripcion.mesaId}`}>
              <td>{inscripcion.materiaNombre}</td>
              <td>{inscripcion.mesaNombre}</td>
              <td>{new Date(inscripcion.fecha).toLocaleDateString()}</td>
              <td>
                {inscripcion.estado ? (
                  <Badge bg={getEstadoColor(inscripcion.estado)}>
                    {inscripcion.estado}
                  </Badge>
                ) : (
                  <Badge bg="secondary">PENDIENTE</Badge>
                )}
              </td>
              <td>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => confirmarDesinscripcion(inscripcion)}
                  disabled={cargando}
                >
                  Desinscribir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    )}
  </section>
);

// Componente para nuevas inscripciones
interface NuevasInscripcionesProps {
  materiasDisponibles: MesaDisponible[];
  handleInscripcion: (values: { mesaId: string }) => void;
  cargando: boolean;
  getEstadoColor: (estado: EstadoMateria) => string;
}

const NuevasInscripciones = ({
  materiasDisponibles,
  handleInscripcion,
  cargando,
  getEstadoColor,
}: NuevasInscripcionesProps) => {
  // Función para manejar la inscripción directa
  const inscribirDirectamente = (materiaId: string, mesaId: string) => {
    handleInscripcion({ mesaId });
  };

  return (
    <section>
      <h5 className="mt-4 mb-3">Inscribirse a nuevos exámenes</h5>
      {materiasDisponibles.length === 0 ? (
        <Alert variant="info">
          No hay materias disponibles para inscripción en este momento.
        </Alert>
      ) : (
        <Table responsive striped hover className="align-middle">
          <thead>
            <tr>
              <th>Materia</th>
              <th>Mesas disponibles</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materiasDisponibles.flatMap((materia) =>
              materia.mesas.map((mesa) => (
                <tr key={`${materia.materiaId}-${mesa.id}`}>
                  <td className="fw-medium">{materia.materiaNombre}</td>
                  <td>
                    {mesa.nombre} - {new Date(mesa.fecha).toLocaleDateString()}
                  </td>
                  <td>
                    <Badge bg={getEstadoColor(materia.estado)}>
                      {materia.estado}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() =>
                        inscribirDirectamente(materia.materiaId, mesa.id)
                      }
                      disabled={cargando}
                      className="d-flex align-items-center"
                    >
                      {cargando ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          <span>Inscribiendo...</span>
                        </>
                      ) : (
                        "Inscribirse"
                      )}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </section>
  );
};

// Componente para el modal de confirmación de desinscripción
interface ModalDesinscripcionProps {
  mostrarConfirmacion: boolean;
  setMostrarConfirmacion: (mostrar: boolean) => void;
  inscripcionAEliminar: InscripcionExamen | null;
  handleDesinscripcion: () => void;
  cargando: boolean;
}

const ModalDesinscripcion = ({
  mostrarConfirmacion,
  setMostrarConfirmacion,
  inscripcionAEliminar,
  handleDesinscripcion,
  cargando,
}: ModalDesinscripcionProps) => (
  <Modal
    show={mostrarConfirmacion}
    onHide={() => setMostrarConfirmacion(false)}
    centered
  >
    <Modal.Header closeButton>
      <Modal.Title>Confirmar desinscripción</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      ¿Estás seguro que deseas desinscribirte de{" "}
      <strong>{inscripcionAEliminar?.materiaNombre}</strong> -{" "}
      {inscripcionAEliminar?.mesaNombre}?
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setMostrarConfirmacion(false)}>
        Cancelar
      </Button>
      <Button
        variant="danger"
        onClick={handleDesinscripcion}
        disabled={cargando}
        className="d-flex align-items-center"
      >
        {cargando ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
            <span>Procesando...</span>
          </>
        ) : (
          "Confirmar desinscripción"
        )}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default Examenes;
