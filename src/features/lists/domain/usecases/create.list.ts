import type { MediaList } from "../entities/media.list";
import type {
  CreateListData,
  ListRepository,
} from "../repositories/list.repository";

export class CreateList {
  constructor(private readonly repo: ListRepository) {}

  async call(data: CreateListData): Promise<MediaList> {
    // limpio espacios aca para que ninguna vista se olvide de hacerlo
    return this.repo.create({
      name: data.name.trim(),
      description: data.description.trim(),
      visibility: data.visibility,
    });
  }
}
