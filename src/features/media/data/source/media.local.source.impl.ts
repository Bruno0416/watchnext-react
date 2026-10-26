import { MediaType } from "../../../../core/models/media.type";
import type { ContentService } from "../../../../core/mock/content/content.service";
import { MediaNotFoundError } from "../errors/media.errors";
import { MediaDetailModel } from "../models/media.detail.model";
import type { MediaLocalSource } from "./media.local.source";

export class MediaLocalSourceImpl implements MediaLocalSource {
  constructor(private readonly service: ContentService) {}

  async getMediaDetail(
    mediaType: MediaType,
    tmdbId: number,
  ): Promise<MediaDetailModel> {
    const json =
      mediaType === MediaType.MOVIE
        ? await this.service.getMovieDetails(tmdbId)
        : await this.service.getTvDetails(tmdbId);

    if (!json) throw new MediaNotFoundError();

    return MediaDetailModel.fromJson(json);
  }
}
