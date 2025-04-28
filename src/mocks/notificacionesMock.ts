
import { Notificacion, TipoNotificacion } from "../types/notificacionTypes";

export const notificacionesMock: Notificacion[] = [
  {
    id: "1",
    titulo: "Nota de examen registrada",
    mensaje: "Se ha registrado una nueva nota en tu examen de Comunicación",
    tipo: TipoNotificacion.EXAMEN,
    fecha: "2025-04-26T10:30:00",
    leida: false,
    detalles: {
      materia: "Comunicación",
      profesor: "Cuenca",
      nota: 7
    }
  },
  {
    id: "2",
    titulo: "Nota de examen registrada",
    mensaje: "Se ha registrado una nueva nota en tu examen de Inglés II",
    tipo: TipoNotificacion.EXAMEN,
    fecha: "2025-04-25T14:15:00",
    leida: true,
    detalles: {
      materia: "Inglés II",
      profesor: "Errasti",
      nota: 8
    }
  },
  {
    id: "3",
    titulo: "Inscripción Plan Progresar",
    mensaje: "Ya están abiertas las inscripciones para el Plan Progresar. El bono para estudiantes ofrece ayuda económica mensual.",
    tipo: TipoNotificacion.BECA,
    fecha: "2025-04-23T09:00:00",
    leida: false,
    link: "/becas/progresar"
  },
  {
    id: "4",
    titulo: "Plan Potenciar Trabajo",
    mensaje: "Se abre la convocatoria para inscribirse al Plan Potenciar Trabajo para estudiantes universitarios.",
    tipo: TipoNotificacion.BECA,
    fecha: "2025-04-20T16:45:00",
    leida: false,
    link: "/becas/potenciar-trabajo"
  },
  {
    id: "5",
    titulo: "Recordatorio de inscripción a finales",
    mensaje: "La fecha límite para inscribirte a los exámenes finales es el 15 de mayo.",
    tipo: TipoNotificacion.ACADEMICO,
    fecha: "2025-04-18T11:20:00",
    leida: true
  }
];