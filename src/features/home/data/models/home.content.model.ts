import type { JsonObject } from "../../../../core/mock/json.types";
import { MediaType } from "../../../../core/models/media.type";
import { HomeContent } from "../../domain/entities/home.content";
import { HomeError } from "../errors/home.errors";

export class HomeContentModel {
  constructor(
    public readonly tmdbId: number,
    public readonly mediaType: MediaType,
    public readonly title: string,
    public readonly overview: string,
    public readonly posterPath: string | null,
    public readonly backdropPath: string | null,
    public readonly releaseDate: string | null,
    public readonly voteAverage: number,
  ) {}

  static fromJson(json: JsonObject, mediaType: MediaType): HomeContentModel {
    // 1. obtener campos principales
    const id = json.id;
    const title = json.title ?? json.name;

    // 2. validar datos obligatorios
    if (
      typeof id !== "number" ||
      !Number.isFinite(id) ||
      id <= 0 ||
      typeof title !== "string" ||
      title.trim() === ""
    ) {
      throw new HomeError(502, "Contenido invalido");
    }

    // 3. obtener fecha segun el tipo de contenido
    const date =
      mediaType === MediaType.MOVIE ? json.release_date : json.first_air_date;

    // 4. convertir respuesta a modelo
    return new HomeContentModel(
      id,
      mediaType,
      title,
      typeof json.overview === "string" ? json.overview : "",
      typeof json.poster_path === "string" ? json.poster_path : null,
      typeof json.backdrop_path === "string" ? json.backdrop_path : null,
      typeof date === "string" ? date : null,
      typeof json.vote_average === "number" &&
        Number.isFinite(json.vote_average)
        ? json.vote_average
        : 0,
    );
  }

  toDomain(): HomeContent {
    // 1. convertir modelo a entidad
    return new HomeContent({
      tmdbId: this.tmdbId,
      mediaType: this.mediaType,
      title: this.title,
      overview: this.overview,
      posterPath: this.posterPath,
      backdropPath: this.backdropPath,
      releaseDate: this.releaseDate,
      voteAverage: this.voteAverage,
    });
  }
}
