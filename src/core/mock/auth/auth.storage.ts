import type { JsonObject } from "../json.types";

export class AuthStorage {
  private tokenKey = "token";
  private refreshTokenKey = "refresh-token";
  private roleKey = "role";
  private userIdKey = "user-id";

  getTokens(): JsonObject | null {
    const token = localStorage.getItem(this.tokenKey);
    const refreshToken = localStorage.getItem(this.refreshTokenKey);

    if (!token || !refreshToken) {
      return null;
    }

    return {
      token,
      refreshToken,
    };
  }

  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  getUserId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  setTokens(tokens: JsonObject): void {
    localStorage.setItem(this.tokenKey, tokens.token as string);

    localStorage.setItem(this.refreshTokenKey, tokens.refreshToken as string);
  }

  setRole(role: string): void {
    localStorage.setItem(this.roleKey, role);
  }

  setUserId(userId: string): void {
    localStorage.setItem(this.userIdKey, userId);
  }

  clear(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.userIdKey);
  }
}
