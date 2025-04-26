// src/services/cursabilidadService.ts
import { Materia, EstadoMateria } from "../../../types/alumnoTypes";

export const CursabilidadService = {
  puedeRecursarMateria: (
    materia: Materia,
    todasLasMaterias: Materia[]
  ): boolean => {
    // Si no tiene correlativas, se puede cursar
    if (!materia.correlativas || materia.correlativas.length === 0) {
      return true;
    }

    // Verificar que todas las correlativas estén en estado REGULAR o PROMOCION
    return materia.correlativas.every((correlativaId) => {
      const correlativa = todasLasMaterias.find((m) => m.id === correlativaId);
      return (
        correlativa &&
        (correlativa.estado === EstadoMateria.REGULAR ||
          correlativa.estado === EstadoMateria.PROMOCION)
      );
    });
  },

  getEstadoCursabilidad: (
    materia: Materia,
    todasLasMaterias: Materia[]
  ): {
    puedeRecursar: boolean;
    correlativasFaltantes: Materia[];
  } => {
    // Si no tiene correlativas, se puede cursar
    if (!materia.correlativas || materia.correlativas.length === 0) {
      return {
        puedeRecursar: true,
        correlativasFaltantes: [],
      };
    }

    const correlativasFaltantes = materia.correlativas
      .map((correlativaId) =>
        todasLasMaterias.find((m) => m.id === correlativaId)
      )
      .filter(
        (correlativa): correlativa is Materia =>
          !!correlativa &&
          correlativa.estado !== EstadoMateria.REGULAR &&
          correlativa.estado !== EstadoMateria.PROMOCION
      );

    return {
      puedeRecursar: correlativasFaltantes.length === 0,
      correlativasFaltantes,
    };
  }
};