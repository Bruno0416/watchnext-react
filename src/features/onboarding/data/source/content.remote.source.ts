import type { ContentSearchResponseModel } from "../models/content.search.response.model";

export interface ContentRemoteSource {
  searchContent(query: string): Promise<ContentSearchResponseModel>;
}
