// src/services/api/userService.ts
import { supabase } from '../auth/supabase/supabaseClient';

export type UserCreateData = {
  email: string;
  name: string;
  dni: number;
  role: 'alumno' | 'profesor' | 'preceptor';
};

export class UserService {
  /**
   * Crea un nuevo usuario en el sistema (solo para administradores)
   * 
   * Esta función crea tanto el usuario en Supabase Auth como el perfil en la tabla 'usuario'
   */
  static async createUser(userData: UserCreateData) {
    // Verificamos que sea un email institucional
    if (!userData.email.endsWith('@its.edu.ar')) {
      throw new Error('Solo se permiten correos institucionales (@its.edu.ar)');
    }

    try {
      // Esta es una implementación para desarrollo - en producción debe ser desde un backend seguro
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los usuarios del sistema (solo para administradores)
   */
  static async getAllUsers() {
    const { data, error } = await supabase
      .from('usuario')
      .select('*');

    if (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }

    return data;
  }

  /**
   * Verifica si existe un perfil para un usuario específico
   * @param userId - ID del usuario a verificar
   */
  static async checkUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('usuario')
      .select('id, email, nombre, dni, rol')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      throw new Error(`Error al verificar perfil: ${error.message}`);
    }

    return { exists: !!data, profile: data };
  }
}