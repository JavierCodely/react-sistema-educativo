// src/services/notificacionesService.ts
import axios from 'axios';
import { Notificacion } from '../../../types/notificacionTypes';
import { notificacionesMock } from '../../../mocks/notificacionesMock';

// URL base para las solicitudes de API (cuando se implemente el backend)
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const API_URL = 'http://localhost:8080/api';
class NotificacionesService {
  // Obtener todas las notificaciones del usuario
  async getNotificaciones(): Promise<Notificacion[]> {
    try {
      // Cuando se implemente el backend:
      // const response = await axios.get(`${API_URL}/notificaciones`);
      // return response.data;
      
      // Usando mock data por ahora:
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(notificacionesMock);
        }, 300); // Simulamos un delay de red
      });
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      throw error;
    }
  }

  // Marcar una notificación como leída
  async marcarComoLeida(id: string): Promise<Notificacion> {
    try {
      // Cuando se implemente el backend:
      // const response = await axios.patch(`${API_URL}/notificaciones/${id}/leer`);
      // return response.data;
      
      // Usando mock data por ahora:
      return new Promise((resolve) => {
        setTimeout(() => {
          const notificacion = notificacionesMock.find(n => n.id === id);
          if (notificacion) {
            notificacion.leida = true;
            resolve({...notificacion});
          }
          throw new Error('Notificación no encontrada');
        }, 300);
      });
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
      throw error;
    }
  }

  // Marcar todas las notificaciones como leídas
  async marcarTodasComoLeidas(): Promise<void> {
    try {
      // Cuando se implemente el backend:
      // await axios.patch(`${API_URL}/notificaciones/leer-todas`);
      
      // Usando mock data por ahora:
      return new Promise((resolve) => {
        setTimeout(() => {
          notificacionesMock.forEach(n => n.leida = true);
          resolve();
        }, 300);
      });
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
      throw error;
    }
  }

  // Eliminar una notificación
  async eliminarNotificacion(id: string): Promise<void> {
    try {
      // Cuando se implemente el backend:
      // await axios.delete(`${API_URL}/notificaciones/${id}`);
      
      // Usando mock data por ahora:
      return new Promise((resolve) => {
        setTimeout(() => {
          const index = notificacionesMock.findIndex(n => n.id === id);
          if (index !== -1) {
            notificacionesMock.splice(index, 1);
            resolve();
          }
          throw new Error('Notificación no encontrada');
        }, 300);
      });
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
      throw error;
    }
  }
}

export default new NotificacionesService();