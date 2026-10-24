import type { MediaType } from "../../../../core/models/media.type";

export type ContentSearchResultProps = {
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string;
  mediaType: MediaType;
  year: number | null;
  popularity: number;
  voteAverage: number;
};

export class ContentSearchResult {
  constructor(public readonly props: ContentSearchResultProps) {}

  get tmdbId(): number {
    return this.props.tmdbId;
  }

  get title(): string {
    return this.props.title;
  }

  get overview(): string {
    return this.props.overview;
  }

  get posterPath(): string {
    return this.props.posterPath;
  }

  get mediaType(): MediaType {
    return this.props.mediaType;
  }

  get year(): number | null {
    return this.props.year;
  }

  get popularity(): number {
    return this.props.popularity;
  }

  get voteAverage(): number {
    return this.props.voteAverage;
  }
}
