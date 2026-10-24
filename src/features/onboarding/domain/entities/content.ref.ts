import type { MediaType } from "../../../../core/models/media.type";

export type ContentRefProps = {
  tmdbId: number;
  mediaType: MediaType;
  position: number;
};

export class ContentRef {
  constructor(public readonly props: ContentRefProps) {}

  get tmdbId(): number {
    return this.props.tmdbId;
  }

  get mediaType(): MediaType {
    return this.props.mediaType;
  }

  get position(): number {
    return this.props.position;
  }
}
