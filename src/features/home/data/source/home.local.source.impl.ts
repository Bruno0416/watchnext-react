import type { ContentService } from "../../../../core/mock/content/content.service";
import type { JsonObject } from "../../../../core/mock/json.types";
import { MediaType } from "../../../../core/models/media.type";
import { HomeError } from "../errors/home.errors";
import { HomeContentModel } from "../models/home.content.model";
import type { HomeLocalSource } from "./home.local.source";

export class HomeLocalSourceImpl implements HomeLocalSource {
  constructor(private readonly service: ContentService) {}
  // ---------- peliculas ----------
  getNowPlayingMovies(): Promise<HomeContentModel[]> {
    return this.getCategory(
      () => this.service.getNowPlayingMovies(),
      MediaType.MOVIE,
    );
  }

  getPopularMovies(): Promise<HomeContentModel[]> {
    return this.getCategory(
      () => this.service.getPopularMovies(),
      MediaType.MOVIE,
    );
  }

  getTopRatedMovies(): Promise<HomeContentModel[]> {
    return this.getCategory(
      () => this.service.getTopRatedMovies(),
      MediaType.MOVIE,
    );
  }

  getUpcomingMovies(): Promise<HomeContentModel[]> {
    return this.getCategory(
      () => this.service.getUpcomingMovies(),
      MediaType.MOVIE,
    );
  }

  // ---------- series ----------
  getOnTheAir(): Promise<HomeContentModel[]> {
    return this.getCategory(() => this.service.getOnTheAir(), MediaType.TV);
  }

  getPopularTv(): Promise<HomeContentModel[]> {
    return this.getCategory(() => this.service.getPopularTv(), MediaType.TV);
  }

  getTopRatedTv(): Promise<HomeContentModel[]> {
    return this.getCategory(() => this.service.getTopRatedTv(), MediaType.TV);
  }

  getDiscoverTv(): Promise<HomeContentModel[]> {
    return this.getCategory(() => this.service.discoverTv(), MediaType.TV);
  }

  // ---------- helper ----------
  private async getCategory(
    request: () => Promise<JsonObject | null>,
    mediaType: MediaType,
  ): Promise<HomeContentModel[]> {
    // 1. ejecutar peticion
    const response = await request();

    // 2. validar existencia de respuesta
    if (!response) {
      throw new HomeError(502, "Respuesta vacia del catalogo");
    }

    // 3. validar estructura de la respuesta
    const results = response.results;

    if (!Array.isArray(results)) {
      throw new HomeError(502, "Respuesta del catalogo invalida");
    }

    // 4. convertir resultados a modelos
    return results.map((item: unknown) => {
      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        throw new HomeError(502, "Contenido del catalogo invalido");
      }

      return HomeContentModel.fromJson(item as JsonObject, mediaType);
    });
  }
}
