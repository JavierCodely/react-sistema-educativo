export type User = {
  dni: number;
  name: string;
  email: string;
  password: string;
  role: "alumno" | "profesor" | "preceptor";
};

// Simulamos una "base de datos" con usuarios reales
export const mockUsers: User[] = [
  {
    dni: 12345678,
    name: "Juan Perez",
    email: "alumno@ejemplo.com",
    password: "1234",
    role: "alumno",
  },
  {
    dni: 87654321,
    name: "Ana Garcia",
    email: "profe@ejemplo.com",
    password: "abcd",
    role: "profesor",
  },
  {
    dni: 11223344,
    name: "Pedro Lopez",
    email: "preceptor@ejemplo.com",
    password: "admin",
    role: "preceptor",
  },
];
