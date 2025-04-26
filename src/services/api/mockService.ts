// src/mocks/mockService.ts
import {
    estudianteMock,
    materiasMock,
    mesasDisponiblesMock,
    inscripcionesMock,
    planEstudioMock,
    requisitosMateriasMock,
    horariosMateriasMock,
    modulosHorariosMock,
    diasSemanaMock,
  } from "../../mocks/alumnoMock";
  
  import {
    Estudiante,
    Materia,
    MesaDisponible,
    InscripcionExamen,
    PlanEstudio,
    RequisitosMateria
  } from "../../types/alumnoTypes";
  
  export const MockService = {
    getEstudiante: (): Estudiante => estudianteMock[0],
    
    getMaterias: (): Materia[] => materiasMock,
    
    getMesasDisponibles: (): MesaDisponible[] => mesasDisponiblesMock,
    
    getInscripciones: (): InscripcionExamen[] => inscripcionesMock,
    
    inscribirExamen: (materiaId: string, mesaId: string): InscripcionExamen => {
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
  
      inscripcionesMock.push(nuevaInscripcion);
      return nuevaInscripcion;
    },
    
    desinscribirExamen: (materiaId: string, mesaId: string): void => {
      const index = inscripcionesMock.findIndex(
        (i) => i.materiaId === materiaId && i.mesaId === mesaId
      );
      if (index !== -1) {
        inscripcionesMock.splice(index, 1);
      }
    },
    
    getPlanEstudio: (): PlanEstudio => planEstudioMock,
    
    getRequisitosMateria: (materiaId: string): RequisitosMateria | undefined => {
      return requisitosMateriasMock.find((r) => r.materiaId === materiaId);
    },
    
    getMateriaConCorrelativas: (materiaId: string): {
      materia: Materia | undefined;
      correlativas: Materia[];
      requisitos: RequisitosMateria | undefined;
    } => {
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
  
      return {
        materia,
        correlativas,
        requisitos,
      };
    }
  };