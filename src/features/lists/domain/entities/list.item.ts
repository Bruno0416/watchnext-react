import { MediaType } from "../../../../core/models/media.type";

export type ListItemProps = {
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  voteAverage: number;
  releaseDate: string | null;
  duration: number | null;
  numberOfSeasons: number | null;
};

// un contenido guardado dentro de una lista
// lo que identifica al item es tmdbId + mediaType, el resto es para mostrarlo
export class ListItem {
  constructor(public readonly props: ListItemProps) {}

  get tmdbId(): number {
    return this.props.tmdbId;
  }

  get mediaType(): MediaType {
    return this.props.mediaType;
  }

  get title(): string {
    return this.props.title;
  }

  get posterPath(): string | null {
    return this.props.posterPath;
  }

  get voteAverage(): number {
    return this.props.voteAverage;
  }

  get releaseDate(): string | null {
    return this.props.releaseDate;
  }

  get duration(): number | null {
    return this.props.duration;
  }

  get numberOfSeasons(): number | null {
    return this.props.numberOfSeasons;
  }

  // saco el año de la fecha, me sirve para la tarjeta
  get year(): number | null {
    if (!this.releaseDate || this.releaseDate.length < 4) return null;

    const year = Number(this.releaseDate.slice(0, 4));
    return Number.isNaN(year) ? null : year;
  }

  get isMovie(): boolean {
    return this.mediaType === MediaType.MOVIE;
  }

  // clave unica para comparar y para los key de react
  get key(): string {
    return `${this.mediaType}:${this.tmdbId}`;
  }
}
