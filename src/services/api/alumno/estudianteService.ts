// src/services/estudianteService.ts
import { apiClient } from "../apiClient";
import { MockService } from "../mockService";
import { Estudiante } from "../../../types/alumnoTypes";

export const EstudianteService = {
  getEstudiante: async (): Promise<Estudiante> => {
    if (apiClient.isMockEnabled()) {
      return Promise.resolve(MockService.getEstudiante());
    }
    
    return apiClient.get<Estudiante>("/estudiante");
  }
};