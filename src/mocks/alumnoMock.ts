// src/mock/alumnoMocks.ts
import {
  Estudiante,
  Materia,
  EstadoMateria,
  MesaDisponible,
  InscripcionExamen,
} from "../types/alumnoTypes";

export const estudianteMock: Estudiante[] = [
  {
    id: "1",
    nombre: "Agustin",
    apellido: "Villalba",
    carrera: "Tecnicatura Superior en Tecnología de la Información",
    cursando: 3,
    materiasAprobadas: 10,
    promedio: 7.8,
    email: "alumno@ejemplo.com",
    password: "1234@admin", //hola si estas mirando el codigo xd
    role: "alumno",
  },
];

export const materiasMock: Materia[] = [
  // Primer año
  {
    id: "1",
    nombre: "Redes",
    anio: 1,
    estado: EstadoMateria.PROMOCION,
    codigo: "RED1",
    notas: [
      {
        id: "1",
        nota: 8,
      },
    ],
  },
  {
    id: "2",
    nombre: "Matemática",
    anio: 1,
    estado: EstadoMateria.PROMOCION,
    codigo: "MAT",
    notas: [
      {
        id: "2",
        nota: 8,
      },
    ],
  },
  {
    id: "3",
    nombre: "Física Aplicada",
    anio: 1,
    estado: EstadoMateria.PROMOCION,
    codigo: "FIS",
    notas: [
      {
        id: "3",
        nota: 8,
      },
    ],
  },
  {
    id: "4",
    nombre: "Inglés I",
    anio: 1,
    estado: EstadoMateria.PROMOCION,
    codigo: "ING1",
    notas: [
      {
        id: "4",
        nota: 8,
      },
    ],
  },
  {
    id: "5",
    nombre: "Práctica Profesionalizante I",
    anio: 1,
    estado: EstadoMateria.PROMOCION,
    codigo: "PP1",
    notas: [
      {
        id: "5",
        nota: 8,
      },
    ],
  },
  {
    id: "6",
    nombre: "Comunicación",
    anio: 1,
    estado: EstadoMateria.LIBRE,
    codigo: "COM",
    notas: [
      {
        id: "6",
        nota: 7,
      },
    ],
  },
  {
    id: "7",
    nombre: "Teoría de los Sistemas",
    anio: 1,
    estado: EstadoMateria.LIBRE,
    codigo: "TS",
    notas: [
      {
        id: "7",
        nota: 0,
      },
    ],
  },

  // Segundo año
  {
    id: "8",
    nombre: "Teoría de la información",
    anio: 2,
    estado: EstadoMateria.PROMOCION,
    codigo: "TI",
    notas: [
      {
        id: "8",
        nota: 8,
      },
    ],
  },
  {
    id: "9",
    nombre: "Algoritmos y estructuras de datos",
    anio: 2,
    estado: EstadoMateria.PROMOCION,
    codigo: "AED",
    notas: [
      {
        id: "9",
        nota: 8,
      },
    ],
  },
  {
    id: "10",
    nombre: "Lógica y programación II",
    anio: 2,
    estado: EstadoMateria.PROMOCION,
    codigo: "LP2",
    notas: [
      {
        id: "10",
        nota: 8,
      },
    ],
  },
  {
    id: "11",
    nombre: "Base de Datos",
    anio: 2,
    estado: EstadoMateria.PROMOCION,
    codigo: "BD",
    notas: [
      {
        id: "11",
        nota: 8,
      },
    ],
  },
  {
    id: "12",
    nombre: "Estadística",
    anio: 2,
    estado: EstadoMateria.PROMOCION,
    codigo: "EST",
    notas: [
      {
        id: "12",
        nota: 8,
      },
    ],
  },
  {
    id: "13",
    nombre: "Práctica profesionalizante II",
    anio: 2,
    estado: EstadoMateria.PROMOCION,
    codigo: "PP2",
    notas: [
      {
        id: "13",
        nota: 8,
      },
    ],
  },
  {
    id: "14",
    nombre: "Inglés II",
    anio: 2,
    estado: EstadoMateria.REGULAR,
    codigo: "ING2",
    correlativas: ["4"],
    notas: [
      {
        id: "14",
        nota: 6,
      },
    ],
  },
  {
    id: "15",
    nombre: "Derecho y legislación laboral",
    anio: 2,
    estado: EstadoMateria.FALTA_CORRELATIVA,
    codigo: "DLL",
    correlativas: ["6"],
    notas: [
      {
        id: "15",
        nota: 8,
      },
    ],
  },

  // Tercer año
  {
    id: "16",
    nombre: "Inglés III",
    anio: 3,
    estado: EstadoMateria.CURSANDO,
    codigo: "ING3",
    correlativas: ["14"],
    notas: [
      {
        id: "16",
        nota: 0,
      },
    ],
  },
  {
    id: "17",
    nombre: "Integridad y Migración de Datos",
    anio: 3,
    estado: EstadoMateria.CURSANDO,
    codigo: "IMD",
    correlativas: ["11"],
    notas: [
      {
        id: "17",
        nota: 0,
      },
    ],
  },
  {
    id: "18",
    nombre: "Inteligencia artificial",
    anio: 3,
    estado: EstadoMateria.CURSANDO,
    codigo: "IA",
    correlativas: ["9", "10"],
    notas: [
      {
        id: "18",
        nota: 0,
      },
    ],
  },
  {
    id: "19",
    nombre: "Administración de Sistemas operativos y redes",
    anio: 3,
    estado: EstadoMateria.CURSANDO,
    codigo: "ASOR",
    correlativas: ["1"],
    notas: [
      {
        id: "19",
        nota: 0,
      },
    ],
  },
  {
    id: "20",
    nombre: "Sistemas Distribuidos",
    anio: 3,
    estado: EstadoMateria.CURSANDO,
    codigo: "SD",
    notas: [
      {
        id: "20",
        nota: 0,
      },
    ],
  },
  {
    id: "21",
    nombre: "Práctica profesionalizante III",
    anio: 3,
    estado: EstadoMateria.CURSANDO,
    codigo: "PP3",
    correlativas: ["13"],
    notas: [
      {
        id: "21",
        nota: 0,
      },
    ],
  },
];

