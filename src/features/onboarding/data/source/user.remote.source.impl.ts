import { apiJson, apiVoid, ApiHttpError } from "../../../../core/http/api.client";
import { OnboardingError } from "../errors/onboarding.errors";
import type { OnboardingRequestModel } from "../models/onboarding.request.model";
import type { UserRemoteSource } from "./user.remote.source";

export class UserRemoteSourceImpl implements UserRemoteSource {
  private async request<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof ApiHttpError) throw new OnboardingError(error.status);
      if (error instanceof TypeError) throw new OnboardingError(0);
      throw error;
    }
  }

  async checkOnboardingStatus(): Promise<boolean> {
    try {
      // 1. consultar el perfil del usuario autenticado
      const profile = await this.request(() => apiJson<{
        onboardingCompleted: boolean;
      }>("/api/v1/users/me", { auth: "required" }));
      return profile.onboardingCompleted === true;
    } catch (error) {
      // 2. interpretar un 404 como un perfil aun no creado
      if (error instanceof OnboardingError && error.status === 404) return false;
      throw error;
    }
  }

  async checkUsernameAvailable(username: string): Promise<boolean> {
    const params = new URLSearchParams({ username });
    return this.request(async () => {
      const json = await apiJson<{ available: boolean }>(
        `/api/v1/users/username-available?${params}`,
        { auth: "required" },
      );
      if (typeof json.available !== "boolean") throw new OnboardingError(502);
      return json.available;
    });
  }

  completeOnboarding(request: OnboardingRequestModel): Promise<void> {
    // 1. preparar el perfil como formulario multipart
    const form = new FormData();
    form.append("data", new Blob([JSON.stringify(request.toJson())], {
      type: "application/json",
    }), "onboarding.json");
    // 2. enviar el formulario sin fijar content-type para conservar el boundary
    return this.request(() => apiVoid("/api/v1/users/me/onboarding", {
      method: "PUT",
      auth: "required",
      body: form,
    }));
  }
}
