// src/pages/api/create-user.ts
// Este archivo debe estar en un directorio de API o funciones Edge de Supabase

import { supabase } from '../../services/auth/supabase/supabaseClient';

// Configuración de cliente Supabase con claves de servicio
// ADVERTENCIA: Este código debe ejecutarse ÚNICAMENTE en el servidor/backend

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { email, nombre, dni, rol } = req.body;

  if (!email || !nombre || !dni || !rol) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  try {
    // 1. Crear el usuario en Supabase Auth (sin contraseña)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true, // Confirmar email automáticamente
      user_metadata: { nombre, dni, rol },
      password: undefined, // Sin contraseña - el usuario deberá establecerla
    });

    if (authError) {
      return res.status(400).json({ message: `Error al crear usuario: ${authError.message}` });
    }

    const userId = authData.user.id;

    // 2. Crear el perfil en la tabla 'usuario'
    const { error: profileError } = await supabase
      .from('usuario')
      .insert([
        {
          id: userId, // Usar el mismo ID generado por Supabase Auth
          email,
          nombre,
          dni,
          rol
        }
      ]);

    if (profileError) {
      // Si falla la creación del perfil, eliminamos el usuario de Auth
      await supabase.auth.admin.deleteUser(userId);
      return res.status(400).json({ 
        message: `Error al crear perfil: ${profileError.message}`,
      });
    }

    // 3. Enviar email de "reseteo" de contraseña para que el usuario la establezca
    const { error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/establecer-password`,
      }
    });

    if (resetError) {
      return res.status(200).json({ 
        message: 'Usuario creado pero el correo de activación no pudo ser enviado',
        userId,
        emailError: resetError.message
      });
    }

    return res.status(200).json({ 
      message: 'Usuario creado correctamente. Se ha enviado un correo de activación.',
      userId
    });
  } catch (error) {
    console.error('Error en API create-user:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}