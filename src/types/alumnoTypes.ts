// src/types/alumnoTypes.ts

export interface Estudiante {
  dni: number;
  nombre: string;
  carrera: string;
  cursando: number;
  email: string;
  role: string;
  password: string;
  materiasAprobadas: number;
  promedio: number;
}

export enum EstadoMateria {
  CURSANDO = "Cursando",
  FALTA_CORRELATIVA = "Falta correlativa",
  REGULAR = "Regular",
  PROMOCION = "Promoción",
  APROBADO = "Aprobado",
  LIBRE = "Libre",
  NO_CURSADO = "No cursado",
}

export interface Nota {
  id: string;
  nota: number;
}

export interface Materia {
  id: string;
  nombre: string;
  anio: number;
  estado: EstadoMateria;
  notas: Nota[];
  codigo: string;
  correlativas?: string[];
  inscripcionExamen?: boolean;
}

export interface Mesa {
  id: string;
  nombre: string;
  fecha: string;
}

export interface MesaDisponible {
  materiaId: string;
  materiaNombre: string;
  estado: EstadoMateria;
  mesas: Mesa[];
}

export interface InscripcionExamen {
  materiaId: string;
  mesaId: string;
  fecha: string;
  materiaNombre: string;
  mesaNombre: string;
  estado: EstadoMateria;
}

// para la mierda del roadmap

export interface PlanEstudio {
  anios: AnioPlan[];
}

export interface AnioPlan {
  anio: number;
  cuatrimestres: CuatrimestrePlan[];
}

export interface CuatrimestrePlan {
  cuatrimestre: number;
  materias: string[]; // IDs de las materias
}

export interface RequisitosMateria {
  materiaId: string;
  requisitosPromocion: string[];
  requisitosFinales: string[];
  descripcionPromocion?: string;
  descripcionFinal?: string;
}
