import type { MediaType } from "../../../../core/models/media.type";
import type { MediaRepository } from "../repositories/media.repository";

export class GetMediaDetail {
  constructor(private readonly repository: MediaRepository) {}

  call(mediaType: MediaType, tmdbId: number) {
    return this.repository.getMediaDetail(mediaType, tmdbId);
  }
}
