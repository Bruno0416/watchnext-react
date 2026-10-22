import type { ListItem } from "../entities/list.item";
import type { ListContentRepository } from "../repositories/list.content.repository";

export class SearchListContent {
  constructor(private readonly repo: ListContentRepository) {}

  async call(query: string): Promise<ListItem[]> {
    // con menos de 2 letras no vale la pena buscar
    if (query.trim().length < 2) return [];

    return this.repo.search(query.trim());
  }
}
