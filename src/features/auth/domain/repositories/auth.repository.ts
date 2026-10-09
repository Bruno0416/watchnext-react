import type { AuthSession } from "../entities/auth.session";
import type { AuthTokens } from "../entities/auth.tokens";
// import type CodeType from "../entities/code.type";

export interface AuthRepository {
  // ---------------- LOGIN ----------------
  // valida credenciales y devuelve los dos tokens.
  login(email: string, password: string): Promise<AuthTokens>;

  // ---------------- REGISTER ----------------
  // crea cuenta y envia un email de verificación(para simulacion no tendremos verificacion). No devuelve tokens.
  register(email: string, password: string): Promise<void>;
  // verifyEmail(email: string, code: string): Promise<void>;
  // resendCode(email: string, codeType: CodeType): Promise<void>;

  // ---------------- REFRESH ----------------
  // cambia un refresh token valido por un nuevo set de tokens
  refresh(refreshTokens: string): Promise<AuthTokens>;
  getSession(): Promise<AuthSession | null>;
  // ---------------- LOGOUT ----------------
  // elimina los tokens del almacenamiento
  logout(): Promise<void>;

  // ---------------- PASSWORD RECOVERY 3 pasos ----------------
  // 1. enviar codigo
  // requestRecovery(email: string): Promise<void>;

  // 2. validar codigo
  // verifyRecoveryCode(email: string, code: string): Promise<string>;

  // 3. cambiar password
  // changePassword(recoveryToken: string, newPassword: string): Promise<void>;

  // ---------------- GOOGLE LOGIN (implementar cuando se usen los microservicios) ----------------
  // googleLogin(): Promise<AuthTokens>;
}
