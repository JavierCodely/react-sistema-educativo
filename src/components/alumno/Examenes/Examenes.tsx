import React, { useState, useCallback } from "react";
import { Card } from "react-bootstrap";

// Tipos
import {
  ExamenesProps,
  InscripcionHandler,
  DesinscripcionConfirmCallback,
} from "../../../types/ExamenesTypes";
import { InscripcionExamen } from "../../../types/alumnoTypes";

// Servicios
import { InscripcionesService } from "../../../services/api/alumno/inscripcionesServices";

// Componentes
import { MemoizedInscripcionesActuales } from "./InscripcionesActuales";
import { MemoizedNuevasInscripciones } from "./NuevasInscripciones";
import { ModalDesinscripcion } from "./ModalDesinscripcion";
import { NotificacionesExamen } from "./NotificacionesExamen";

// Constantes
import { MENSAJES } from "../../../constants/mensajesExamenes";

// Helpers
import { getEstadoColor } from "../../../utils/estadoMateriaColor";

const Examenes = ({
  mesasDisponibles, // Mesas disponibles para inscripción
  inscripciones, // Inscripciones del alumno
  onInscripcionActualizada, // Función para actualizar las inscripciones
}: ExamenesProps) => {
  // Estados
  const [cargando, setCargando] = useState(false); // Indica si se está cargando la información
  const [error, setError] = useState<string | null>(null); // Error de la inscripción
  const [exito, setExito] = useState<string | null>(null); // Éxito de la inscripción
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false); // Indica si se está mostrando la confirmación de desinscripción
  const [inscripcionAEliminar, setInscripcionAEliminar] =
    useState<InscripcionExamen | null>(null); // Inscripción a eliminar

  // Usamos directamente las props para el renderizado
  // Sin estado local para inscripciones
  
  // Filtrar las mesas disponibles que no están inscritas por el alumno
  const materiasDisponibles = mesasDisponibles.filter(
    (mesa) => !inscripciones.some((insc) => insc.materiaId === mesa.materiaId)
  );

  // Inscripción
  const handleInscripcion: InscripcionHandler = useCallback(
    async ({ mesaId }) => {
      const materia = mesasDisponibles.find((m) =>
        m.mesas.some((mesa) => mesa.id === mesaId) // Encontrar la materia disponible que tiene la mesa
      );
      if (!materia) return; // Si no hay materia, retornar

      const mesa = materia.mesas.find((m) => m.id === mesaId);
      if (!mesa) return;

      setCargando(true); // Indicar que se está cargando
      setError(null); // Reiniciar el error

      try {
        // Inscribir el examen
        await InscripcionesService.setInscribirExamen(
          materia.materiaId,
          mesa.id,
          materia.estado
        );
        
        // Crear una nueva inscripción
        const nuevaInscripcion = {
          materiaId: materia.materiaId,
          mesaId: mesa.id,
          materiaNombre: materia.materiaNombre,
          mesaNombre: mesa.nombre,
          fecha: mesa.fecha,
          estado: materia.estado,
        };
        
        // Actualizar las inscripciones solo a través del padre
        onInscripcionActualizada(nuevaInscripcion);
        
        // Mostrar el mensaje de éxito
        setExito(MENSAJES.EXITO_INSCRIPCION(materia.materiaNombre));
      } catch (err) {
        setError(MENSAJES.ERROR_INSCRIPCION);
      } finally {
        setCargando(false);
      }
    },
    [mesasDisponibles, onInscripcionActualizada]
  );

  // Confirmar desinscripción
  const confirmarDesinscripcion: DesinscripcionConfirmCallback = useCallback(
    (inscripcion) => {
      setInscripcionAEliminar(inscripcion); // Establecer la inscripción a eliminar
      setMostrarConfirmacion(true); // Mostrar la confirmación de desinscripción
    },
    []
  );

  // Ejecutar desinscripción
  const handleDesinscripcion = async () => {
    if (!inscripcionAEliminar) return; // Si no hay inscripción a eliminar, retornar

    setCargando(true); // Indicar que se está cargando
    setError(null); // Reiniciar el error

    try {
      // Desinscribir el examen
      await InscripcionesService.desinscribirExamen(
        inscripcionAEliminar.materiaId,
        inscripcionAEliminar.mesaId
      );

      setExito(
        MENSAJES.EXITO_DESINSCRIPCION(inscripcionAEliminar.materiaNombre)
      );
      
      // Actualizar las inscripciones en el componente padre
      onInscripcionActualizada();
    } catch (err) {
      setError(MENSAJES.ERROR_DESINSCRIPCION);
    } finally {
      setCargando(false); // Reiniciar el estado de carga
      setMostrarConfirmacion(false); // Reiniciar el estado de confirmación
      setInscripcionAEliminar(null); // Reiniciar la inscripción a eliminar
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

        <MemoizedInscripcionesActuales
          inscripciones={inscripciones} // Usamos directamente las props
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

export default Examenes;