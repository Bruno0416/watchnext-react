import type { TokensProps } from "./auth.tokens";

export enum AuthRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type SessionProps = {
  tokens: TokensProps;
  role: AuthRole;
};

export class AuthSession {
  constructor(public readonly props: SessionProps) {}

  get tokens(): TokensProps {
    return this.props.tokens;
  }

  get role(): AuthRole {
    return this.props.role;
  }
}
