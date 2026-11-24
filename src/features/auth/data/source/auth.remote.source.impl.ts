import {
  apiJson,
  apiVoid,
  ApiHttpError,
} from "../../../../core/http/api.client";
import {
  clearSession,
  getStoredTokens,
  readAccessClaims,
  saveSessionTokens,
  type TokenResponse,
} from "../../../../core/http/auth.session";
import { AuthError } from "../errors/auth.errors";
import { AuthSessionModel } from "../models/auth.session.model";
import { AuthTokensModel } from "../models/auth.tokens.model";
import type { AuthRemoteSource } from "./auth.remote.source";

export class AuthRemoteSourceImpl implements AuthRemoteSource {
  private async request<T>(operation: () => Promise<T>): Promise<T> {
    // 1. ejecutar la operacion del origen remoto
    try {
      return await operation();
    } catch (error) {
      // 2. convertir los errores de comunicacion al dominio de autenticacion
      if (error instanceof ApiHttpError) throw new AuthError(error.status);
      if (error instanceof TypeError) throw new AuthError(0);
      throw error;
    }
  }

  login(email: string, password: string): Promise<AuthTokensModel> {
    return this.request(async () => {
      // 1. solicitar los tokens al servicio de autenticacion
      const tokens = await apiJson<TokenResponse>("/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      // 2. persistir los tokens de la sesion
      saveSessionTokens(tokens);
      return AuthTokensModel.fromJson(tokens);
    });
  }

  register(email: string, password: string): Promise<void> {
    return this.request(() =>
      apiVoid("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    );
  }

  verifyEmail(email: string, code: string): Promise<void> {
    return this.request(() =>
      apiVoid("/api/v1/auth/confirm-email", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      }),
    );
  }

  requestPasswordReset(email: string): Promise<void> {
    return this.request(() =>
      apiVoid("/api/v1/auth/password/request", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    );
  }

  verifyResetCode(email: string, code: string): Promise<string> {
    return this.request(async () => {
      const response = await apiJson<{ resetToken: string }>(
        "/api/v1/auth/password/verify",
        { method: "POST", body: JSON.stringify({ email, code }) },
      );
      if (typeof response.resetToken !== "string") throw new AuthError(502);
      return response.resetToken;
    });
  }

  resetPassword(resetToken: string, newPassword: string): Promise<void> {
    return this.request(() =>
      apiVoid("/api/v1/auth/password/reset", {
        method: "POST",
        body: JSON.stringify({ resetToken, newPassword }),
      }),
    );
  }

  refresh(refreshToken: string): Promise<AuthTokensModel> {
    return this.request(async () => {
      // 1. solicitar la renovacion de los tokens
      const tokens = await apiJson<TokenResponse>("/api/v1/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
      // 2. persistir los tokens de la sesion
      saveSessionTokens(tokens);
      return AuthTokensModel.fromJson(tokens);
    });
  }

  async getSession(): Promise<AuthSessionModel | null> {
    // 1. recuperar la sesion almacenada
    const tokens = getStoredTokens();
    if (!tokens) return null;
    // 2. validar los datos de autenticacion antes de restaurar la sesion
    const claims = readAccessClaims(tokens.token);
    if (!claims || (claims.role !== "USER" && claims.role !== "ADMIN")) {
      clearSession();
      return null;
    }
    return AuthSessionModel.fromJson({ tokens, role: claims.role });
  }

  async logout(): Promise<void> {
    clearSession();
  }
}