export const mesasDisponiblesMock: MesaDisponible[] = [
  {
    materiaId: "6",
    materiaNombre: "Comunicación",
    estado: EstadoMateria.LIBRE,
    mesas: [
      { id: "m1-c", nombre: "Mesa 1", fecha: "2025-05-12" },
      { id: "m2-c", nombre: "Mesa 2", fecha: "2025-05-26" },
    ],
  },
  {
    materiaId: "7",
    materiaNombre: "Teoría de los Sistemas",
    estado: EstadoMateria.LIBRE,
    mesas: [
      { id: "m1-ts", nombre: "Mesa 1", fecha: "2025-05-15" },
      { id: "m2-ts", nombre: "Mesa 2", fecha: "2025-05-29" },
    ],
  },
  {
    materiaId: "14",
    materiaNombre: "Inglés II",
    estado: EstadoMateria.REGULAR,
    mesas: [
      { id: "m1-ing2", nombre: "Mesa 1", fecha: "2025-05-20" },
      { id: "m2-ing2", nombre: "Mesa 2", fecha: "2025-06-03" },
    ],
  },
  {
    materiaId: "15",
    materiaNombre: "Derecho y Legislación Laboral",
    estado: EstadoMateria.FALTA_CORRELATIVA,
    mesas: [
      { id: "m1-dll", nombre: "Mesa 1", fecha: "2025-05-22" },
      { id: "m2-dll", nombre: "Mesa 2", fecha: "2025-06-05" },
    ],
  },
];

export const inscripcionesMock: InscripcionExamen[] = [
  {
    materiaId: "6",
    mesaId: "m1-c",
    fecha: "2025-05-12",
    materiaNombre: "Comunicación",
    mesaNombre: "Mesa 1",
    estado: EstadoMateria.LIBRE,
  },
];

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

// Estructura para los requisitos de promoción/final
export interface RequisitosMateria {
  materiaId: string;
  requisitosPromocion: string[];
  requisitosFinales: string[];
  descripcionPromocion?: string;
  descripcionFinal?: string;
}

