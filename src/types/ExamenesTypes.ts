

import { MesaDisponible, InscripcionExamen, EstadoMateria } from "./alumnoTypes";

export interface ExamenesProps {
  mesasDisponibles: MesaDisponible[]; // Mesas disponibles para inscripción
  inscripciones: InscripcionExamen[]; // Inscripciones actuales del alumno
  onInscripcionActualizada: (nuevaInscripcion?: InscripcionExamen) => void; // Función para actualizar las inscripciones
}

export type InscripcionHandler = (values: { mesaId: string }) => Promise<void>; // Función para inscribirse en una mesa

export type DesinscripcionConfirmCallback = (inscripcion: InscripcionExamen) => void; // Función para confirmar la desinscripción

export interface InscripcionesActualesProps {
  inscripciones: InscripcionExamen[]; // Inscripciones actuales del alumno
  confirmarDesinscripcion: (inscripcion: InscripcionExamen) => void; // Función para confirmar la desinscripción
  cargando: boolean; // Indica si se está cargando la información
  getEstadoColor: (estado: EstadoMateria) => string; // Función para obtener el color del estado de la materia
}

export interface NuevasInscripcionesProps {
  materiasDisponibles: MesaDisponible[]; // Mesas disponibles para inscripción
  handleInscripcion: InscripcionHandler; // Función para inscribirse en una mesa
  cargando: boolean; // Indica si se está cargando la información
  getEstadoColor: (estado: EstadoMateria) => string; // Función para obtener el color del estado de la materia
}

export interface ModalDesinscripcionProps {
  mostrarConfirmacion: boolean; // Indica si se está mostrando la confirmación de la desinscripción
  setMostrarConfirmacion: (mostrar: boolean) => void; // Función para establecer si se está mostrando la confirmación de la desinscripción
  inscripcionAEliminar: InscripcionExamen | null; // Inscripción a eliminar
  handleDesinscripcion: () => void; // Función para desinscribirse de una mesa
  cargando: boolean; // Indica si se está cargando la información
}

export interface NotificacionesExamenProps {
  error: string | null; // Error de la operación
  setError: (error: string | null) => void; // Función para establecer el error de la operación
  exito: string | null; // Exito de la operación
  setExito: (exito: string | null) => void; // Función para establecer el exito de la operación
}
