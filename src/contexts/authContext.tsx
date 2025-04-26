import { createContext, useContext, useState } from "react";
import React from "react";
import { EstudianteService } from "../services/api/alumno/estudianteService";

type User = {
  dni: number;
  name: string;
  email: string;
  role: string;
};

interface AuthContextType {
  user: User | null; // el usuario puede existir o ser null si nadie inició sesión
  login: (user: User) => void;
  logout: () => void; // función para cerrar sesión
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // estado para guardar el usuario

  const login = (user: User) => {
    setUser(user); // guardamos al usuario en el estado
  };

  const logout = () => {
    setUser(null); // eliminamos al usuario del estado
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
