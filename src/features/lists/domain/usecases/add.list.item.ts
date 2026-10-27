import type { ListItem } from "../entities/list.item";
import type { MediaList } from "../entities/media.list";
import type { ListRepository } from "../repositories/list.repository";

export class AddListItem {
  constructor(private readonly repo: ListRepository) {}

  async call(listId: string, item: ListItem): Promise<MediaList> {
    return this.repo.addItem(listId, item);
  }
}
