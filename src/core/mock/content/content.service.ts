import type { JsonArray, JsonObject } from "../json.types";
import { CatalogDb } from "./catalog.db";

export class ContentService {
  private readonly catalogDb: CatalogDb;

  constructor(catalogDb: CatalogDb) {
    this.catalogDb = catalogDb;
  }

  // ---------- endpoints de peliculas ----------
  async getNowPlayingMovies(): Promise<JsonObject> {
    return this.getCategory("movies", "nowPlaying", true);
  }

  async getPopularMovies(): Promise<JsonObject> {
    return this.getCategory("movies", "popular", true);
  }

  async getTopRatedMovies(): Promise<JsonObject> {
    return this.getCategory("movies", "topRated", true);
  }

  async getUpcomingMovies(): Promise<JsonObject> {
    return this.getCategory("movies", "upcoming", true);
  }

  // ---------- endpoints de series ----------
  async getOnTheAir(): Promise<JsonObject> {
    return this.getCategory("tv", "onTheAir");
  }

  async getPopularTv(): Promise<JsonObject> {
    return this.getCategory("tv", "popular");
  }

  async getTopRatedTv(): Promise<JsonObject> {
    return this.getCategory("tv", "topRated");
  }

  async discoverTv(): Promise<JsonObject> {
    return this.getCategory("tv", "discover");
  }

  // ---------- endpoints internos ----------
  async getBulkContent(items: JsonArray): Promise<JsonArray> {
    // 1. cargar catalogo local
    const catalog = await this.catalogDb.getAll();

    // 2. resolver cada referencia contra el catalogo
    const results = await Promise.all(
      items.map((item) => this.findBasicContent(catalog, item)),
    );

    // 3. omitir referencias que no existen en el fixture
    return results.filter((item): item is JsonObject => item !== null);
  }

  // --- helper privado ---
  private async getCategory(
    section: "movies" | "tv",
    category: string,
    includeDates = false,
  ): Promise<JsonObject> {
    // 1. cargar el catalogo local
    const catalog = await this.catalogDb.getAll();
    const content = catalog[section] as JsonObject;

    // 2. obtener los resultados de la categoria solicitada
    const results = (content[category] as JsonArray | undefined) ?? [];

    // 3. construir respuesta con el formato del microservicio real
    const response: JsonObject = {
      page: 1,
      results,
      total_pages: 1,
      total_results: results.length,
    };

    if (includeDates) {
      response.dates = null;
    }

    return response;
  }

  private findBasicContent(
    catalog: JsonObject,
    reference: JsonObject,
  ): JsonObject | null {
    // 1. resolver seccion segun el tipo de contenido
    const mediaType = String(reference.mediaType ?? "").toUpperCase();
    const section = mediaType === "MOVIE" ? "movies" : "tv";
    const content = catalog[section] as JsonObject;

    // 2. buscar el contenido en las categorias disponibles
    const categories = Object.values(content).filter(Array.isArray) as JsonArray[];
    const item = categories
      .flat()
      .find((candidate) => candidate.id === reference.tmdbId);

    if (!item) {
      return null;
    }

    // 3. devolver detalle basico equivalente al endpoint interno
    const releaseDate = (mediaType === "MOVIE"
      ? item.release_date
      : item.first_air_date) as string | null | undefined;

    return {
      tmdbId: item.id,
      mediaType,
      title: item.title ?? item.name ?? null,
      posterPath: item.poster_path ?? null,
      voteAverage: item.vote_average ?? 0,
      releaseDate: releaseDate ?? null,
      duration: null,
      numberOfSeasons: null,
    };
  }
}
