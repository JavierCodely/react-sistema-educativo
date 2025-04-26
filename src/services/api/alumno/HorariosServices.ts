// Archivo de servicio para gestionar horarios académicos
// Centraliza todas las operaciones relacionadas con horarios de materias
import {
  HorarioMateria,
  modulosHorariosMock,
  diasSemanaMock,
  horariosMateriasMock,
} from "../../../mocks/alumnoMock";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Declaración para extender el tipo jsPDF con el método autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Interfaz para el formato exportable de horarios (usado en PDF)
interface HorarioExportable {
  dia: string; // Nombre del día (Lunes, Martes, etc.)
  modulo: string; // Identificador del módulo horario
  horario: string; // Franja horaria (ej: "18:30-19:10")
  materia: string; // Nombre de la materia
  profesor: string; // Nombre del profesor
}

class HorariosService {
  // URL base para la API
  private API_URL = "http://localhost:3001/api";

  // Método principal para obtener los horarios de materias
  // Intenta conectarse al backend, con fallback a datos mock
  async getHorarioMaterias() {
    console.log("Getting horario materias...");
    try {
      // Intentar obtener datos del backend
      //const response = await axios.get(`${this.API_URL}/horarios/materias`);
      //return response.data;
      return horariosMateriasMock; // Usando datos mock por ahora
    } catch (error) {
      console.warn(
        "No se pudo conectar al backend para horarios, usando datos mock",
        error
      );
      // Fallback a datos mock
      return horariosMateriasMock;
    }
  }

  // Método alternativo para obtener todos los horarios
  async getHorarios() {
    return await this.getHorarioMaterias();
  }

  // Método para filtrar horarios por año académico
  async getHorariosPorAnio(anio: number) {
    try {
      // Intentar obtener datos filtrados del backend
      //const response = await axios.get(`${this.API_URL}/horarios/materias/anio/${anio}`);
      //return response.data;
      return horariosMateriasMock;
    } catch (error) {
      console.warn(
        `No se pudo conectar al backend para horarios de año ${anio}, filtrando datos mock`,
        error
      );
      // Filtrar datos mock por año
      const todosHorarios = await this.getHorarioMaterias();
      return todosHorarios.filter((horario: any) => horario.anio === anio);
    }
  }

  // Método para obtener los días de la semana
  async getDiasSemana() {
    console.log("Getting dias semana...");
    try {
      // Intentar obtener datos del backend
      //const response = await axios.get(`${this.API_URL}/horarios/dias`);
      //return response.data;
      return diasSemanaMock; // Usando datos mock
    } catch (error) {
      console.warn(
        "No se pudo conectar al backend para días de semana, usando datos mock",
        error
      );
      // Fallback a datos mock
      return diasSemanaMock;
    }
  }

  // Método para obtener los módulos horarios (franjas horarias)
  async getModulosHorarios() {
    console.log("Getting modulos horarios...");
    try {
      // Intentar obtener datos del backend
      //const response = await axios.get(`${this.API_URL}/horarios/modulos`);
      //return response.data;
      return modulosHorariosMock; // Usando datos mock
    } catch (error) {
      console.warn(
        "No se pudo conectar al backend para módulos de horarios, usando datos mock",
        error
      );
      // Fallback a datos mock
      return modulosHorariosMock;
    }
  }

  // Método para generar un horario semanal formateado por módulos y días
  async generarHorarioSemanal(anioSeleccionado?: number) {
    // TODO: Implementar backend
    console.log("Generating horario semanal...");
    try {
      // Obtener los horarios (filtrados por año si es necesario)
      const horariosMaterias = anioSeleccionado
        ? await this.getHorariosPorAnio(anioSeleccionado)
        : await this.getHorarioMaterias();

      // Estructura para almacenar el horario semanal organizado por módulo y día
      const horarioSemanal: { [modulo: number]: { [dia: number]: any[] } } = {};

      // Validar que tengamos datos válidos
      if (!horariosMaterias || !Array.isArray(horariosMaterias)) {
        console.error("Invalid horariosMaterias data:", horariosMaterias);
        return {};
      }

      // Procesar los datos para construir el horario
      horariosMaterias.forEach((materia: any) => {
        // Filtrar por año si es necesario
        if (!anioSeleccionado || materia.anio === anioSeleccionado) {
          // Procesar solo si tiene días asignados
          if (materia.dias && Array.isArray(materia.dias)) {
            materia.dias.forEach((diaObj: any) => {
              // Verificar que tenga módulos asignados
              if (diaObj.modulos && Array.isArray(diaObj.modulos)) {
                diaObj.modulos.forEach((modulo: string) => {
                  // Convertir ID de módulo a número
                  const moduloNum = parseInt(modulo);

                  // Inicializar estructura si no existe
                  if (!horarioSemanal[moduloNum]) {
                    horarioSemanal[moduloNum] = {};
                  }
                  if (!horarioSemanal[moduloNum][diaObj.diaId]) {
                    horarioSemanal[moduloNum][diaObj.diaId] = [];
                  }

                  // Agregar la materia al horario
                  horarioSemanal[moduloNum][diaObj.diaId].push({
                    materiaNombre: materia.materia,
                    profesor: materia.profesor || "A confirmar",
                    anio: materia.anio,
                  });
                });
              }
            });
          }
        }
      });

      console.log("Horario semanal generated:", horarioSemanal);
      return horarioSemanal;
    } catch (error) {
      console.error("Error al generar horario semanal:", error);
      return {}; // Retorna objeto vacío en caso de error
    }
  }