// Mock del plan de estudios actualizado según el horario proporcionado
export const planEstudioMock: PlanEstudio = {
  anios: [
    {
      anio: 1,
      cuatrimestres: [
        {
          cuatrimestre: 1,
          materias: ["1", "2", "3", "4", "5", "6", "7"],
        },
        {
          cuatrimestre: 2,
          materias: [],
        },
      ],
    },
    {
      anio: 2,
      cuatrimestres: [
        {
          cuatrimestre: 1,
          materias: ["8", "9", "10", "11", "12", "13", "14", "15"],
        },
        {
          cuatrimestre: 2,
          materias: [],
        },
      ],
    },
    {
      anio: 3,
      cuatrimestres: [
        {
          cuatrimestre: 1,
          materias: ["16", "17", "18", "19", "20", "21"],
        },
        {
          cuatrimestre: 2,
          materias: [],
        },
      ],
    },
  ],
};

// Mock de requisitos para promoción/final
export const requisitosMateriasMock: RequisitosMateria[] = [
  {
    materiaId: "14", // Inglés II
    requisitosPromocion: ["4"], // Inglés I
    requisitosFinales: ["4"],
    descripcionPromocion: "Aprobar con nota 7 o superior y 80% de asistencia",
  },
  {
    materiaId: "15", // Derecho y legislación laboral
    requisitosPromocion: ["6"], // Comunicación
    requisitosFinales: ["6"],
    descripcionPromocion: "Aprobar con nota 7 o superior y 80% de asistencia",
    descripcionFinal: "Tener aprobada la correlativa y aprobar examen final",
  },
  {
    materiaId: "16", // Inglés III
    requisitosPromocion: ["14"], // Inglés II
    requisitosFinales: ["14"],
    descripcionPromocion: "Aprobar con nota 7 o superior y 80% de asistencia",
  },
  {
    materiaId: "17", // Integridad y Migración de Datos
    requisitosPromocion: ["11"], // Base de Datos
    requisitosFinales: ["11"],
    descripcionPromocion:
      "Aprobar con nota 7 o superior y entregar proyecto final",
  },
  {
    materiaId: "18", // Inteligencia artificial
    requisitosPromocion: ["9", "10"], // Algoritmos y estructuras de datos, Lógica y programación II
    requisitosFinales: ["9", "10"],
    descripcionPromocion: "Aprobar con nota 7 o superior",
  },
  {
    materiaId: "19", // Administración de Sistemas operativos y redes
    requisitosPromocion: ["1"], // Redes
    requisitosFinales: ["1"],
    descripcionPromocion: "Aprobar con nota 7 o superior",
  },
  {
    materiaId: "21", // Práctica profesionalizante III
    requisitosPromocion: ["13"], // Práctica profesionalizante II
    requisitosFinales: ["13"],
    descripcionPromocion: "Completar la práctica y entregar informe final",
  },
];

// src/mock/horariosMock.ts
export interface DiaSemana {
  id: 1 | 2 | 3 | 4 | 5; // 1: Lunes, 2: Martes, 3: Miércoles, 4: Jueves, 5: Viernes
  nombre: string;
}

export interface ModuloHorario {
  id: number;
  horaInicio: string;
  horaFin: string;
}

export interface HorarioMateria {
  id: number;
  materia: string;
  profesor: string;
  anio: number;
  dias: {
    diaId: number;
    modulos: string[];
  }[];
}

export const diasSemanaMock: DiaSemana[] = [
  { id: 1, nombre: "Lunes" },
  { id: 2, nombre: "Martes" },
  { id: 3, nombre: "Miércoles" },
  { id: 4, nombre: "Jueves" },
  { id: 5, nombre: "Viernes" },
];

export const modulosHorariosMock: ModuloHorario[] = [
  { id: 1, horaInicio: "18:30", horaFin: "19:10" },
  { id: 2, horaInicio: "19:10", horaFin: "19:50" },
  { id: 3, horaInicio: "19:55", horaFin: "20:35" },
  { id: 4, horaInicio: "20:35", horaFin: "21:05" },
  { id: 5, horaInicio: "21:10", horaFin: "21:50" },
  { id: 6, horaInicio: "21:50", horaFin: "22:30" },
];

