import type { ContentSearchResponse } from "../entities/content.search.response";

export interface ContentRepository {
  searchContent(query: string): Promise<ContentSearchResponse>;
}
