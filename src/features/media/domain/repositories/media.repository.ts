import type { MediaType } from "../../../../core/models/media.type";
import type { MediaDetail } from "../entities/media.detail";

export interface MediaRepository {
  getMediaDetail(mediaType: MediaType, tmdbId: number): Promise<MediaDetail>;
}
