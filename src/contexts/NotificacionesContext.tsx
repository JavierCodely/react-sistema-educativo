// src/context/NotificacionesContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notificacion } from '../types/notificacionTypes';
import NotificacionesService from '../services/api/notificaciones/notificacionesServices';

interface NotificacionesContextType {
  notificaciones: Notificacion[];
  notificacionesNoLeidas: number;
  loading: boolean;
  error: string | null;
  cargarNotificaciones: () => Promise<void>;
  marcarComoLeida: (id: string) => Promise<void>;
  marcarTodasComoLeidas: () => Promise<void>;
  eliminarNotificacion: (id: string) => Promise<void>;
}

const NotificacionesContext = createContext<NotificacionesContextType | undefined>(undefined);

export const useNotificaciones = () => {
  const context = useContext(NotificacionesContext);
  if (!context) {
    throw new Error('useNotificaciones debe ser usado dentro de un NotificacionesProvider');
  }
  return context;
};

interface NotificacionesProviderProps {
  children: ReactNode;
}

export const NotificacionesProvider: React.FC<NotificacionesProviderProps> = ({ children }) => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar notificaciones al iniciar
  useEffect(() => {
    cargarNotificaciones();
  }, []);

  // Función para cargar las notificaciones
  const cargarNotificaciones = async () => {
    try {
      setLoading(true);
      const data = await NotificacionesService.getNotificaciones();
      setNotificaciones(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las notificaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Marcar una notificación como leída
  const marcarComoLeida = async (id: string) => {
    try {
      await NotificacionesService.marcarComoLeida(id);
      setNotificaciones(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, leida: true } : notif
        )
      );
    } catch (err) {
      console.error('Error al marcar como leída:', err);
    }
  };

  // Marcar todas las notificaciones como leídas
  const marcarTodasComoLeidas = async () => {
    try {
      await NotificacionesService.marcarTodasComoLeidas();
      setNotificaciones(prev => 
        prev.map(notif => ({ ...notif, leida: true }))
      );
    } catch (err) {
      console.error('Error al marcar todas como leídas:', err);
    }
  };

  // Eliminar una notificación
  const eliminarNotificacion = async (id: string) => {
    try {
      await NotificacionesService.eliminarNotificacion(id);
      setNotificaciones(prev => prev.filter(notif => notif.id !== id));
    } catch (err) {
      console.error('Error al eliminar notificación:', err);
    }
  };

  // Contar notificaciones no leídas
  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;

  const value: NotificacionesContextType = {
    notificaciones,
    notificacionesNoLeidas,
    loading,
    error,
    cargarNotificaciones,
    marcarComoLeida,
    marcarTodasComoLeidas,
    eliminarNotificacion
  };

  return (
    <NotificacionesContext.Provider value={value}>
      {children}
    </NotificacionesContext.Provider>
  );
};