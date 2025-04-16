export type User = {
  email: string;
  password: string;
  role: "alumno" | "profesor" | "preceptor";
};

// Simulamos una "base de datos" con usuarios reales
export const mockUsers: User[] = [
  { email: "alumno@ejemplo.com", password: "1234", role: "alumno" },
  { email: "profe@ejemplo.com", password: "abcd", role: "profesor" },
  { email: "preceptor@ejemplo.com", password: "admin", role: "preceptor" },
];
