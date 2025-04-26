// src/services/planEstudioService.ts
import { apiClient } from "../../api/apiClient";
import { MockService } from "../../api/mockService";
import { PlanEstudio } from "../../../types/alumnoTypes";

export const PlanEstudioService = {
  getPlanEstudio: async (): Promise<PlanEstudio> => {
    if (apiClient.isMockEnabled()) {
      return Promise.resolve(MockService.getPlanEstudio());
    }
    
    return apiClient.get<PlanEstudio>("/plan-estudio");
  }
};