  // Método para convertir datos de horarios a formato exportable para PDF
  convertirAFormatoExportable(horarios: any[]): HorarioExportable[] {
    const datos: HorarioExportable[] = [];

    // Obtener datos de módulos y días para mostrar información completa
    const modulos = modulosHorariosMock;
    const dias = diasSemanaMock;

    // Recorrer cada materia y aplanar sus horarios
    horarios.forEach((materia) => {
      materia.dias.forEach((diaObj: any) => {
        // Buscar el objeto día para obtener su nombre
        const dia = dias.find((d) => d.id === diaObj.diaId);

        // Recorrer los módulos asignados a la materia en este día
        diaObj.modulos.forEach((moduloId: string) => {
          // Buscar información del módulo (horario)
          const modulo = modulos.find((m) => m.id === parseInt(moduloId));

          // Solo agregar si encontramos el día y el módulo
          if (dia && modulo) {
            datos.push({
              dia: dia.nombre,
              modulo: `Módulo ${modulo.id}`,
              horario: `${modulo.horaInicio} - ${modulo.horaFin}`,
              materia: materia.materia,
              profesor: materia.profesor || "A confirmar",
            });
          }
        });
      });
    });

    return datos;
  }

  // Método para exportar horarios a un documento PDF
  async exportarAPDF(anioSeleccionado?: number) {
    try {
      // Crear un nuevo documento PDF
      const doc = new jsPDF();

      // Configurar el título según el filtro de año
      const titulo = anioSeleccionado
        ? `Horarios - Año ${anioSeleccionado}`
        : "Horarios Completos";
      doc.setFontSize(18);
      doc.text(titulo, 14, 22);

      // Obtener datos de horarios según el filtro
      const horarios = anioSeleccionado
        ? await this.getHorariosPorAnio(anioSeleccionado)
        : await this.getHorarioMaterias();

      // Obtener información completa de módulos y días
      const modulos = await this.getModulosHorarios();
      const dias = await this.getDiasSemana();

      // Preparar datos aplanados para la tabla
      const datos: any[] = [];

      // Procesar cada materia y sus horarios
      horarios.forEach((materia) => {
        // Aplicar filtro por año si es necesario
        if (!anioSeleccionado || materia.anio === anioSeleccionado) {
          materia.dias.forEach((diaObj: any) => {
            diaObj.modulos.forEach((moduloId: string) => {
              // Buscar información completa del módulo y día
              const modulo = modulos.find((m) => m.id === parseInt(moduloId));
              const dia = dias.find((d) => d.id === diaObj.diaId);

              // Solo agregar si encontramos el módulo y día
              if (modulo && dia) {
                datos.push({
                  materia: materia.materia,
                  profesor: materia.profesor || "A confirmar",
                  diaNombre: dia.nombre,
                  diaId: dia.id,
                  moduloId: modulo.id,
                  horaInicio: modulo.horaInicio,
                  horaFin: modulo.horaFin,
                });
              }
            });
          });
        }
      });

      // Separar horarios por turno: mañana y tarde
      const datosManana = datos.filter((item) => item.horaInicio < "13:00");
      const datosTarde = datos.filter((item) => item.horaInicio >= "13:00");

      // Posición vertical inicial en el documento
      let posY = 30;

      // Función auxiliar para construir una tabla de horarios
      const construirTabla = (datosTabla: any[], tituloTurno: string) => {
        // No hacer nada si no hay datos para este turno
        if (datosTabla.length === 0) return;

        // Agregar título del turno
        doc.setFontSize(14);
        doc.text(tituloTurno, 14, posY);
        posY += 8;

        // Obtener lista de módulos únicos ordenados
        const modulosUnicos = [
          ...new Set(datosTabla.map((item) => item.moduloId)),
        ].sort((a, b) => a - b);

        // Convertir IDs de módulos a formato legible
        const modulosHorariosUnicos = modulosUnicos.map((id) => {
          const modulo = modulos.find((m) => m.id === id);
          return { id, horario: `${modulo?.horaInicio}-${modulo?.horaFin}` };
        });

        // Construir filas de la tabla
        const body = modulosHorariosUnicos.map(({ id, horario }) => {
          // Primera columna: franja horaria
          const fila = [horario];

          // Columnas para cada día (lunes a viernes)
          for (let dia = 1; dia <= 5; dia++) {
            // Buscar materia para este día y módulo
            const materia = datosTabla.find(
              (item) => item.diaId === dia && item.moduloId === id
            );
            // Agregar nombre de materia o celda vacía
            fila.push(materia ? materia.materia : "");
          }

          return fila;
        });

        // Generar tabla con plugin autoTable
        autoTable(doc, {
          head: [
            ["Horario", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
          ],
          body: body,
          startY: posY,
          styles: { fontSize: 10, cellPadding: 3 },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 30 },
            2: { cellWidth: 30 },
            3: { cellWidth: 30 },
            4: { cellWidth: 30 },
            5: { cellWidth: 30 },
          },
        });

        // Actualizar posición para siguiente tabla
        posY = (doc as any).lastAutoTable.finalY + 10;
      };

      // Generar tablas para los diferentes turnos
      if (datosManana.length > 0) {
        construirTabla(datosManana, "Turno Mañana");
      }

      if (datosTarde.length > 0) {
        construirTabla(datosTarde, "Turno Tarde");
      }

      // Generar nombre del archivo según filtro
      const nombreArchivo = anioSeleccionado
        ? `Horarios_Año_${anioSeleccionado}.pdf`
        : "Horarios_Completos.pdf";

      // Guardar el archivo PDF
      doc.save(nombreArchivo);
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      alert(
        "Hubo un problema al generar el PDF. Por favor intente nuevamente."
      );
    }
  }
}


export default new HorariosService();
