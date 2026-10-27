import type { SearchService } from "../../../../core/mock/search/search.service";
import { ContentSearchResponseModel } from "../models/content.search.response.model";
import type { ContentLocalSource } from "./content.local.source";

export class ContentLocalSourceImpl implements ContentLocalSource {
  constructor(private readonly service: SearchService) {}

  async searchContent(query: string): Promise<ContentSearchResponseModel> {
    // 1. buscar contenido
    const json = await this.service.search(query);

    // 2. convertir respuesta a modelo
    return ContentSearchResponseModel.fromJson(json);
  }
}
