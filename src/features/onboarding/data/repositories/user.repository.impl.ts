import type { OnboardingData } from "../../domain/entities/onboarding.data";
import type { UserRepository } from "../../domain/repositories/user.repository";
import { OnboardingError } from "../errors/onboarding.errors";
import {
  InvalidOnboardingDataException,
  OnboardingNetworkException,
  OnboardingServerException,
  OnboardingUnauthorizedException,
  UsernameAlreadyTakenException,
} from "../errors/onboarding.exceptions";
import { OnboardingRequestModel } from "../models/onboarding.request.model";
import type { UserLocalSource } from "../source/user.local.source";

export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly source: UserLocalSource) {}

  async checkOnboardingStatus(): Promise<boolean> {
    try {
      // 1. consultar estado del onboarding
      return await this.source.checkOnboardingStatus();
    } catch (e) {
      if (e instanceof OnboardingError) {
        throw this.mapError(e);
      }

      console.error(e);
      throw e;
    }
  }

  async checkUsernameAvailable(username: string): Promise<boolean> {
    try {
      // 1. consultar disponibilidad
      return await this.source.checkUsernameAvailable(username);
    } catch (e) {
      if (e instanceof OnboardingError) {
        throw this.mapError(e);
      }

      console.error(e);
      throw e;
    }
  }

  async completeOnboarding(data: OnboardingData): Promise<void> {
    try {
      // 1. convertir entidad a modelo
      const request = OnboardingRequestModel.fromDomain(data);

      // 2. completar onboarding
      await this.source.completeOnboarding(request);
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

      case 409:
        throw new UsernameAlreadyTakenException();

      case 500:
        throw new OnboardingServerException();

      default:
        throw new OnboardingNetworkException();
    }
  }
}
