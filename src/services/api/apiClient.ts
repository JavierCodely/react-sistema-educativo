import axios from "axios";

const API_URL = "http://localhost:3001/api";
const USE_MOCK = true;

export const apiClient ={

    get: async <T>(endpoint: string): Promise<T> => {
        try {
            
            const response = await axios.get<T>(`${API_URL}/${endpoint}`);
            return response.data;
        } catch (error) {
            console.error("Error al obtener datos:", `${endpoint}`, error);
            throw error;
        }
    },

    post: async <T>(endpoint: string, data: any): Promise<T> => {
        try {
            const response = await axios.post<T>(`${API_URL}/${endpoint}`, data);
            return response.data;
        } catch (error) {
            console.error("Error al enviar datos:", `${endpoint}`, error);
            throw error;
        }
    },

    delete: async (endpoint: string): Promise<void> => {
        try {
          await axios.delete(`${API_URL}${endpoint}`);
        } catch (error) {
          console.error(`Error deleting from ${endpoint}:`, error);
          throw error;
        }
      },
      
      isMockEnabled: () => USE_MOCK
    
    
    
}
