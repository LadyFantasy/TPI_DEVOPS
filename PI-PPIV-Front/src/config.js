// Configuración de URLs del backend
const config = {
  // URL del backend desde variable de entorno o fallback
  baseUrl: import.meta.env.VITE_API_URL || "https://tpi-devops-bzi6.onrender.com"
};

export default config;
