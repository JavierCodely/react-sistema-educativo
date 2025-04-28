// Mensajes de error y éxito para las inscripciones y desinscripciones de exámenes
export const MENSAJES = {
    ERROR_INSCRIPCION: "Error al realizar la inscripción. Inténtalo nuevamente.",
    ERROR_DESINSCRIPCION: "Error al realizar la desinscripción. Inténtalo nuevamente.",
    EXITO_INSCRIPCION: (materia: string) => `Te has inscrito correctamente a ${materia}.`,
    EXITO_DESINSCRIPCION: (materia: string) => `Te has desinscrito correctamente de ${materia}.`,
    NO_INSCRIPCIONES: "No tienes inscripciones a exámenes actualmente.",
    NO_MATERIAS_DISPONIBLES: "No hay materias disponibles para inscripción en este momento.",
  };
  