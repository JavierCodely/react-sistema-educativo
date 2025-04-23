// src/types/alumnoTypes.ts

export interface Estudiante {
    id: string;
    nombre: string;
    apellido: string;
    carrera: string;
    materiasAprobadas: number;
    promedio: number;
  }
  
  export enum EstadoMateria {
    CURSANDO = 'Cursando',
    FALTA_CORRELATIVA = 'Falta correlativa',
    REGULAR = 'Regular',
    PROMOCION = 'Promoción',
    LIBRE = 'Libre',
    NO_CURSADO = 'No cursado'
  }
  
  export interface Materia {
    id: string;
    nombre: string;
    anio: number;
    estado: EstadoMateria;
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
    mesas: Mesa[];
  }
  
  export interface InscripcionExamen {
    materiaId: string;
    mesaId: string;
    fecha: string;
    materiaNombre: string;
    mesaNombre: string;
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