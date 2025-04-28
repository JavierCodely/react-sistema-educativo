// src/components/Examenes.tsx

import React, { useState, useEffect, useCallback } from "react";
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

// Tipado más explícito para las funciones
type InscripcionHandler = (values: { mesaId: string }) => Promise<void>;
type DesinscripcionConfirmCallback = (inscripcion: InscripcionExamen) => void;

// Tipado para las props del componente
interface ExamenesProps {
  mesasDisponibles: MesaDisponible[];
  inscripciones: InscripcionExamen[];
  onInscripcionActualizada: (nuevaInscripcion?: InscripcionExamen) => void;
}

//tipado para las props del componente
interface NuevasInscripcionesProps {
  materiasDisponibles: MesaDisponible[];
  handleInscripcion: InscripcionHandler;
  cargando: boolean;
  getEstadoColor: (estado: EstadoMateria) => string;
}
//tipado para las props del componente
interface InscripcionesActualesProps {
  inscripciones: InscripcionExamen[];
  confirmarDesinscripcion: DesinscripcionConfirmCallback;
  cargando: boolean;
  getEstadoColor: (estado: EstadoMateria) => string;
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

// Mensajes de error y éxito
const MENSAJES = {
  ERROR_INSCRIPCION: "Error al realizar la inscripción. Inténtalo nuevamente.",
  ERROR_DESINSCRIPCION:
    "Error al realizar la desinscripción. Inténtalo nuevamente.",
  EXITO_INSCRIPCION: (materia: string) =>
    `Te has inscrito correctamente a ${materia}`,
  EXITO_DESINSCRIPCION: (materia: string) =>
    `Te has desinscrito correctamente de ${materia}`,
  NO_INSCRIPCIONES: "No tienes inscripciones a exámenes actualmente.",
  NO_MATERIAS_DISPONIBLES:
    "No hay materias disponibles para inscripción en este momento.",
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
  const [inscripcionesLocales, setInscripcionesLocales] =
    useState<InscripcionExamen[]>(inscripciones);
  const [isLocalUpdate, setIsLocalUpdate] = useState(false);

  // Actualizamos el estado local cuando cambian las inscripciones props
  useEffect(() => {
    // Compara las inscripciones entrantes con las locales
    // Solo actualizar cuando sea necesario
    if (
      !isLocalUpdate &&
      inscripciones.length !== inscripcionesLocales.length
    ) {
      setInscripcionesLocales(inscripciones);
    }
    // Resetear el flag después de procesar
    setIsLocalUpdate(false);
  }, [inscripciones, isLocalUpdate]);

  // Filtrar las materias que ya están inscritas
  const materiasDisponibles = mesasDisponibles.filter(
    (mesa) => !inscripciones.some((insc) => insc.materiaId === mesa.materiaId)
  );

  // Función para manejar la inscripción al examen
  const handleInscripcion: InscripcionHandler = useCallback(
    async (values: { mesaId: string }) => {
      // Encuentra la materia correspondiente al mesaId
      const mesaId = values.mesaId;
      let materiaId: string | null = null;
      let materiaNombre: string | null = null;
      let estado: EstadoMateria | null = null;
      let mesaNombre: string | null = null;
      let fecha: string | null = null;

      // Buscar la materia y mesa específica
      for (const materia of materiasDisponibles) {
        const mesa = materia.mesas.find((m) => m.id === mesaId);
        if (mesa) {
          materiaId = materia.materiaId;
          materiaNombre = materia.materiaNombre;
          estado = materia.estado; // Guardamos el estado original
          mesaNombre = mesa.nombre;
          fecha = mesa.fecha;
          break;
        }
      }

      if (!materiaId || !materiaNombre || !estado) return;

      setCargando(true);
      setError(null);

      try {
        // Creamos el objeto de inscripción con el estado original
        const datosInscripcion = {
          materiaId,
          mesaId,
          estado: estado, // Incluimos el estado explícitamente
        };

        // Modificamos la llamada al servicio para incluir el estado
        const resultado = await InscripcionesService.setInscribirExamen(
          materiaId,
          mesaId,
          estado // Pasamos el estado como parámetro adicional
        );

        // Creamos la nueva inscripción con los datos recolectados,
        // asegurándonos de mantener el estado original
        const nuevaInscripcion: InscripcionExamen = {
          materiaId,
          mesaId,
          materiaNombre,
          mesaNombre: mesaNombre || "",
          fecha: fecha || "",
          estado: estado, // Usamos el estado original
        };

        // Actualizamos la UI inmediatamente con la nueva inscripción
        setInscripcionesLocales((prev) => {
          // Comprobamos si ya existe esta inscripción para evitar duplicados
          const yaExiste = prev.some(
            (insc) => insc.materiaId === materiaId && insc.mesaId === mesaId
          );

          // Si ya existe, no la agregamos de nuevo
          if (yaExiste) return prev;

          return [...prev, nuevaInscripcion];
        });
        onInscripcionActualizada(nuevaInscripcion);

        // Notificamos al componente padre sobre la nueva inscripción
        setExito(`Te has inscrito correctamente a ${materiaNombre}`);
      } catch (err: unknown) {
        // Tipado más seguro para errores
        const errorMsg =
          err instanceof Error ? err.message : "Error desconocido";
        setError(`Error al realizar la inscripción: ${errorMsg}`);
        console.error(err);
      } finally {
        setCargando(false);
      }
    },
    [materiasDisponibles, onInscripcionActualizada]
  ); // Dependencias para evitar que se actualice la UI doblemente

  // Función para confirmar desinscripción
  const confirmarDesinscripcion: DesinscripcionConfirmCallback = useCallback(
    (inscripcion: InscripcionExamen) => {
      setInscripcionAEliminar(inscripcion);
      setMostrarConfirmacion(true);
    },
    []
  );

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
      setInscripcionesLocales((prev) =>
        prev.filter(
          (insc) =>
            !(
              insc.materiaId === inscripcionAEliminar.materiaId &&
              insc.mesaId === inscripcionAEliminar.mesaId
            )
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
          inscripciones={inscripcionesLocales} // Usar inscripciones locales
          confirmarDesinscripcion={confirmarDesinscripcion}
          cargando={cargando}
          getEstadoColor={getEstadoColor}
        />

        <MemoizedNuevasInscripciones
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
                <Badge bg={getEstadoColor(inscripcion.estado)}>
                  {inscripcion.estado}
                </Badge>
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
  handleInscripcion: InscripcionHandler;
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

  // Función para determinar si el botón debe estar desactivado
  const isBotonDesactivado = (estado: EstadoMateria): boolean => {
    return estado === EstadoMateria.FALTA_CORRELATIVA || cargando;
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
                      disabled={isBotonDesactivado(materia.estado)}
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

// Memoizar componentes hijos para evitar renderizados innecesarios
const MemoizedInscripcionesActuales = React.memo(InscripcionesActuales);
const MemoizedNuevasInscripciones = React.memo(NuevasInscripciones);

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
