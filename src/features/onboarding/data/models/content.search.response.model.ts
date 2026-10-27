import type { JsonArray, JsonObject } from "../../../../core/mock/json.types";
import { ContentSearchResponse } from "../../domain/entities/content.search.response";
import { ContentSearchResultModel } from "./content.search.result.model";

export class ContentSearchResponseModel {
  constructor(
    public readonly originalQuery: string,
    public readonly executedQuery: string,
    public readonly corrected: boolean,
    public readonly totalResults: number,
    public readonly results: ContentSearchResultModel[],
  ) {}

  static fromJson(json: JsonObject): ContentSearchResponseModel {
    // 1. obtener contenido de la respuesta
    const content = (json.content ?? {}) as JsonObject;
    const results = (content.results ?? []) as JsonArray;

    // 2. convertir resultados
    return new ContentSearchResponseModel(
      String(content.originalQuery ?? ""),
      String(content.executedQuery ?? ""),
      content.corrected === true,
      Number(content.totalResults ?? 0),
      results.map((item) => ContentSearchResultModel.fromJson(item)),
    );
  }

  toDomain(): ContentSearchResponse {
    return new ContentSearchResponse({
      originalQuery: this.originalQuery,
      executedQuery: this.executedQuery,
      corrected: this.corrected,
      totalResults: this.totalResults,
      results: this.results.map((item) => item.toDomain()),
    });
  }
}
