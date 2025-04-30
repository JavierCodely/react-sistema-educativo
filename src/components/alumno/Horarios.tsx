// src/components/Horarios.tsx
import React, { useState, useEffect } from "react";
import HorariosService from "../../services/api/alumno/HorariosServices";
import {
  Button,
  Container,
  Row,
  Col,
  Table,
  Form,
  Card,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface HorariosProps {
  horariosSemanal: any;
}

//creamos el componente para los horarios
const Horarios: React.FC<HorariosProps> = ({ horariosSemanal }) => {
  //creamos el estado para el año seleccionado
  const [anioSeleccionado, setAnioSeleccionado] = useState<number | undefined>(
    undefined
  );
  //creamos el estado para el horario semanal
  const [horarioSemanal, setHorarioSemanal] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [dias, setDias] = useState<any[]>([]);
  const [modulos, setModulos] = useState<any[]>([]);

  useEffect(() => {
    cargarDatos();
  }, [anioSeleccionado]);

  const cargarDatos = async () => {
    //seteamos el loading a true
    setLoading(true);
    try {
      // Cargamos los datos en paralelo
      const [diasData, modulosData, horariosData] = await Promise.all([
        HorariosService.getDiasSemana(),
        HorariosService.getModulosHorarios(),
        HorariosService.generarHorarioSemanal(anioSeleccionado),
      ]);

      setDias(diasData);
      setModulos(modulosData);
      setHorarioSemanal(horariosData);
    } catch (error) {
      console.error("Error cargando datos de horarios:", error);
    } finally {
      setLoading(false);
    }
  };

  //creamos la funcion para exportar el horario a PDF
  const handleExportarPDF = () => {
    //exportamos el horario a PDF
    HorariosService.exportarAPDF(anioSeleccionado);
  };

  const handleCambioAnio = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //obtenemos el valor del año seleccionado
    const valor = e.target.value;
    //seteamos el año seleccionado
    setAnioSeleccionado(valor === "" ? undefined : parseInt(valor));
  };

  //creamos la funcion para renderizar las celdas
  const renderCelda = (modulo: number, dia: number) => {
    //si no existe el horario semanal o no existe el dia, retornamos una celda vacia
    if (!horarioSemanal[modulo] || !horarioSemanal[modulo][dia]) {
      return <td key={`${modulo}-${dia}`}></td>;
    }

    //obtenemos las materias del modulo
    const materiasDelModulo = horarioSemanal[modulo][dia];

    //si no existen materias, retornamos una celda vacia
    if (materiasDelModulo.length === 0) {
      return <td key={`${modulo}-${dia}`}></td>;
    }

    return (
      <td
        key={`${modulo}-${dia}`}
        //si existen materias, retornamos una celda con el color de fondo
        className={materiasDelModulo.length > 0 ? "bg-light" : ""}
      >
        {materiasDelModulo.map((materia: any, index: number) => (
          <div key={index} className="p-1">
            <strong>{materia.materiaNombre}</strong>
            <br />
            <span className="small">Prof. {materia.profesor}</span>
          </div>
        ))}
      </td>
    );
  };

  return (
    //creamos el contenedor para los horarios
    <Container fluid className="mt-4">
      //creamos el row para los horarios
      <Row className="mb-4">
        //creamos el col para los horarios
        <Col>
          //creamos el card para los horarios
          <Card>
            <Card.Header as="h5">Horarios de Clases</Card.Header>
            <Card.Body>
              <Row className="align-items-center mb-4">
                <Col sm={4}>
                  <Form.Group>
                    <Form.Label>Año:</Form.Label>
                    <Form.Select
                      value={anioSeleccionado || ""}
                      onChange={handleCambioAnio}
                    >
                      <option value="">Todos los años</option>
                      <option value="1">Primer Año</option>
                      <option value="2">Segundo Año</option>
                      <option value="3">Tercer Año</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col sm={8} className="text-end">
                  <Button variant="danger" onClick={handleExportarPDF}>
                    Exportar a PDF
                  </Button>
                </Col>
              </Row>
              {/* si esta cargando, mostramos un mensaje de cargando */}
              {loading ? (
                <div className="text-center p-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table bordered hover className="horario-table">
                    <thead className="table-dark">
                      <tr>
                        <th>Horario</th>
                        {dias.map((dia) => (
                          <th key={dia.id}>{dia.nombre}</th>
                        ))}
                      </tr>
                    </thead>
                    {/* creamos el tbody para los horarios */}
                    <tbody>
                      {modulos.map((modulo) => (
                        <tr key={modulo.id}>
                          {/* creamos el td para el horario */}
                          <td className="bg-light">
                            <strong>{`${modulo.horaInicio} - ${modulo.horaFin}`}</strong>
                            <br />
                            <small>Módulo {modulo.id}</small>
                          </td>
                          {/* creamos el td para los dias */}
                          {dias.map((dia) => renderCelda(modulo.id, dia.id))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Leyenda de colores por año */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header as="h6">Referencias</Card.Header>
            <Card.Body>
              <div className="d-flex gap-4">
                {/* creamos el div para el primer año */}
                <div>
                  <span className="badge bg-primary me-2">1º</span>
                  <span>Primer Año</span>
                </div>
                {/* creamos el div para el segundo año */}
                <div>
                  <span className="badge bg-success me-2">2º</span>
                  <span>Segundo Año</span>
                </div>
                {/* creamos el div para el tercer año */}
                <div>
                  <span className="badge bg-warning me-2">3º</span>
                  <span>Tercer Año</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Estilos CSS incrustados */}
      <style>{`
        .horario-table th, .horario-table td {
          text-align: center;
          vertical-align: middle;
          min-width: 140px;
        }
        .horario-table td:first-child {
          min-width: 120px;
        }
      `}</style>
    </Container>
  );
};

export default Horarios;
