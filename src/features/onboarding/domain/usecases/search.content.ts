import type { ContentSearchResponse } from "../entities/content.search.response";
import type { ContentRepository } from "../repositories/content.repository";

export class SearchContent {
  constructor(private readonly repo: ContentRepository) {}

  async call(query: string): Promise<ContentSearchResponse> {
    return this.repo.searchContent(query);
  }
}
