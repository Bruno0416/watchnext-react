// clase para obtener los tokens de autenticacion en las respuestas de la api

export interface TokensProps {
  accessToken: string;
  refreshToken: string;
}

export class AuthTokens {
  constructor(private readonly props: TokensProps) {}

  get accessToken(): string {
    return this.props.accessToken;
  }

  get refreshToken(): string {
    return this.props.refreshToken;
  }
}
