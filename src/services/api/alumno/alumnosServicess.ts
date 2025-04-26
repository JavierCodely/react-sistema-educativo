// src/services/alumnoService.ts

import axios from "axios";
import {
  Estudiante,
  Materia,
  MesaDisponible,
  InscripcionExamen,
  PlanEstudio,
  RequisitosMateria,
  EstadoMateria,
} from "../../../types/alumnoTypes";
import {
  estudianteMock,
  materiasMock,
  mesasDisponiblesMock,
  inscripcionesMock,
  planEstudioMock,
  requisitosMateriasMock,
} from "../../../mocks/alumnoMock";

//const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";
const API_URL = "http://localhost:3001/api";
//const USE_MOCK = process.env.REACT_APP_USE_MOCK === "true" || true;
const USE_MOCK = true;

// Función para obtener los datos del estudiante
export const getEstudiante = async (): Promise<Estudiante> => {
  if (USE_MOCK) {
    return Promise.resolve(estudianteMock[0]);
  }

  try {
    const response = await axios.get<Estudiante>(`${API_URL}/estudiante`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener datos del estudiante:", error);
    throw error;
  }
};

// Función para obtener las materias del estudiante
export const getMaterias = async (): Promise<Materia[]> => {
  if (USE_MOCK) {
    return Promise.resolve(materiasMock);
  }

  try {
    const response = await axios.get<Materia[]>(`${API_URL}/materias`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener materias:", error);
    throw error;
  }
};

// Función para obtener mesas disponibles para inscripción
export const getMesasDisponibles = async (): Promise<MesaDisponible[]> => {
  if (USE_MOCK) {
    return Promise.resolve(mesasDisponiblesMock);
  }

  try {
    const response = await axios.get<MesaDisponible[]>(
      `${API_URL}/mesas-disponibles`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener mesas disponibles:", error);
    throw error;
  }
};

// Función para obtener inscripciones a exámenes del estudiante
export const getInscripciones = async (): Promise<InscripcionExamen[]> => {
  if (USE_MOCK) {
    return Promise.resolve(inscripcionesMock);
  }

  try {
    const response = await axios.get<InscripcionExamen[]>(
      `${API_URL}/inscripciones`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener inscripciones:", error);
    throw error;
  }
};

// Función para inscribir a un examen
export const inscribirExamen = async (
  materiaId: string,
  mesaId: string
): Promise<InscripcionExamen> => {
  if (USE_MOCK) {
    // Buscar la mesa y la materia en los mocks
    const mesaDisponible = mesasDisponiblesMock.find(
      (m) => m.materiaId === materiaId
    );
    if (!mesaDisponible) throw new Error("Materia no encontrada");

    const mesa = mesaDisponible.mesas.find((m) => m.id === mesaId);
    if (!mesa) throw new Error("Mesa no encontrada");

    const nuevaInscripcion: InscripcionExamen = {
      materiaId,
      mesaId,
      fecha: mesa.fecha,
      materiaNombre: mesaDisponible.materiaNombre,
      mesaNombre: mesa.nombre,
    };

    // Simulamos añadir la inscripción (en un entorno real esto se guardaría en el backend)
    inscripcionesMock.push(nuevaInscripcion);

    return Promise.resolve(nuevaInscripcion);
  }

  try {
    const response = await axios.post<InscripcionExamen>(
      `${API_URL}/inscripciones`,
      { materiaId, mesaId }
    );
    return response.data;
  } catch (error) {
    console.error("Error al inscribir examen:", error);
    throw error;
  }
};

// Función para desinscribir de un examen
export const desinscribirExamen = async (
  materiaId: string,
  mesaId: string
): Promise<void> => {
  if (USE_MOCK) {
    // Eliminar la inscripción del array local
    const index = inscripcionesMock.findIndex(
      (i) => i.materiaId === materiaId && i.mesaId === mesaId
    );
    if (index !== -1) {
      inscripcionesMock.splice(index, 1);
    }

    return Promise.resolve();
  }

  try {
    await axios.delete(`${API_URL}/inscripciones/${materiaId}/${mesaId}`);
  } catch (error) {
    console.error("Error al desinscribir examen:", error);
    throw error;
  }
};

// Función para obtener el plan de estudios
export const getPlanEstudio = async (): Promise<PlanEstudio> => {
  if (USE_MOCK) {
    return Promise.resolve(planEstudioMock);
  }

  try {
    const response = await axios.get<PlanEstudio>(`${API_URL}/plan-estudio`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener plan de estudio:", error);
    throw error;
  }
};

// Función para obtener los requisitos de una materia
export const getRequisitosMateria = async (
  materiaId: string
): Promise<RequisitosMateria | undefined> => {
  if (USE_MOCK) {
    const requisitos = requisitosMateriasMock.find(
      (r) => r.materiaId === materiaId
    );
    return Promise.resolve(requisitos);
  }

  try {
    const response = await axios.get<RequisitosMateria>(
      `${API_URL}/materias/${materiaId}/requisitos`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error al obtener requisitos para materia ${materiaId}:`,
      error
    );
    throw error;
  }
};

// Función para obtener detalles completos de una materia con sus correlativas
export const getMateriaConCorrelativas = async (
  materiaId: string
): Promise<{
  materia: Materia | undefined;
  correlativas: Materia[];
  requisitos: RequisitosMateria | undefined;
}> => {
  if (USE_MOCK) {
    const materia = materiasMock.find((m) => m.id === materiaId);
    let correlativas: Materia[] = [];

    if (materia?.correlativas && materia.correlativas.length > 0) {
      correlativas = materiasMock.filter((m) =>
        materia.correlativas?.includes(m.id)
      );
    }

    const requisitos = requisitosMateriasMock.find(
      (r) => r.materiaId === materiaId
    );

    return Promise.resolve({
      materia,
      correlativas,
      requisitos,
    });
  }

  try {
    const responses = await Promise.all([
      axios.get<Materia>(`${API_URL}/materias/${materiaId}`),
      axios.get<Materia[]>(`${API_URL}/materias/${materiaId}/correlativas`),
      axios.get<RequisitosMateria>(
        `${API_URL}/materias/${materiaId}/requisitos`
      ),
    ]);

    return {
      materia: responses[0].data,
      correlativas: responses[1].data,
      requisitos: responses[2].data,
    };
  } catch (error) {
    console.error(
      `Error al obtener materia ${materiaId} con correlativas:`,
      error
    );
    throw error;
  }
};

// Función para determinar si una materia se puede cursar
export const puedeRecursarMateria = (
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
};

// Función para determinar el estado de cursabilidad de una materia
export const getEstadoCursabilidad = (
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
};
