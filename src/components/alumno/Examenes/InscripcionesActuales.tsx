
import React from "react";
import { Table, Button, Badge, Alert } from "react-bootstrap";
import { InscripcionesActualesProps } from "../../../types/ExamenesTypes";

const InscripcionesActuales = ({
  inscripciones, // Inscripciones actuales del alumno
  confirmarDesinscripcion, // Función para confirmar la desinscripción
  cargando, // Indica si se está cargando la información
  getEstadoColor, // Función para obtener el color del estado de la materia
}: InscripcionesActualesProps) => {
  const noTieneInscripciones = inscripciones.length === 0; // Indica si el alumno no tiene inscripciones

  return (
    <section>
      <h5 className="mt-4 mb-3">Tus inscripciones actuales</h5>

      {noTieneInscripciones ? ( // Si el alumno no tiene inscripciones
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
            {inscripciones.map((inscripcion) => ( // Mapea las inscripciones
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
};

export const MemoizedInscripcionesActuales = React.memo(InscripcionesActuales);
