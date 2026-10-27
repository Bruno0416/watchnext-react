import { MediaType } from "../../../../core/models/media.type";

export type ProfileFavoriteProps = {
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  voteAverage: number;
  releaseDate: string | null;
};

// un favorito del perfil, lo justo para mostrar la tarjeta
export class ProfileFavorite {
  constructor(public readonly props: ProfileFavoriteProps) {}

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

  get year(): number | null {
    if (!this.releaseDate || this.releaseDate.length < 4) return null;
    const y = Number(this.releaseDate.slice(0, 4));
    return Number.isNaN(y) ? null : y;
  }

  get isMovie(): boolean {
    return this.mediaType === MediaType.MOVIE;
  }

  get key(): string {
    return `${this.mediaType}:${this.tmdbId}`;
  }
}
