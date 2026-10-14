import type { AuthSession } from "../entities/auth.session";
import type { AuthTokens } from "../entities/auth.tokens";

export interface AuthRepository {
  // ---------- acceso ----------
  login(email: string, password: string): Promise<AuthTokens>;
  register(email: string, password: string): Promise<void>;
  verifyEmail(email: string, code: string): Promise<void>;

  // ---------- recovery ----------
  requestPasswordReset(email: string): Promise<void>;
  verifyResetCode(email: string, code: string): Promise<string>;
  resetPassword(resetToken: string, newPassword: string): Promise<void>;

  // ---------- sesion ----------
  refresh(refreshToken: string): Promise<AuthTokens>;
  getSession(): Promise<AuthSession | null>;
  logout(): Promise<void>;
}
