// src/pages/preceptor/CrearUsuarios.tsx
import React, { useState } from 'react';
import { UserService, UserCreateData } from '../../services/api/userService';

export default function CrearUsuarios() {
  const [formData, setFormData] = useState<UserCreateData>({
    email: '',
    name: '',
    dni: 0,
    role: 'alumno',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [users, setUsers] = useState<any[]>([]);
  const [showUsersList, setShowUsersList] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'dni' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setIsLoading(true);

    try {
      // Validaciones básicas
      if (!formData.email || !formData.name || !formData.dni || formData.dni === 0) {
        throw new Error('Todos los campos son obligatorios');
      }

      if (!formData.email.endsWith('@its.edu.ar')) {
        throw new Error('Solo se permiten correos institucionales (@its.edu.ar)');
      }

      // Llamar al servicio para crear usuario
      await UserService.createUser(formData);
      
      setMessage({
        text: `Usuario ${formData.name} (${formData.email}) creado exitosamente`,
        type: 'success',
      });
      
      // Limpiar formulario
      setFormData({
        email: '',
        name: '',
        dni: 0,
        role: 'alumno',
      });
      
    } catch (error) {
      setMessage({
        text: error.message || 'Error al crear usuario',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await UserService.getAllUsers();
      setUsers(data);
      setShowUsersList(true);
    } catch (error) {
      setMessage({
        text: error.message || 'Error al cargar usuarios',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Gestión de Usuarios</h1>
      
      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
          {message.text}
        </div>
      )}
      
      <div className="card">
        <div className="card-header">
          <h2>Crear nuevo usuario</h2>
          <p>Los usuarios creados recibirán un correo para activar su cuenta</p>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nombre completo</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dni">DNI</label>
              <input
                type="number"
                className="form-control"
                id="dni"
                name="dni"
                value={formData.dni || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="usuario@its.edu.ar"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <small className="form-text text-muted">
                Debe ser un correo institucional (@its.edu.ar)
              </small>
            </div>
            
            <div className="form-group">
              <label htmlFor="role">Rol</label>
              <select
                className="form-control"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                <option value="alumno">Alumno</option>
                <option value="profesor">Profesor</option>
                <option value="preceptor">Preceptor</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading}
            >
              {isLoading ? 'Creando...' : 'Crear usuario'}
            </button>
          </form>
        </div>
      </div>
      
      <div className="mt-4">
        <button 
          className="btn btn-secondary"
          onClick={() => setShowUsersList(!showUsersList)}
        >
          {showUsersList ? 'Ocultar usuarios' : 'Mostrar todos los usuarios'}
        </button>
        
        {showUsersList && (
          <div className="card mt-3">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3>Listado de usuarios</h3>
              <button 
                className="btn btn-sm btn-outline-primary" 
                onClick={loadUsers}
                disabled={isLoading}
              >
                Actualizar
              </button>
            </div>
            <div className="card-body">
              {users.length === 0 ? (
                <p>No hay usuarios registrados o haz clic en "Actualizar"</p>
              ) : (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>DNI</th>
                      <th>Email</th>
                      <th>Rol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.dni}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}