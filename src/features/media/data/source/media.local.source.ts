import type { MediaType } from "../../../../core/models/media.type";
import type { MediaDetailModel } from "../models/media.detail.model";

export interface MediaLocalSource {
  getMediaDetail(
    mediaType: MediaType,
    tmdbId: number,
  ): Promise<MediaDetailModel>;
}
