// ---------- configuracion de la api ----------
// VITE_USE_API=true usa los microservicios; si no, siguen los mocks
export const USE_API = import.meta.env.VITE_USE_API === "true";

// el gateway de los microservicios; en desarrollo pasa por el proxy de vite
export const API_URL = import.meta.env.VITE_API_URL ?? "/api/v1";

// idioma que se le pide a tmdb a traves de content-service
export const API_LANGUAGE = import.meta.env.VITE_API_LANGUAGE ?? "es-MX";
