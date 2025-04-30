// src/context/NotificacionesContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notificacion } from '../types/notificacionTypes';
import NotificacionesService from '../services/api/notificaciones/notificacionesServices';

interface NotificacionesContextType {
  notificaciones: Notificacion[]; 
  notificacionesNoLeidas: number;
  loading: boolean;
  error: string | null;
  //funciones para las notificaciones
  cargarNotificaciones: () => Promise<void>;
  //funciones para marcar como leída
  marcarComoLeida: (id: string) => Promise<void>;
  //funciones para marcar todas como leídas
  marcarTodasComoLeidas: () => Promise<void>;
  //funciones para eliminar una notificacion
  eliminarNotificacion: (id: string) => Promise<void>;
}
//creamos el contexto
const NotificacionesContext = createContext<NotificacionesContextType | undefined>(undefined); 

//creamos el hook para usar el contexto
export const useNotificaciones = () => {
  //obtenemos el contexto
  const context = useContext(NotificacionesContext);
  //si no existe el contexto, lanzamos un error
  if (!context) {
    throw new Error('useNotificaciones debe ser usado dentro de un NotificacionesProvider');
  }
  //retornamos el contexto
  return context;
};

//creamos el provider para usar el contexto
interface NotificacionesProviderProps {
  children: ReactNode;
}
//creamos el provider para usar el contexto 
export const NotificacionesProvider: React.FC<NotificacionesProviderProps> = ({ children }) => {
  //creamos el estado para las notificaciones
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  //creamos el estado para el loading
  const [loading, setLoading] = useState<boolean>(true);
  //creamos el estado para el error
  const [error, setError] = useState<string | null>(null);

  // Cargar notificaciones al iniciar
  useEffect(() => {
    //cargamos las notificaciones
    cargarNotificaciones();
  }, []);

  // Función para cargar las notificaciones
  const cargarNotificaciones = async () => {
    try {
      setLoading(true);
      //obtenemos las notificaciones
      const data = await NotificacionesService.getNotificaciones();
      //seteamos las notificaciones
      setNotificaciones(data);
      //seteamos el error a null
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
      //marcamos la notificación como leída
      await NotificacionesService.marcarComoLeida(id);
      //seteamos las notificaciones
      setNotificaciones(prev => 
        //mapeamos las notificaciones
        prev.map(notif => 
          //si la notificación es la que queremos marcar como leída, la marcamos como leída
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
      //marcamos todas las notificaciones como leídas
      await NotificacionesService.marcarTodasComoLeidas();
      //seteamos las notificaciones
      setNotificaciones(prev => 
        //mapeamos las notificaciones
        prev.map(notif => ({ ...notif, leida: true }))
      );
    } catch (err) {
      console.error('Error al marcar todas como leídas:', err);
    }
  };

  // Eliminar una notificación
  const eliminarNotificacion = async (id: string) => {
    try {
      //eliminamos la notificación
      await NotificacionesService.eliminarNotificacion(id);
      //seteamos las notificaciones
      setNotificaciones(prev =>
        //filtramos las notificaciones
        prev.filter(notif => notif.id !== id)
      );
    } catch (err) {
      console.error('Error al eliminar notificación:', err);
    }
  };

  // Contar notificaciones no leídas
  const notificacionesNoLeidas = notificaciones.filter(n => !n.leida).length;

  //creamos el valor para el contexto
  const value: NotificacionesContextType = {
    //seteamos las notificaciones
    notificaciones,
    //seteamos el numero de notificaciones no leídas
    notificacionesNoLeidas,
    //seteamos el loading
    loading,
    //seteamos el error
    error,
    //seteamos la funcion para cargar las notificaciones
    cargarNotificaciones,
    //seteamos la funcion para marcar como leída
    marcarComoLeida,
    //seteamos la funcion para marcar todas como leídas
    marcarTodasComoLeidas,
    //seteamos la funcion para eliminar una notificacion
    eliminarNotificacion
  };

  //retornamos el provider
  return (
    //seteamos el valor para el contexto
    <NotificacionesContext.Provider value={value}>
      {children}
    </NotificacionesContext.Provider>
  );
};