import type { JsonArray, JsonObject } from "../../mock/json.types";
import { API_LANGUAGE } from "../api.config";
import type { HttpClient } from "../http.client";

// ---------- content-service real (mismos metodos que el mock) ----------
export class ContentApiService {
  constructor(private readonly http: HttpClient) {}

  // ---------- peliculas ----------
  getNowPlayingMovies(): Promise<JsonObject> {
    return this.list("/content/movies/now-playing");
  }

  getPopularMovies(): Promise<JsonObject> {
    return this.list("/content/movies/popular");
  }

  getTopRatedMovies(): Promise<JsonObject> {
    return this.list("/content/movies/top-rated");
  }

  getUpcomingMovies(): Promise<JsonObject> {
    return this.list("/content/movies/upcoming");
  }

  // ---------- series ----------
  getOnTheAir(): Promise<JsonObject> {
    return this.list("/content/tv/on-the-air");
  }

  getPopularTv(): Promise<JsonObject> {
    return this.list("/content/tv/popular");
  }

  getTopRatedTv(): Promise<JsonObject> {
    return this.list("/content/tv/top-rated");
  }

  discoverTv(): Promise<JsonObject> {
    return this.list("/content/tv/discover");
  }

  // ---------- detalle ----------
  getMovieDetails(tmdbId: number): Promise<JsonObject | null> {
    return this.detail(`/content/movies/${tmdbId}`);
  }

  getTvDetails(tmdbId: number): Promise<JsonObject | null> {
    return this.detail(`/content/tv/${tmdbId}`);
  }

  // el bulk es interno y el gateway lo bloquea; el perfil real ya trae los favoritos completos
  async getBulkContent(_items: JsonArray): Promise<JsonArray> {
    return [];
  }

  // ---------- helpers ----------
  private async list(path: string): Promise<JsonObject> {
    const res = await this.http.get<JsonObject>(path, { query: { language: API_LANGUAGE } });

    // 1. si falla devuelvo una lista vacia con el mismo formato
    return res.ok && res.data ? res.data : { page: 1, results: [], total_pages: 0, total_results: 0 };
  }

  private async detail(path: string): Promise<JsonObject | null> {
    const res = await this.http.get<JsonObject>(path, { query: { language: API_LANGUAGE } });

    return res.ok ? res.data : null;
  }
}
