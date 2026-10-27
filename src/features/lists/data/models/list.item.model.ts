import type { JsonObject } from "../../../../core/mock/json.types";
import { MediaType } from "../../../../core/models/media.type";
import { ListItem } from "../../domain/entities/list.item";

// el List Service usa MOVIE / TV en mayuscula y el resto de la app usa movie / tv
// aca hago la traduccion para que el dominio no se entere
function toMediaType(value: unknown): MediaType {
  return String(value ?? "").toUpperCase() === "MOVIE"
    ? MediaType.MOVIE
    : MediaType.TV;
}

function toNumberOrNull(value: unknown): number | null {
  return typeof value === "number" && !Number.isNaN(value) ? value : null;
}

export class ListItemModel {
  constructor(
    public readonly tmdbId: number,
    public readonly mediaType: string,
    public readonly title: string,
    public readonly posterPath: string | null,
    public readonly voteAverage: number,
    public readonly releaseDate: string | null,
    public readonly duration: number | null,
    public readonly numberOfSeasons: number | null,
  ) {}

  static fromJson(json: JsonObject): ListItemModel {
    return new ListItemModel(
      Number(json.tmdbId),
      String(json.mediaType ?? "").toUpperCase(),
      String(json.title ?? ""),
      typeof json.posterPath === "string" && json.posterPath ? json.posterPath : null,
      typeof json.voteAverage === "number" ? json.voteAverage : 0,
      typeof json.releaseDate === "string" && json.releaseDate ? json.releaseDate : null,
      toNumberOrNull(json.duration),
      toNumberOrNull(json.numberOfSeasons),
    );
  }

  // el mock de search devuelve otro formato (year en vez de releaseDate), lo adapto aca
  static fromSearchJson(json: JsonObject): ListItemModel {
    const year = toNumberOrNull(json.year);

    return new ListItemModel(
      Number(json.tmdbId),
      String(json.mediaType ?? "").toUpperCase(),
      String(json.title ?? ""),
      typeof json.posterPath === "string" && json.posterPath ? json.posterPath : null,
      typeof json.voteAverage === "number" ? json.voteAverage : 0,
      year ? `${year}-01-01` : null,
      null,
      null,
    );
  }

  static fromDomain(item: ListItem): ListItemModel {
    return new ListItemModel(
      item.tmdbId,
      item.mediaType.toUpperCase(),
      item.title,
      item.posterPath,
      item.voteAverage,
      item.releaseDate,
      item.duration,
      item.numberOfSeasons,
    );
  }

  // lo que le mando al List Service cuando agrego un item
  toJson(): JsonObject {
    return {
      tmdbId: this.tmdbId,
      mediaType: this.mediaType,
      title: this.title,
      posterPath: this.posterPath,
      voteAverage: this.voteAverage,
      releaseDate: this.releaseDate,
      duration: this.duration,
      numberOfSeasons: this.numberOfSeasons,
    };
  }

  toDomain(): ListItem {
    return new ListItem({
      tmdbId: this.tmdbId,
      mediaType: toMediaType(this.mediaType),
      title: this.title,
      posterPath: this.posterPath,
      voteAverage: this.voteAverage,
      releaseDate: this.releaseDate,
      duration: this.duration,
      numberOfSeasons: this.numberOfSeasons,
    });
  }
}
