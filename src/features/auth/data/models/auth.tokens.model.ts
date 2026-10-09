import { AuthTokens } from "../../domain/entities/auth.tokens";

// estructura del json/api
export interface TokensJosn {
  token: string;
  refreshToken: string;
}

// props modelo
export interface TokensModelProps {
  accessToken: string;
  refreshToken: string;
}

export class AuthTokensModel {
  constructor(public readonly props: TokensModelProps) {}

  get accessToken(): string {
    return this.props.accessToken;
  }

  get refreshToken(): string {
    return this.props.refreshToken;
  }

  // metodo fromJson transforma json -> modelo
  static fromJson(json: Record<string, any>): AuthTokensModel {
    return new AuthTokensModel({
      accessToken: json["token"] as string,
      refreshToken: json["refreshToken"] as string,
    });
  }

  // metodo para transformar a domain
  toDomain(): AuthTokens {
    return new AuthTokens({
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
    });
  }
}
