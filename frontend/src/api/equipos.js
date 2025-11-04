import axiosInstance from "./axiosInstance";

export async function fetchEquipos(params = {}) {
  try {
    const response = await axiosInstance.get("/registrations/", { params });
    return response.data; 
  } catch (error) {
    console.error("Error al obtener equipos:", error);
    throw error.response?.data?.detail || "Error al conectar con el servidor";
  }
}
