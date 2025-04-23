// src/pages/StudentDashboard.tsx

import React, { useState, useEffect } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import StudentCard from "../../components/alumno/StudentCard";
import WelcomeSection from "../../components/alumno/WelcomeSection";
import Navbar from "../../components/alumno/Navbar";
import Horarios from "../../components/alumno/Horarios";
import TablaEstados from "../../components/alumno/TablaEstados";
import RoadmapAcademico from "../../components/alumno/RoadmapAcademico";
import {
  getEstudiante,
  getMaterias,
  getMesasDisponibles,
  getInscripciones,
} from "../../services/api/alumno/alumnosService";
import {
  Estudiante,
  Materia,
  MesaDisponible,
  InscripcionExamen,
} from "../../types/alumnoTypes";

const StudentDashboard: React.FC = () => {
  // Estados para almacenar los datos
  const [seccionActiva, setSeccionActiva] = useState<
    "inicio" | "horarios" | "examenes" | "correlativas" | "tabs"
  >("inicio");
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [mesasDisponibles, setMesasDisponibles] = useState<MesaDisponible[]>(
    []
  );
  const [inscripciones, setInscripciones] = useState<InscripcionExamen[]>([]);

  // Estados para manejar la carga y errores
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar todos los datos
  const cargarDatos = async () => {
    setCargando(true);
    setError(null);

    try {
      // Cargar datos en paralelo para optimizar
      const [estudianteData, materiasData, mesasData, inscripcionesData] =
        await Promise.all([
          getEstudiante(),
          getMaterias(),
          getMesasDisponibles(),
          getInscripciones(),
        ]);

      setEstudiante(estudianteData);
      setMaterias(materiasData);
      setMesasDisponibles(mesasData);
      setInscripciones(inscripcionesData);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError(
        "Hubo un problema al cargar los datos. Por favor, intenta nuevamente."
      );
    } finally {
      setCargando(false);
    }
  };

  // Función para recargar inscripciones cuando hay cambios
  const recargarInscripciones = async () => {
    try {
      const inscripcionesData = await getInscripciones();
      setInscripciones(inscripcionesData);
    } catch (err) {
      console.error("Error al recargar inscripciones:", err);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  // Si está cargando, mostrar spinner
  if (cargando) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </div>
    );
  }

  // Si hay error, mostrar mensaje
  if (error || !estudiante) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          {error || "No se pudieron cargar los datos del estudiante."}
        </Alert>
        <div className="text-center mt-3">
          <button className="btn btn-primary" onClick={cargarDatos}>
            Reintentar
          </button>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Navbar
        nombreEstudiante={`${estudiante.nombre} ${estudiante.apellido}`}
        onNavegar={(seccion) => setSeccionActiva(seccion)}
      />

      <Container>
        <StudentCard estudiante={estudiante} />

        {seccionActiva === "inicio" && (
          <WelcomeSection nombreEstudiante={estudiante.nombre} />
        )}

        {seccionActiva === "horarios" && <Horarios />}
       
        {seccionActiva === "correlativas" && <RoadmapAcademico />}

        {/* Componente de pestañas extraído */}
        {seccionActiva === "tabs" || seccionActiva === "examenes" ? (
          <TablaEstados
            materias={materias}
            mesasDisponibles={mesasDisponibles}
            inscripciones={inscripciones}
            onInscripcionActualizada={recargarInscripciones}
          />
        ) : null}
      </Container>
    </>
  );
};

export default StudentDashboard;
