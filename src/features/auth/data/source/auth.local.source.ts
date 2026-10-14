import type { AuthSessionModel } from "../models/auth.session.model";
import type { AuthTokensModel } from "../models/auth.tokens.model";

export interface AuthLocalSource {
  // ---------- acceso ----------
  login(email: string, password: string): Promise<AuthTokensModel>;
  register(email: string, password: string): Promise<void>;
  verifyEmail(email: string, code: string): Promise<void>;

  // ---------- recovery ----------
  requestPasswordReset(email: string): Promise<void>;
  verifyResetCode(email: string, code: string): Promise<string>;
  resetPassword(resetToken: string, newPassword: string): Promise<void>;

  // ---------- sesion ----------
  refresh(refreshToken: string): Promise<AuthTokensModel>;
  getSession(): Promise<AuthSessionModel | null>;
  logout(): Promise<void>;
}
