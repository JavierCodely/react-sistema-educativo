  import { estudianteMock } from "../../mocks/alumnoMock";
import { Estudiante } from "../../types/alumnoTypes";
  
export function loginMock(
  email: string,
  password: string,
  role: string
): Promise<Estudiante> {
  return new Promise((resolve, reject) => {
    // Simulamos que el servidor tarda un poco
    setTimeout(() => {
      const user = estudianteMock.find(
        (u) =>

          u.email === email &&
          u.password === password &&
          u.role === role
      );

      if (user) {
        resolve(user);
      } else {
        reject(new Error("Credenciales inválidas"));
      }
    }, 1000); // Simula un "delay" de 1 segundo
  });
}
