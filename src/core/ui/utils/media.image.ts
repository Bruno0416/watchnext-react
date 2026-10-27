// ---------- imagenes de contenido ----------

export type MediaImageSize = "w342" | "w780" | "original";

export function getMediaImageUrl(
  path: string | null | undefined,
  size: MediaImageSize = "w342",
): string | null {
  // 1. comprobar que exista una ruta
  if (!path) return null;

  // 2. conservar urls absolutas existentes
  if (/^https?:\/\//i.test(path)) return path;

  // 3. construir la url de tmdb
  return `https://image.tmdb.org/t/p/${size}/${path.replace(/^\/+/, "")}`;
}
