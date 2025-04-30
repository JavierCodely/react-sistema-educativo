// src/components/MateriasPorAnio.tsx

import React, { useState, useEffect } from "react";
import { Card, Table, Badge, Accordion } from "react-bootstrap";
import { Materia, EstadoMateria } from "../../types/alumnoTypes";

interface MateriasPorAnioProps {
  materias: Materia[];
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

const MateriasPorAnio: React.FC<MateriasPorAnioProps> = ({ materias }) => {
  const [materiasPorAnio, setMateriasPorAnio] = useState<
    Record<number, Materia[]>
  >({});

  useEffect(() => {
    // Agrupar materias por año
    const agrupadas = materias.reduce<Record<number, Materia[]>>(
      //creamos el objeto para agrupar las materias por año
      (acc, materia) => {
        //si no existe el año, creamos el array
        if (!acc[materia.anio]) {
          //creamos el array
          acc[materia.anio] = [];
        }
        //añadimos la materia al array
        acc[materia.anio].push(materia);
        //retornamos el objeto
        return acc;
      },
      {}
    );
    
    setMateriasPorAnio(agrupadas);
  }, [materias]);

  return (
    <Card className="mb-4 shadow-s">
      <Card.Body>
        <Card.Title className="mb-4 ">
          <i className="bi bi-book me-2 "></i>
          Estado de Materias
        </Card.Title>

        <Accordion>
          {Object.entries(materiasPorAnio).map(([anio, materias], index) => (
            <Accordion.Item key={anio} eventKey={index.toString()}>
              <Accordion.Header>
                <span className="fw-bold">Año {anio}</span>
                <span className="ms-2 text-muted">
                  ({materias.length} materias)
                </span>
              </Accordion.Header>
              <Accordion.Body>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Materia</th>
                      <th>Notas</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materias.map((materia) => (
                      <tr key={materia.id}>
                        <td>{materia.codigo}</td>
                        <td>{materia.nombre}</td>
                        <td>
                          {materia.notas.map((nota) =>
                            nota.nota > 0 ? nota.nota : "No cursada"
                          )}
                        </td>
                        <td>
                          <Badge bg={getEstadoColor(materia.estado)}>
                            {materia.estado}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>

        <div className="mt-4">
          <h6 className="mb-3">Referencias:</h6>
          <div className="d-flex flex-wrap">
            {Object.values(EstadoMateria).map((estado) => (
              <div key={estado} className="me-3 mb-2">
                <Badge bg={getEstadoColor(estado as EstadoMateria)}>
                  {estado}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MateriasPorAnio;
