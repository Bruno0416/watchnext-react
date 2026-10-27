import type { JsonObject } from "../json.types";

type MediaDetailsData = {
  movies: Record<string, JsonObject>;
  tv: Record<string, JsonObject>;
};

export class MediaDetailsDb {
  private pending: Promise<MediaDetailsData> | null = null;

  // ---------- carga del fixture ----------
  private load(): Promise<MediaDetailsData> {
    if (!this.pending) {
      // 1. compartir la carga entre peticiones y permitir reintentos si falla
      this.pending = fetch("/data/media-details.json")
        .then((response) => {
          if (!response.ok) throw new Error("No se pudo cargar el detalle de contenido");
          return response.json() as Promise<MediaDetailsData>;
        })
        .catch((error: unknown) => {
          this.pending = null;
          throw error;
        });
    }
    return this.pending;
  }

  // ---------- consulta por tipo e id ----------
  async getById(section: "movies" | "tv", tmdbId: number): Promise<JsonObject | null> {
    // 1. recuperar el detalle por su identificador
    const data = await this.load();
    return data[section][tmdbId] ?? null;
  }
}