export const horariosMateriasMock: HorarioMateria[] = [
  // Primer año
  {
    id: 1,
    materia: "Redes",
    profesor: "Olmedo",
    anio: 1,
    dias: [
      { diaId: 5, modulos: ["1", "2"] },
      { diaId: 4, modulos: ["4", "5"] },
    ],
  },
  {
    id: 2,
    materia: "Matemática",
    profesor: "Hulgren",
    anio: 1,
    dias: [{ diaId: 3, modulos: ["2", "3", "4"] }],
  },
  {
    id: 3,
    materia: "Física Aplicada",
    profesor: "Fedan",
    anio: 1,
    dias: [{ diaId: 2, modulos: ["3", "4", "5"] }],
  },
  {
    id: 4,
    materia: "Inglés I",
    profesor: "Errasti",
    anio: 1,
    dias: [{ diaId: 5, modulos: ["3", "4"] }],
  },
  {
    id: 5,
    materia: "Práctica Profesionalizante I",
    profesor: "Sosa",
    anio: 1,
    dias: [
      { diaId: 2, modulos: ["1", "2"] },
      { diaId: 3, modulos: ["1"] },
      { diaId: 4, modulos: ["1", "2", "3"] },
    ],
  },
  {
    id: 6,
    materia: "Comunicación",
    profesor: "Cuenca",
    anio: 1,
    dias: [{ diaId: 1, modulos: ["3", "4"] }],
  },
  {
    id: 7,
    materia: "Teoría de los Sistemas",
    profesor: "Alderete",
    anio: 1,
    dias: [
      { diaId: 1, modulos: ["1", "2"] },
      { diaId: 3, modulos: ["5", "6"] },
    ],
  },
  // Segundo Año
  {
    id: 8,
    materia: "Teoría de la Información",
    profesor: "Cuellar",
    anio: 2,
    dias: [{ diaId: 2, modulos: ["1", "2"] }],
  },
  {
    id: 9,
    materia: "Algoritmos y Estructuras de Datos",
    profesor: "Alderete",
    anio: 2,
    dias: [{ diaId: 3, modulos: ["1", "2", "3", "4"] }],
  },
  {
    id: 10,
    materia: "Lógica y Programación II",
    profesor: "Alderete",
    anio: 2,
    dias: [{ diaId: 1, modulos: ["3", "4", "5", "6"] }],
  },
  {
    id: 11,
    materia: "Base de Datos",
    profesor: "Sosa",
    anio: 2,
    dias: [{ diaId: 2, modulos: ["3", "4", "5"] }],
  },
  {
    id: 12,
    materia: "Estadística",
    profesor: "Alderete",
    anio: 2,
    dias: [{ diaId: 4, modulos: ["4", "5"] }],
  },
  {
    id: 13,
    materia: "Práctica Profesionalizante II",
    profesor: "Olmedo",
    anio: 2,
    dias: [
      { diaId: 4, modulos: ["1", "2", "3"] },
      { diaId: 5, modulos: ["3", "4"] },
    ],
  },
  {
    id: 14,
    materia: "Inglés II",
    profesor: "Errasti",
    anio: 2,
    dias: [{ diaId: 5, modulos: ["1", "2"] }],
  },
  {
    id: 15,
    materia: "Derecho y Legislación Laboral",
    profesor: "Cuenca",
    anio: 2,
    dias: [{ diaId: 1, modulos: ["1", "2"] }],
  },
  // Tercer Año
  {
    id: 16,
    materia: "Inglés III",
    profesor: "Errasti",
    anio: 3,
    dias: [{ diaId: 2, modulos: ["1", "2"] }],
  },
  {
    id: 17,
    materia: "Integridad y Migración de Datos",
    profesor: "Cuellar",
    anio: 3,
    dias: [{ diaId: 3, modulos: ["1", "2", "3", "4"] }],
  },
  {
    id: 18,
    materia: "Inteligencia Artificial",
    profesor: "Alderete",
    anio: 3,
    dias: [{ diaId: 4, modulos: ["1", "2", "3"] }],
  },
  {
    id: 19,
    materia: "Administración de Sistemas Operativos y Redes",
    profesor: "Cuellar",
    anio: 3,
    dias: [{ diaId: 3, modulos: ["3", "4", "5"] }],
  },
  {
    id: 20,
    materia: "Sistemas Distribuidos",
    profesor: "Arufe",
    anio: 3,
    dias: [
      { diaId: 3, modulos: ["4", "5"] },
      { diaId: 4, modulos: ["5", "6"] },
    ],
  },
  {
    id: 21,
    materia: "Práctica Profesionalizante III",
    profesor: "Arufe",
    anio: 3,
    dias: [{ diaId: 1, modulos: ["1", "2", "3", "4", "5"] }],
  },
];
