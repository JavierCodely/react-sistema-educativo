
import { apiClient } from "../../api/apiClient";
import { MockService } from "../../api/mockService";
import { Materia, RequisitosMateria, EstadoMateria } from "../../../types/alumnoTypes";

export const MateriasService = {
  getMaterias: async (): Promise<Materia[]> => {
    if (apiClient.isMockEnabled()) {
      return Promise.resolve(MockService.getMaterias());
    }
    
    return apiClient.get<Materia[]>("/materias");
  },
  
  getRequisitosMateria: async (materiaId: string): Promise<RequisitosMateria | undefined> => {
    if (apiClient.isMockEnabled()) {
      return Promise.resolve(MockService.getRequisitosMateria(materiaId));
    }
    
    return apiClient.get<RequisitosMateria>(`/materias/${materiaId}/requisitos`);
  },
  
  getMateriaConCorrelativas: async (materiaId: string): Promise<{
    materia: Materia | undefined;
    correlativas: Materia[];
    requisitos: RequisitosMateria | undefined;
  }> => {
    if (apiClient.isMockEnabled()) {
      return Promise.resolve(MockService.getMateriaConCorrelativas(materiaId));
    }
    
    const [materiaRes, correlativasRes, requisitosRes] = await Promise.all([
      apiClient.get<Materia>(`/materias/${materiaId}`),
      apiClient.get<Materia[]>(`/materias/${materiaId}/correlativas`),
      apiClient.get<RequisitosMateria>(`/materias/${materiaId}/requisitos`),
    ]);
    
    return {
      materia: materiaRes,
      correlativas: correlativasRes,
      requisitos: requisitosRes,
    };
  }
};