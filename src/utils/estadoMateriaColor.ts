
import { EstadoMateria } from "../types/alumnoTypes";

export const getEstadoColor = (estado: EstadoMateria): string => {
  switch (estado) {
    case EstadoMateria.PROMOCION:
    case EstadoMateria.APROBADO:
      return "success";
    case EstadoMateria.REGULAR:
      return "info";
    case EstadoMateria.CURSANDO:
      return "primary";
    case EstadoMateria.LIBRE:
      return "danger";
    case EstadoMateria.FALTA_CORRELATIVA:
      return "warning";
    case EstadoMateria.NO_CURSADO:
    default:
      return "secondary";
  }
};
