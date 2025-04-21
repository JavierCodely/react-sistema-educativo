export type User = {
  dni: number;
  name: string;
  email: string;
  password: string;
  role: "alumno" | "profesor" | "preceptor";
};

// Simulamos una "base de datos" con usuarios reales
export const mockUsers: User[] = [
  {
    dni: 12345678,
    name: "Juan Perez",
    email: "alumno@ejemplo.com",
    password: "1234",
    role: "alumno",
  },
  {
    dni: 87654321,
    name: "Ana Garcia",
    email: "profe@ejemplo.com",
    password: "abcd",
    role: "profesor",
  },
  {
    dni: 11223344,
    name: "Pedro Lopez",
    email: "preceptor@ejemplo.com",
    password: "admin",
    role: "preceptor",
  },
];

// src/mock/alumnoMocks.ts
import { Estudiante, Materia, EstadoMateria, MesaDisponible, InscripcionExamen } from '../types/alumnoTypes';

export const estudianteMock: Estudiante = {
  id: '1',
  nombre: 'Agustin',
  apellido: 'Villalba',
  carrera: 'Tecnicatura en Tecnologías de la Información',
  materiasAprobadas: 15,
  promedio: 8.75
};

export const materiasMock: Materia[] = [
  { id: '1', nombre: 'Análisis Matemático I', anio: 1, estado: EstadoMateria.PROMOCION, codigo: 'AM1' },
  { id: '2', nombre: 'Algebra y Geometría Analítica', anio: 1, estado: EstadoMateria.PROMOCION, codigo: 'AGA' },
  { id: '3', nombre: 'Física I', anio: 1, estado: EstadoMateria.REGULAR, codigo: 'F1' },
  { id: '4', nombre: 'Química General', anio: 1, estado: EstadoMateria.REGULAR, codigo: 'QG' },
  { id: '5', nombre: 'Inglés Técnico I', anio: 1, estado: EstadoMateria.PROMOCION, codigo: 'IT1' },
  
  { id: '6', nombre: 'Análisis Matemático II', anio: 2, estado: EstadoMateria.CURSANDO, codigo: 'AM2', correlativas: ['1'] },
  { id: '7', nombre: 'Física II', anio: 2, estado: EstadoMateria.FALTA_CORRELATIVA, codigo: 'F2', correlativas: ['3'] },
  { id: '8', nombre: 'Programación I', anio: 2, estado: EstadoMateria.REGULAR, codigo: 'P1' },
  { id: '9', nombre: 'Sistemas Operativos', anio: 2, estado: EstadoMateria.LIBRE, codigo: 'SO' },
  { id: '10', nombre: 'Inglés Técnico II', anio: 2, estado: EstadoMateria.REGULAR, codigo: 'IT2', correlativas: ['5'] },
  
  { id: '11', nombre: 'Bases de Datos', anio: 3, estado: EstadoMateria.NO_CURSADO, codigo: 'BD', correlativas: ['8'] },
  { id: '12', nombre: 'Redes', anio: 3, estado: EstadoMateria.NO_CURSADO, codigo: 'RED', correlativas: ['9'] },
  { id: '13', nombre: 'Programación II', anio: 3, estado: EstadoMateria.CURSANDO, codigo: 'P2', correlativas: ['8'] },
  { id: '14', nombre: 'Ingeniería de Software', anio: 3, estado: EstadoMateria.NO_CURSADO, codigo: 'IS', correlativas: ['8'] },
];

export const mesasDisponiblesMock: MesaDisponible[] = [
  {
    materiaId: '3',
    materiaNombre: 'Física I',
    mesas: [
      { id: 'm1-f1', nombre: 'Mesa 1', fecha: '2025-05-10' },
      { id: 'm2-f1', nombre: 'Mesa 2', fecha: '2025-05-24' }
    ]
  },
  {
    materiaId: '4',
    materiaNombre: 'Química General',
    mesas: [
      { id: 'm1-qg', nombre: 'Mesa 1', fecha: '2025-05-12' },
      { id: 'm2-qg', nombre: 'Mesa 2', fecha: '2025-05-26' }
    ]
  },
  {
    materiaId: '8',
    materiaNombre: 'Programación I',
    mesas: [
      { id: 'm1-p1', nombre: 'Mesa 1', fecha: '2025-05-15' },
      { id: 'm2-p1', nombre: 'Mesa 2', fecha: '2025-05-29' }
    ]
  },
  {
    materiaId: '9',
    materiaNombre: 'Sistemas Operativos',
    mesas: [
      { id: 'm1-so', nombre: 'Mesa 1', fecha: '2025-05-18' },
      { id: 'm2-so', nombre: 'Mesa 2', fecha: '2025-06-01' }
    ]
  },
  {
    materiaId: '10',
    materiaNombre: 'Inglés Técnico II',
    mesas: [
      { id: 'm1-it2', nombre: 'Mesa 1', fecha: '2025-05-20' },
      { id: 'm2-it2', nombre: 'Mesa 2', fecha: '2025-06-03' }
    ]
  }
];

export const inscripcionesMock: InscripcionExamen[] = [
  {
    materiaId: '3',
    mesaId: 'm1-f1',
    fecha: '2025-05-10',
    materiaNombre: 'Física I',
    mesaNombre: 'Mesa 1'
  }
];
