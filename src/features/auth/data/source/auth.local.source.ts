import type { AuthSessionModel } from "../models/auth.session.model";
import type { AuthTokensModel } from "../models/auth.tokens.model";

// contrato de fuente local de auth
export interface AuthLocalSource {
  // ---------------- LOGIN ----------------

  login(email: string, password: string): Promise<AuthTokensModel>;

  // ---------------- REGISTER ----------------

  register(email: string, password: string): Promise<void>;
  // verifyEmail(email: string, code: string): Promise<void>;
  // resendCode(email: string, codeType: CodeType): Promise<void>;

  // ---------------- REFRESH ----------------
  refresh(refreshToken: string): Promise<AuthTokensModel>;
  // getSession(): Promise<AuthTokensModel>;
  // ---------------- LOGOUT ----------------
  // elimina los tokens del almacenamiento
  logout(): Promise<void>;

  // ---------------- SESSION ----------------
  getSession(): Promise<AuthSessionModel | null>;

  // ---------------- PASSWORD RECOVERY 3 pasos ----------------
  // 1. enviar codigo
  // requestRecovery(email: string): Promise<void>;

  // 2. validar codigo
  // verifyRecoveryCode(email: string, code: string): Promise<string>;

  // 3. cambiar password
  // changePassword(recoveryToken: string, newPassword: string): Promise<void>;

  // ---------------- GOOGLE LOGIN ----------------
  // googleLogin(): Promise<AuthTokensModel>;
}
