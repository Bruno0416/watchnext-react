import type { JsonArray, JsonObject } from "../json.types";
import { CatalogDb } from "../content/catalog.db";

const RESULT_LIMIT = 20;

export class SearchService {
  private readonly catalogDb: CatalogDb;

  constructor(catalogDb: CatalogDb) {
    this.catalogDb = catalogDb;
  }

  // ---------- endpoints (simulados) ----------
  async search(query: string): Promise<JsonObject> {
    // 1. normalizar la consulta recibida
    const originalQuery = query;
    const executedQuery = this.normalize(query);

    if (executedQuery.length < 2) {
      return this.buildResponse(originalQuery, executedQuery, []);
    }

    // 2. obtener contenido liviano desde el catalogo
    const catalog = await this.catalogDb.getAll();
    const items = this.getCatalogItems(catalog);

    // 3. buscar ordenar y limitar resultados
    const matches = items
      .map((item) => ({
        item,
        score: this.getScore(this.getTitle(item), executedQuery),
      }))
      .filter((match) => match.score !== null)
      .sort((a, b) => {
        if (a.score !== b.score) {
          return (a.score as number) - (b.score as number);
        }

        return this.getPopularity(b.item) - this.getPopularity(a.item);
      })
      .slice(0, RESULT_LIMIT)
      .map(({ item }) => this.toSearchResult(item));

    // 4. devolver respuesta con el formato del microservicio real
    return this.buildResponse(originalQuery, executedQuery, matches);
  }

  // --- helper privado ---
  private getCatalogItems(catalog: JsonObject): JsonArray {
    const movies = catalog.movies as JsonObject;
    const tv = catalog.tv as JsonObject;

    const movieItems = [
      ...(movies.nowPlaying as JsonArray),
      ...(movies.popular as JsonArray),
      ...(movies.topRated as JsonArray),
      ...(movies.upcoming as JsonArray),
    ].map((item): JsonObject => ({ ...item, mediaType: "movie" }));

    const tvItems = [
      ...(tv.onTheAir as JsonArray),
      ...(tv.popular as JsonArray),
      ...(tv.topRated as JsonArray),
      ...(tv.discover as JsonArray),
    ].map((item): JsonObject => ({ ...item, mediaType: "tv" }));

    const unique = new Map<string, JsonObject>();

    for (const item of [...movieItems, ...tvItems]) {
      const key = `${String(item.mediaType)}:${String(item.id)}`;

      if (!unique.has(key)) {
        unique.set(key, item);
      }
    }

    return [...unique.values()];
  }

  private normalize(value: string): string {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  private getScore(title: string, query: string): number | null {
    const normalizedTitle = this.normalize(title);

    if (normalizedTitle === query) return 0;
    if (normalizedTitle.startsWith(query)) return 1;
    if (normalizedTitle.split(/\s+/).some((word) => word.startsWith(query))) {
      return 2;
    }
    if (normalizedTitle.includes(query)) return 3;

    return null;
  }

  private getTitle(item: JsonObject): string {
    return (item.title ?? item.name ?? "") as string;
  }

  private getPopularity(item: JsonObject): number {
    return (item.popularity ?? 0) as number;
  }

  private toSearchResult(item: JsonObject): JsonObject {
    const mediaType = item.mediaType as string;
    const date = (mediaType === "movie"
      ? item.release_date
      : item.first_air_date) as string | undefined;

    return {
      tmdbId: item.id,
      title: this.getTitle(item),
      overview:
        typeof item.overview === "string" && item.overview.trim()
          ? item.overview
          : null,
      posterPath: item.poster_path ?? null,
      mediaType,
      year: date ? Number(date.slice(0, 4)) : null,
      popularity: item.popularity ?? 0,
      voteAverage: item.vote_average ?? 0,
      knownForDepartment: mediaType,
    };
  }

  private buildResponse(
    originalQuery: string,
    executedQuery: string,
    results: JsonArray,
  ): JsonObject {
    return {
      content: {
        originalQuery,
        executedQuery,
        corrected: false,
        totalResults: results.length,
        results,
      },
      users: {
        content: [],
        page: 0,
        size: 20,
        totalElements: 0,
        totalPages: 0,
      },
      contentAvailable: true,
      usersAvailable: true,
    };
  }
}
