import type { ListItem } from "../../domain/entities/list.item";
import type { ListContentRepository } from "../../domain/repositories/list.content.repository";
import { ListUnavailableException } from "../errors/list.exceptions";
import type { ListContentSource } from "../source/list.content.source";

export class ListContentRepositoryImpl implements ListContentRepository {
  constructor(private readonly source: ListContentSource) {}

  async search(query: string): Promise<ListItem[]> {
    try {
      const models = await this.source.search(query);
      return models.map((model) => model.toDomain());
    } catch (e) {
      console.error(e);
      throw new ListUnavailableException();
    }
  }
}
