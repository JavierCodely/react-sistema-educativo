import { supabase } from './supabase/supabaseClient';


export async function handler(req, res) {
  
  // Verificar autenticación del usuario que hace la solicitud (debe ser admin/preceptor)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado' });
  }
  
  const token = authHeader.split(' ')[1];
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  
  if (authError || !user) {
    return res.status(401).json({ message: 'No autorizado' });
  }
  
  // Verificar si el usuario es preceptor
  const { data: profile, error: profileError } = await supabase
    .from('usuario')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (profileError || !profile || profile.role !== 'preceptor') {
    return res.status(403).json({ message: 'Acceso denegado' });
  }
  
  // Procesar la solicitud para crear un nuevo usuario
  try {
    const { email, name, dni, role } = req.body;
    
    // Validaciones
    if (!email || !name || !dni || !role) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    
    if (!email.endsWith('@its.edu.ar')) {
      return res.status(400).json({ message: 'Solo se permiten correos institucionales (@its.edu.ar)' });
    }
    
    if (!['alumno', 'profesor', 'preceptor'].includes(role)) {
      return res.status(400).json({ message: 'Rol no válido' });
    }
    
    // 1. Crear usuario con una contraseña aleatoria temporal
    const temporaryPassword = Math.random().toString(36).substring(2, 15);
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
    });
    
    if (userError) {
      throw new Error(`Error al crear usuario: ${userError.message}`);
    }
    
    // 2. Enviar correo para establecer contraseña
    const { error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
    });
    
    if (resetError) {
      throw new Error(`Error al enviar enlace de activación: ${resetError.message}`);
    }
    
    // 3. Actualizar perfil con datos adicionales
    const { error: profileUpdateError } = await supabase
      .from('usuario')
      .update({ name, dni, role })
      .eq('id', userData.user.id);
    
    if (profileUpdateError) {
      throw new Error(`Error al actualizar perfil: ${profileUpdateError.message}`);
    }
    
    return res.status(200).json({ 
      message: 'Usuario creado exitosamente',
      user: { 
        id: userData.user.id,
        email,
        name,
        dni,
        role
      }
    });
    
  } catch (error) {
    console.error('Error en la creación de usuario:', error);
    return res.status(500).json({ message: error.message || 'Error del servidor' });
  }
}