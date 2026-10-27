import type { ContentSearchResponseModel } from "../models/content.search.response.model";

export interface ContentLocalSource {
  searchContent(query: string): Promise<ContentSearchResponseModel>;
}
