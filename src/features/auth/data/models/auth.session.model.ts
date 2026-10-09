import { AuthSession } from "../../domain/entities/auth.session";
import type { JsonObject } from "../../../../core/mock/json.types";
import { AuthTokensModel } from "./auth.tokens.model";

export class AuthSessionModel {
  constructor(
    public readonly tokens: AuthTokensModel,
    public readonly role: string,
  ) {}

  static fromJson(json: JsonObject): AuthSessionModel {
    return new AuthSessionModel(
      AuthTokensModel.fromJson(json.tokens as JsonObject),
      json.role as string,
    );
  }

  toDomain(): AuthSession {
    return new AuthSession({
      tokens: this.tokens.toDomain(),
      role: this.role as AuthSession["role"],
    });
  }
}
