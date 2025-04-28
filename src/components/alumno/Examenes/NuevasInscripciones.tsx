

import React from "react";
import { Table, Button, Badge, Alert, Spinner } from "react-bootstrap";
import { NuevasInscripcionesProps } from "../../../types/ExamenesTypes";
import { EstadoMateria } from "../../../types/alumnoTypes";

const NuevasInscripciones = ({
  materiasDisponibles, // Mesas disponibles para inscripción
  handleInscripcion, // Función para inscribirse en una mesa
  cargando, // Indica si se está cargando la información
  getEstadoColor, // Función para obtener el color del estado de la materia
}: NuevasInscripcionesProps) => {
  const noHayMaterias = materiasDisponibles.length === 0; // Indica si no hay materias disponibles

  const inscribir = (materiaId: string, mesaId: string) => {
    handleInscripcion({ mesaId }); // Inscribe al alumno en una mesa
  };

  const isBotonDesactivado = (estado: string) =>
    estado === EstadoMateria.FALTA_CORRELATIVA || cargando; // Indica si el botón está desactivado

  return (
    <section>
      <h5 className="mt-4 mb-3">Inscribirse a nuevos exámenes</h5>

      {noHayMaterias ? ( // Si no hay materias disponibles
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
            {materiasDisponibles.flatMap((materia) => // Mapea las materias disponibles
              materia.mesas.map((mesa) => ( // Mapea las mesas disponibles
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
                      onClick={() => inscribir(materia.materiaId, mesa.id)}
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

export const MemoizedNuevasInscripciones = React.memo(NuevasInscripciones);
