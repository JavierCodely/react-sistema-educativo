// src/services/alumnoService.ts

import axios from "axios";
import {
  Estudiante,
  Materia,
  MesaDisponible,
  InscripcionExamen,
} from "../../../types/alumnoTypes";
import {
  estudianteMock,
  materiasMock,
  mesasDisponiblesMock,
  inscripcionesMock,
} from "../../../mocks/alumnoMock";

//const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";
const API_URL = "http://localhost:3001/api";
//const USE_MOCK = process.env.REACT_APP_USE_MOCK === "true" || true;
const USE_MOCK = true;

// Función para obtener los datos del estudiante
export const getEstudiante = async (): Promise<Estudiante> => {
  if (USE_MOCK) {
    return Promise.resolve(estudianteMock);
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
