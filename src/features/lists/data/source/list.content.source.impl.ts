import type { JsonArray, JsonObject } from "../../../../core/mock/json.types";
import type { SearchService } from "../../../../core/mock/search/search.service";
import { ListItemModel } from "../models/list.item.model";
import type { ListContentSource } from "./list.content.source";

export class ListContentSourceImpl implements ListContentSource {
  constructor(private readonly service: SearchService) {}

  async search(query: string): Promise<ListItemModel[]> {
    // el search devuelve { content: { results: [...] }, users: {...} }
    // a mi solo me interesa content.results
    const json = await this.service.search(query);
    const content = (json.content ?? {}) as JsonObject;
    const results = Array.isArray(content.results)
      ? (content.results as JsonArray)
      : [];

    return results.map((item) => ListItemModel.fromSearchJson(item));
  }
}
