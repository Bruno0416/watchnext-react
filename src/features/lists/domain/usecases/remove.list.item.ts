import type { MediaType } from "../../../../core/models/media.type";
import type { MediaList } from "../entities/media.list";
import type { ListRepository } from "../repositories/list.repository";

export class RemoveListItem {
  constructor(private readonly repo: ListRepository) {}

  async call(
    listId: string,
    tmdbId: number,
    mediaType: MediaType,
  ): Promise<MediaList> {
    return this.repo.removeItem(listId, tmdbId, mediaType);
  }
}
