// src/components/Examenes.tsx

import React, { useState, useEffect, Fragment } from "react";
import {
  Card,
  Table,
  Button,
  Form,
  Alert,
  Spinner,
  Modal,
} from "react-bootstrap";
import { Formik, Form as FormikForm, Field } from "formik";
import * as Yup from "yup";
import { MesaDisponible, InscripcionExamen } from "../../types/alumnoTypes";
import {
  inscribirExamen,
  desinscribirExamen,
} from "../../services/api/alumno/alumnosService";

interface ExamenesProps {
  mesasDisponibles: MesaDisponible[];
  inscripciones: InscripcionExamen[];
  onInscripcionActualizada: () => void;
}

// Esquema de validación para el formulario de inscripción
const inscripcionSchema = Yup.object().shape({
  mesaId: Yup.string().required("Debe seleccionar una mesa"),
});

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

    for (const materia of materiasDisponibles) {
      const mesa = materia.mesas.find((m) => m.id === mesaId);
      if (mesa) {
        materiaId = materia.materiaId;
        materiaNombre = materia.materiaNombre;
        break;
      }
    }

    if (!materiaId || !materiaNombre) return;

    setCargando(true);
    setError(null);

    try {
      await inscribirExamen(materiaId, mesaId);
      setExito(`Te has inscrito correctamente a ${materiaNombre}`);
      onInscripcionActualizada();
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
      await desinscribirExamen(
        inscripcionAEliminar.materiaId,
        inscripcionAEliminar.mesaId
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
  useEffect(() => {
    if (exito) {
      const timer = setTimeout(() => setExito(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [exito]);

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
        />

        <NuevasInscripciones
          materiasDisponibles={materiasDisponibles}
          handleInscripcion={handleInscripcion}
          cargando={cargando}
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
}

const InscripcionesActuales = ({
  inscripciones,
  confirmarDesinscripcion,
  cargando,
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
  materiaSeleccionada: MesaDisponible | null;
  setMateriaSeleccionada: (materia: MesaDisponible | null) => void;
  handleInscripcion: (values: { mesaId: string }) => void;
  cargando: boolean;
  inscripcionSchema: any;
}

const NuevasInscripciones = ({
  materiasDisponibles,
  handleInscripcion,
  cargando,
}: {
  materiasDisponibles: MesaDisponible[];
  handleInscripcion: (values: { mesaId: string }) => void;
  cargando: boolean;
}) => {
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

// Componente para la lista de materias disponibles
interface ListaMateriasProps {
  materias: MesaDisponible[];
  onSeleccionar: (materia: MesaDisponible) => void;
  cargando: boolean;
}

const ListaMaterias = ({
  materias,
  onSeleccionar,
  cargando,
}: ListaMateriasProps) => (
  <Table responsive striped hover className="align-middle">
    <thead>
      <tr>
        <th>Materia</th>
        <th>Mesas disponibles</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {materias.map((materia) => (
        <tr key={materia.materiaId}>
          <td className="fw-medium">{materia.materiaNombre}</td>
          <td>{materia.mesas.length}</td>
          <td>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onSeleccionar(materia)}
              disabled={cargando}
            >
              Seleccionar mesa
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

// Componente para seleccionar una mesa
interface SeleccionMesaProps {
  materia: MesaDisponible;
  onVolver: () => void;
  onSubmit: (values: { mesaId: string }) => void;
  cargando: boolean;
  inscripcionSchema: any;
}

const SeleccionMesa = ({
  materia,
  onVolver,
  onSubmit,
  cargando,
  inscripcionSchema,
}: SeleccionMesaProps) => (
  <div className="mt-3 p-3 border rounded shadow-sm">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h6 className="mb-0 fw-bold">{materia.materiaNombre}</h6>
      <Button variant="outline-secondary" size="sm" onClick={onVolver}>
        Volver
      </Button>
    </div>

    <Formik
      initialValues={{ mesaId: "" }}
      validationSchema={inscripcionSchema}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <FormikForm>
          <Form.Group className="mb-3">
            <Form.Label>Selecciona una mesa</Form.Label>
            <Field
              as="select"
              name="mesaId"
              className={`form-select ${errors.mesaId && touched.mesaId ? "is-invalid" : ""}`}
            >
              <option value="">Seleccionar mesa</option>
              {materia.mesas.map((mesa) => (
                <option key={mesa.id} value={mesa.id}>
                  {mesa.nombre} - {new Date(mesa.fecha).toLocaleDateString()}
                </option>
              ))}
            </Field>
            {errors.mesaId && touched.mesaId && (
              <div className="invalid-feedback">{errors.mesaId}</div>
            )}
          </Form.Group>

          <Button
            type="submit"
            variant="success"
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
        </FormikForm>
      )}
    </Formik>
  </div>
);

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
