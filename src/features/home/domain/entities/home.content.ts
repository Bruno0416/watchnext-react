import type { MediaType } from "../../../../core/models/media.type";

export type HomeContentProps = {
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  voteAverage: number;
};

export class HomeContent {
  constructor(public readonly props: HomeContentProps) {}

  get tmdbId(): number {
    return this.props.tmdbId;
  }

  get mediaType(): MediaType {
    return this.props.mediaType;
  }

  get title(): string {
    return this.props.title;
  }

  get overview(): string {
    return this.props.overview;
  }

  get posterPath(): string | null {
    return this.props.posterPath;
  }

  get backdropPath(): string | null {
    return this.props.backdropPath;
  }

  get releaseDate(): string | null {
    return this.props.releaseDate;
  }

  get voteAverage(): number {
    return this.props.voteAverage;
  }
}
