
export enum TipoNotificacion {
    ACADEMICO = "ACADEMICO",
    ADMINISTRATIVO = "ADMINISTRATIVO",
    BECA = "BECA",
    EXAMEN = "EXAMEN"
  }
  
  export interface Notificacion {
    id: string;
    titulo: string;
    mensaje: string;
    tipo: TipoNotificacion;
    fecha: string;
    leida: boolean;
    link?: string;
    detalles?: {
      materia?: string;
      profesor?: string;
      nota?: number;
    };
  }