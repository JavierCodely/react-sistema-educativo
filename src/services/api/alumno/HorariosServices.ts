// Updated HorariosService.ts with all methods
// src/services/HorariosService.ts
import {
  HorarioMateria,
  modulosHorariosMock,
  diasSemanaMock,
  horariosMateriasMock,
} from "../../../mocks/alumnoMock";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface HorarioExportable {
  dia: string;
  modulo: string;
  horario: string;
  materia: string;
  profesor: string;
}

interface HorarioAplanado {
  materia: string;
  profesor: string;
  dia: number;
  modulo: number;
}

class HorariosService {
  // Configuración base API
  //private API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  private API_URL = "http://localhost:3001/api";
  // Método para obtener horarios con fallback a mock
  async getHorarioMaterias() {
    console.log("Getting horario materias...");
    try {
      // Intentar obtener datos del backend
      //const response = await axios.get(`${this.API_URL}/horarios/materias`);
      //return response.data;
      return horariosMateriasMock;
    } catch (error) {
      console.warn(
        "No se pudo conectar al backend para horarios, usando datos mock",
        error
      );
      // Fallback a datos mock
      return horariosMateriasMock;
    }
  }

  // Obtener todos los horarios
  async getHorarios() {
    return await this.getHorarioMaterias();
  }

  // Obtener horarios filtrados por año
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

  // Método para obtener días de la semana
  async getDiasSemana() {
    console.log("Getting dias semana...");
    try {
      // Intentar obtener datos del backend
      //const response = await axios.get(`${this.API_URL}/horarios/dias`);
      //return response.data;
      return diasSemanaMock;
    } catch (error) {
      console.warn(
        "No se pudo conectar al backend para días de semana, usando datos mock",
        error
      );
      // Fallback a datos mock
      return diasSemanaMock;
    }
  }

  // Método para obtener módulos de horarios
  async getModulosHorarios() {
    console.log("Getting modulos horarios...");
    try {
      // Intentar obtener datos del backend
      //const response = await axios.get(`${this.API_URL}/horarios/modulos`);
      //return response.data;
      return modulosHorariosMock;
    } catch (error) {
      console.warn(
        "No se pudo conectar al backend para módulos de horarios, usando datos mock",
        error
      );
      // Fallback a datos mock
      return modulosHorariosMock;
    }
  }

  // Generar un horario semanal en formato de tabla
  async generarHorarioSemanal(anioSeleccionado?: number) {
    console.log("Generating horario semanal...");
    try {
      // Obtener los horarios (con backend o mock según disponibilidad)
      const horariosMaterias = anioSeleccionado
        ? await this.getHorariosPorAnio(anioSeleccionado)
        : await this.getHorarioMaterias();

      const horarioSemanal: { [modulo: number]: { [dia: number]: any[] } } = {};
      if (!horariosMaterias || !Array.isArray(horariosMaterias)) {
        console.error("Invalid horariosMaterias data:", horariosMaterias);
        return {};
      }

      // Procesar los datos para construir el horario
      horariosMaterias.forEach((materia: any) => {
        if (!anioSeleccionado || materia.anio === anioSeleccionado) {
          if (materia.dias && Array.isArray(materia.dias)) {
            materia.dias.forEach((diaObj: any) => {
              // Add check for modulos
              if (diaObj.modulos && Array.isArray(diaObj.modulos)) {
                diaObj.modulos.forEach((modulo: string) => {
                  const moduloNum = parseInt(modulo);
                  if (!horarioSemanal[moduloNum]) {
                    horarioSemanal[moduloNum] = {};
                  }
                  if (!horarioSemanal[moduloNum][diaObj.diaId]) {
                    horarioSemanal[moduloNum][diaObj.diaId] = [];
                  }
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
      return {};
    }
  }

  // Convertir los datos a formato exportable para PDF
  convertirAFormatoExportable(horarios: any[]): HorarioExportable[] {
    const datos: HorarioExportable[] = [];

    // Obtener los datos de módulos y días desde los mocks para tener la info de horarios
    const modulos = modulosHorariosMock;
    const dias = diasSemanaMock;

    horarios.forEach((materia) => {
      materia.dias.forEach((diaObj: any) => {
        const dia = dias.find((d) => d.id === diaObj.diaId);

        diaObj.modulos.forEach((moduloId: string) => {
          const modulo = modulos.find((m) => m.id === parseInt(moduloId));

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

  // Exportar horarios a PDF
  async exportarAPDF(anioSeleccionado?: number) {
    try {
      const doc = new jsPDF();
  
      const titulo = anioSeleccionado
        ? `Horarios - Año ${anioSeleccionado}`
        : "Horarios Completos";
      doc.setFontSize(18);
      doc.text(titulo, 14, 22);
  
      const horarios = anioSeleccionado
        ? await this.getHorariosPorAnio(anioSeleccionado)
        : await this.getHorarioMaterias();
  
      const modulos = await this.getModulosHorarios();
      const dias = await this.getDiasSemana();
      // Aplanar horarios
      const datos: any[] = [];
  
      horarios.forEach((materia) => {
        if (!anioSeleccionado || materia.anio === anioSeleccionado) {
          materia.dias.forEach((diaObj: any) => {
            diaObj.modulos.forEach((moduloId: string) => {
              const modulo = modulos.find((m) => m.id === parseInt(moduloId));
              const dia = dias.find((d) => d.id === diaObj.diaId);
  
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
  
      // Dividir horarios mañana y tarde automáticamente
      const datosManana = datos.filter((item) => item.horaInicio < "13:00");
      const datosTarde = datos.filter((item) => item.horaInicio >= "13:00");
  
      let posY = 30; // posición inicial en el PDF
  
      // Función para construir tabla de horarios
      const construirTabla = (datosTabla: any[], tituloTurno: string) => {
        if (datosTabla.length === 0) return; // si no hay datos, no hacer nada
  
        // Agregar subtítulo de turno
        doc.setFontSize(14);
        doc.text(tituloTurno, 14, posY);
        posY += 8;
  
        const modulosUnicos = [...new Set(datosTabla.map(item => item.moduloId))].sort((a, b) => a - b);
        const modulosHorariosUnicos = modulosUnicos.map(id => {
          const modulo = modulos.find(m => m.id === id);
          return { id, horario: `${modulo?.horaInicio}-${modulo?.horaFin}` };
        });
  
        const body = modulosHorariosUnicos.map(({ id, horario }) => {
          const fila = [horario];
  
          for (let dia = 1; dia <= 5; dia++) {
            const materia = datosTabla.find(item => item.diaId === dia && item.moduloId === id);
            fila.push(materia ? materia.materia : "");
          }
  
          return fila;
        });
  
        autoTable(doc, {
          head: [["Horario", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]],
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
  
        posY = (doc as any).lastAutoTable.finalY + 10; // actualizar para dejar espacio abajo
      };
  
      // Construir las tablas según los turnos
      if (datosManana.length > 0) {
        construirTabla(datosManana, "Turno Mañana");
      }
  
      if (datosTarde.length > 0) {
        construirTabla(datosTarde, "Turno Tarde");
      }
  
      // Guardar el archivo
      const nombreArchivo = anioSeleccionado
        ? `Horarios_Año_${anioSeleccionado}.pdf`
        : "Horarios_Completos.pdf";
  
      doc.save(nombreArchivo);
  
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      alert("Hubo un problema al generar el PDF. Por favor intente nuevamente.");
    }
  }
}

export default new HorariosService();
