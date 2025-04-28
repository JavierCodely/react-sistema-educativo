// src/services/inscripcionesService.ts
import { apiClient } from "../apiClient";
import { MockService } from "../mockService";
import { MesaDisponible, InscripcionExamen, EstadoMateria } from "../../../types/alumnoTypes";

export const InscripcionesService = {
  //servicios de inscripciones
  getMesasDisponibles: async (): Promise<MesaDisponible[]> => {
    if (apiClient.isMockEnabled()) {
      return Promise.resolve(MockService.getMesasDisponibles());
    }
    
    return apiClient.get<MesaDisponible[]>("/mesas-disponibles");
  },
  //servicios de inscripciones
  getInscripciones: async (): Promise<InscripcionExamen[]> => {
    if (apiClient.isMockEnabled()) {
      return Promise.resolve(MockService.getInscripciones());
    }
    
    return apiClient.get<InscripcionExamen[]>("/inscripciones");
  },
  //servicios de inscripciones
  setInscribirExamen: async (materiaId: string, mesaId: string, estado?: EstadoMateria): Promise<InscripcionExamen> => {
    if (apiClient.isMockEnabled()) {
      return Promise.resolve(MockService.inscribirExamen(materiaId, mesaId, estado));
    }
    
    // Incluimos el estado en el cuerpo de la petición
    return apiClient.post<InscripcionExamen>("/inscripciones", { materiaId, mesaId, estado });
  },
  //servicios de inscripciones
  desinscribirExamen: async (materiaId: string, mesaId: string): Promise<void> => {
    if (apiClient.isMockEnabled()) {
      MockService.desinscribirExamen(materiaId, mesaId);
      return Promise.resolve();
    }
    
    return apiClient.delete(`/inscripciones/${materiaId}/${mesaId}`);
  }
};