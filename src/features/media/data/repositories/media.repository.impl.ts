import type { MediaType } from "../../../../core/models/media.type";
import type { MediaDetail } from "../../domain/entities/media.detail";
import type { MediaRepository } from "../../domain/repositories/media.repository";
import { MediaLoadError, MediaNotFoundError } from "../errors/media.errors";
import type { MediaLocalSource } from "../source/media.local.source";

export class MediaRepositoryImpl implements MediaRepository {
  constructor(private readonly localSource: MediaLocalSource) {}

  async getMediaDetail(
    mediaType: MediaType,
    tmdbId: number,
  ): Promise<MediaDetail> {
    try {
      const model = await this.localSource.getMediaDetail(mediaType, tmdbId);
      return model.toDomain();
    } catch (error) {
      if (error instanceof MediaNotFoundError) throw error;
      throw new MediaLoadError();
    }
  }
}
