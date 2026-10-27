import type { UserService } from "../../../../core/mock/user/user.service";
import { OnboardingError } from "../errors/onboarding.errors";
import type { OnboardingRequestModel } from "../models/onboarding.request.model";
import type { UserLocalSource } from "./user.local.source";

export class UserLocalSourceImpl implements UserLocalSource {
  constructor(private readonly service: UserService) {}

  async checkOnboardingStatus(): Promise<boolean> {
    // 1. obtener perfil propio
    const profile = await this.service.getMyProfile();

    // 2. perfil inexistente significa onboarding pendiente
    return profile !== null;
  }

  async checkUsernameAvailable(username: string): Promise<boolean> {
    // 1. consultar disponibilidad
    const json = await this.service.checkUsernameAvailable(username);

    // 2. validar respuesta
    if (typeof json.available !== "boolean") {
      throw new OnboardingError(500);
    }

    return json.available;
  }

  async completeOnboarding(request: OnboardingRequestModel): Promise<void> {
    // 1. enviar datos del onboarding
    const json = await this.service.completeOnboarding(request.toJson());

    // 2. validar respuesta
    if (!json || json.success !== true) {
      throw new OnboardingError(400);
    }
  }
}
