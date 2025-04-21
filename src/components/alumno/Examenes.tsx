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

const Examenes: React.FC<ExamenesProps> = ({
  mesasDisponibles,
  inscripciones,
  onInscripcionActualizada,
}) => {
  const [materiaSeleccionada, setMateriaSeleccionada] =
    useState<MesaDisponible | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] =
    useState<boolean>(false);
  const [inscripcionAEliminar, setInscripcionAEliminar] =
    useState<InscripcionExamen | null>(null);

  // Función para manejar la inscripción al examen
  const handleInscripcion = async (values: { mesaId: string }) => {
    if (!materiaSeleccionada) return;

    setCargando(true);
    setError(null);

    try {
      await inscribirExamen(materiaSeleccionada.materiaId, values.mesaId);
      setExito(
        `Te has inscrito correctamente a ${materiaSeleccionada.materiaNombre}`
      );
      setMateriaSeleccionada(null);
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
      const timer = setTimeout(() => {
        setExito(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [exito]);

  // Filtrar las materias que ya están inscritas
  const materiasDisponibles = mesasDisponibles.filter(
    (mesa) => !inscripciones.some((insc) => insc.materiaId === mesa.materiaId)
  );

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Card.Title className="mb-4">
          <i className="bi bi-calendar-check me-2"></i>
          Inscripción a Exámenes
        </Card.Title>

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

        {/* Sección de materias inscritas */}
        <h5 className="mt-4 mb-3">Tus inscripciones actuales</h5>
        {inscripciones.length === 0 ? (
          <Alert variant="info">
            No tienes inscripciones a exámenes actualmente.
          </Alert>
        ) : (
          <Table responsive striped hover>
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

        {/* Sección para inscribirse a nuevos exámenes */}
        <h5 className="mt-4 mb-3">Inscribirse a nuevos exámenes</h5>
        {materiasDisponibles.length === 0 ? (
          <Alert variant="info">
            No hay materias disponibles para inscripción en este momento.
          </Alert>
        ) : (
          <>
            {!materiaSeleccionada ? (
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Materia</th>
                    <th>Mesas disponibles</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {materiasDisponibles.map((materia) => (
                    <tr key={materia.materiaId}>
                      <td>{materia.materiaNombre}</td>
                      <td>{materia.mesas.length}</td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => setMateriaSeleccionada(materia)}
                          disabled={cargando}
                        >
                          Seleccionar mesa
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="mt-3 p-3 border rounded">
                <div className="d-flex justify-content-between mb-3">
                  <h6>{materiaSeleccionada.materiaNombre}</h6>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setMateriaSeleccionada(null)}
                  >
                    Volver
                  </Button>
                </div>

                <Formik
                  initialValues={{ mesaId: "" }}
                  validationSchema={inscripcionSchema}
                  onSubmit={handleInscripcion}
                >
                  {({ errors, touched }) => (
                    <FormikForm>
                      <Form.Group className="mb-3">
                        <Form.Label>Selecciona una mesa</Form.Label>
                        <Field
                          as="select"
                          name="mesaId"
                          className="form-select"
                        >
                          <option value="">Seleccionar mesa</option>
                          {materiaSeleccionada.mesas.map((mesa) => (
                            <option key={mesa.id} value={mesa.id}>
                              {mesa.nombre} -{" "}
                              {new Date(mesa.fecha).toLocaleDateString()}
                            </option>
                          ))}
                        </Field>
                        {errors.mesaId && touched.mesaId ? (
                          <div className="text-danger mt-1">
                            {errors.mesaId}
                          </div>
                        ) : null}
                      </Form.Group>

                      <Button
                        type="submit"
                        variant="success"
                        disabled={cargando}
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
                            Inscribiendo...
                          </>
                        ) : (
                          "Inscribirse"
                        )}
                      </Button>
                    </FormikForm>
                  )}
                </Formik>
              </div>
            )}
          </>
        )}

        {/* Modal de confirmación para desinscripción */}
        <Modal
          show={mostrarConfirmacion}
          onHide={() => setMostrarConfirmacion(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirmar desinscripción</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Estás seguro que deseas desinscribirte de{" "}
            <strong>{inscripcionAEliminar?.materiaNombre}</strong> -
            {inscripcionAEliminar?.mesaNombre}?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setMostrarConfirmacion(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDesinscripcion}
              disabled={cargando}
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
                  Procesando...
                </>
              ) : (
                "Confirmar desinscripción"
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default Examenes;
