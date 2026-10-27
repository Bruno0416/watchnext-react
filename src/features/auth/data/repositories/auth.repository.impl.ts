import type { AuthSession } from "../../domain/entities/auth.session";
import type { AuthTokens } from "../../domain/entities/auth.tokens";
import type { AuthRepository } from "../../domain/repositories/auth.repository";
import { AuthError } from "../errors/auth.errors";
import {
  BadRequestException,
  EmailAlreadyInUseException,
  InvalidCredentialsException,
  NetworkException,
  ServerException,
} from "../errors/auth.exceptions";
import type { AuthLocalSource } from "../source/auth.local.source";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private readonly source: AuthLocalSource) {}

  async getSession(): Promise<AuthSession | null> {
    // 1. obtener sesion local
    const session = await this.source.getSession();

    // 2. manejar sesion inexistente
    if (!session) {
      return null;
    }

    // 3. convertir modelo a entidad
    return session.toDomain();
  }

  async login(email: string, password: string): Promise<AuthTokens> {
    try {
      // 1. llamar al source para obtener los tokens
      const tokens = await this.source.login(email, password);
      // 2. devolver tokens convertidos a domain
      return tokens.toDomain();
    } catch (e) {
      // 3. atrapar error si es de tipo auth
      if (e instanceof AuthError) {
        throw this.mapError(e);
      }
      // 4. si no es de tipo auth lo mostramos por consola
      console.error(e);
      throw e;
    }
  }

  async register(email: string, password: string): Promise<void> {
    try {
      await this.source.register(email, password);
    } catch (e) {
      if (e instanceof AuthError) {
        throw this.mapError(e);
      }

      console.error(e);
      throw e;
    }
  }

  async verifyEmail(email: string, code: string): Promise<void> {
    try {
      // 1. validar codigo de verificacion
      await this.source.verifyEmail(email, code);
    } catch (e) {
      // 2. mapear error tecnico
      if (e instanceof AuthError) {
        throw this.mapError(e);
      }

      console.error(e);
      throw e;
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    try {
      // 1. solicitar recuperacion
      await this.source.requestPasswordReset(email);
    } catch (e) {
      if (e instanceof AuthError) {
        throw this.mapError(e);
      }

      console.error(e);
      throw e;
    }
  }

  async verifyResetCode(email: string, code: string): Promise<string> {
    try {
      // 1. verificar codigo
      return await this.source.verifyResetCode(email, code);
    } catch (e) {
      if (e instanceof AuthError) {
        throw this.mapError(e);
      }

      console.error(e);
      throw e;
    }
  }

  async resetPassword(resetToken: string, newPassword: string): Promise<void> {
    try {
      // 1. cambiar contrasena
      await this.source.resetPassword(resetToken, newPassword);
    } catch (e) {
      if (e instanceof AuthError) {
        throw this.mapError(e);
      }

      console.error(e);
      throw e;
    }
  }

  async refresh(refreshTokens: string): Promise<AuthTokens> {
    try {
      // 1. llamar al source para obtener los tokens
      const tokens = await this.source.refresh(refreshTokens);
      // 2. devolver tokens convertidos a domain
      return tokens.toDomain();
    } catch (e) {
      if (e instanceof AuthError) {
        throw this.mapError(e);
      }

      console.error(e);
      throw e;
    }
  }

  async logout(): Promise<void> {
    try {
      this.source.logout();
    } catch (e) {
      if (e instanceof AuthError) {
        throw this.mapError(e);
      }

      console.error(e);
      throw e;
    }
  }

  // ---- helper ----
  mapError(e: AuthError) {
    let statusCode = e.status;

    switch (statusCode) {
      case 400:
        throw new BadRequestException();
      case 401:
        throw new InvalidCredentialsException();
      case 409:
        throw new EmailAlreadyInUseException();
      case 500:
        throw new ServerException();
      default:
        throw new NetworkException();
    }
  }
}
