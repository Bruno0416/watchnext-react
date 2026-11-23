import { apiJson, ApiHttpError } from "../../../../core/http/api.client";
import type { JsonObject } from "../../../../core/mock/json.types";
import { OnboardingError } from "../errors/onboarding.errors";
import { ContentSearchResponseModel } from "../models/content.search.response.model";
import type { ContentLocalSource } from "./content.local.source";

export class ContentRemoteSourceImpl implements ContentLocalSource {
  async searchContent(query: string): Promise<ContentSearchResponseModel> {
    const params = new URLSearchParams({ q: query, types: "MOVIE,TV" });
    try {
      // 1. buscar contenido en el servicio remoto
      const json = await apiJson<JsonObject>(`/api/v1/search?${params}`, {
        auth: "optional",
      });
      return ContentSearchResponseModel.fromJson(json);
    } catch (error) {
      // 2. traducir errores de comunicacion al dominio de onboarding
      if (error instanceof ApiHttpError) throw new OnboardingError(error.status);
      if (error instanceof TypeError) throw new OnboardingError(0);
      throw error;
    }
  }
}
