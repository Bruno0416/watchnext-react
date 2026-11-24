import { apiJson, ApiHttpError } from "../../../../core/http/api.client";
import type { JsonObject } from "../../../../core/http/json.types";
import { MediaType } from "../../../../core/models/media.type";
import { HomeError } from "../errors/home.errors";
import { HomeContentModel } from "../models/home.content.model";
import type { HomeRemoteSource } from "./home.remote.source";

export class HomeRemoteSourceImpl implements HomeRemoteSource {
  getNowPlayingMovies() { return this.getCategory("movies/now-playing", MediaType.MOVIE); }
  getPopularMovies() { return this.getCategory("movies/popular", MediaType.MOVIE); }
  getTopRatedMovies() { return this.getCategory("movies/top-rated", MediaType.MOVIE); }
  getUpcomingMovies() { return this.getCategory("movies/upcoming", MediaType.MOVIE); }
  getOnTheAir() { return this.getCategory("tv/on-the-air", MediaType.TV); }
  getPopularTv() { return this.getCategory("tv/popular", MediaType.TV); }
  getTopRatedTv() { return this.getCategory("tv/top-rated", MediaType.TV); }
  getDiscoverTv() { return this.getCategory("tv/discover", MediaType.TV); }

  private async getCategory(path: string, type: MediaType): Promise<HomeContentModel[]> {
    try {
      // 1. consultar la categoria de contenidos en el backend
      const json = await apiJson<JsonObject>(`/api/v1/content/${path}`, {
        auth: "optional",
      });
      // 2. validar y convertir los resultados al modelo de la feature
      if (!Array.isArray(json.results)) throw new HomeError(502);
      return json.results.map((item: unknown) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          throw new HomeError(502);
        }
        return HomeContentModel.fromJson(item as JsonObject, type);
      });
    } catch (error) {
      // 3. traducir errores de comunicacion al dominio de inicio
      if (error instanceof ApiHttpError) throw new HomeError(error.status);
      if (error instanceof TypeError) throw new HomeError(0);
      throw error;
    }
  }
}
