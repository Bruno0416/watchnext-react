import { AuthTokensModel } from "../models/auth.tokens.model";

import type { AuthService } from "../../../../core/mock/auth/auth.service";
import { AuthError } from "../errors/auth.errors";
import type { AuthStorage } from "../../../../core/mock/auth/auth.storage";
import { AuthSessionModel } from "../models/auth.session.model";
import type { AuthLocalSource } from "./auth.local.source";

export class AuthLocalSourceImpl implements AuthLocalSource {
  constructor(
    private readonly service: AuthService,
    private readonly storage: AuthStorage,
  ) {}

  async verifyEmail(email: string, code: string): Promise<void> {
    // 1. enviar peticion
    const json = await this.service.confirmEmail({ email, code });

    // 2. validar codigo recibido
    if (!json) {
      throw new AuthError(400);
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    // 1. solicitar recuperacion
    const json = await this.service.requestPasswordReset({ email });

    if (!json) {
      throw new AuthError(400);
    }
  }

  async verifyResetCode(email: string, code: string): Promise<string> {
    // 1. verificar codigo
    const json = await this.service.verifyResetCode({ email, code });

    if (!json || typeof json.resetToken !== "string") {
      throw new AuthError(400);
    }

    // 2. devolver token temporal
    return json.resetToken;
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    // 1. cambiar contrasena
    const json = await this.service.resetPassword({ resetToken, newPassword });

    if (!json) {
      throw new AuthError(400);
    }
  }

  async getSession(): Promise<AuthSessionModel | null> {
    // 1. obtener datos almacenados
    const tokens = this.storage.getTokens();
    const role = this.storage.getRole();

    // 2. validar existencia de sesion
    if (!tokens || !role) {
      return null;
    }

    // 3. convertir datos a modelo
    return AuthSessionModel.fromJson({
      tokens,
      role,
    });
  }

  async login(email: string, password: string): Promise<AuthTokensModel> {
    // 1. enviar peticion
    /*(auth service es el servicio temporal
      hasta que implementemos los microservicios)*/
    const json = await this.service.login({ email, password });

    // 2. retornar null si no existe
    if (!json) {
      throw new AuthError(401);
    }

    // 3. convertir respuesta a modelo
    return AuthTokensModel.fromJson(json);
  }

  async register(email: string, password: string): Promise<void> {
    // 1. enviar peticion
    const json = await this.service.register({ email, password });

    // 2. retornar null si ya esta registrado
    if (!json) {
      throw new AuthError(409);
    }
  }

  async refresh(refreshToken: string): Promise<AuthTokensModel> {
    // 1. enviar peticion
    const json = await this.service.refresh({ refreshToken });

    // 2. retornar null si el token es invalido
    if (!json) {
      throw new AuthError(401);
    }

    // 3. convertir respuesta a modelo
    return AuthTokensModel.fromJson(json);
  }

  async logout(): Promise<void> {
    // 1. enviar peticion
    await this.service.logout();
  }
}
