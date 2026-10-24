import type { ContentSearchResponse } from "../../domain/entities/content.search.response";
import type { ContentRepository } from "../../domain/repositories/content.repository";
import { OnboardingError } from "../errors/onboarding.errors";
import {
  InvalidOnboardingDataException,
  OnboardingNetworkException,
  OnboardingServerException,
  OnboardingUnauthorizedException,
} from "../errors/onboarding.exceptions";
import type { ContentLocalSource } from "../source/content.local.source";

export class ContentRepositoryImpl implements ContentRepository {
  constructor(private readonly source: ContentLocalSource) {}

  async searchContent(query: string): Promise<ContentSearchResponse> {
    try {
      // 1. buscar contenido
      const response = await this.source.searchContent(query);

      // 2. convertir modelo a dominio
      return response.toDomain();
    } catch (e) {
      if (e instanceof OnboardingError) {
        throw this.mapError(e);
      }

      console.error(e);
      throw e;
    }
  }

  // --- helper privado ---
  private mapError(error: OnboardingError): never {
    switch (error.status) {
      case 400:
        throw new InvalidOnboardingDataException();

      case 401:
        throw new OnboardingUnauthorizedException();

      case 500:
        throw new OnboardingServerException();

      default:
        throw new OnboardingNetworkException();
    }
  }
}
