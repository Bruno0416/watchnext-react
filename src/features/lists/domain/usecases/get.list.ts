import type { MediaList } from "../entities/media.list";
import type { ListRepository } from "../repositories/list.repository";

export class GetList {
  constructor(private readonly repo: ListRepository) {}

  async call(id: string): Promise<MediaList> {
    return this.repo.getById(id);
  }
}
