import { AuthStorage } from "./auth.storage";

export type TokenResponse = {
  token: string;
  refreshToken: string;
};

type AccessClaims = {
  id?: unknown;
  role?: unknown;
  exp?: unknown;
};

const storage = new AuthStorage();

// ---------- lectura local del jwt ----------
export function readAccessClaims(token: string): AccessClaims | null {
  try {
    // 1. extraer el contenido del token
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json: unknown = JSON.parse(atob(normalized));
    // 2. comprobar que el contenido tenga la estructura esperada
    if (!json || typeof json !== "object" || Array.isArray(json)) return null;
    return json as AccessClaims;
  } catch {
    return null;
  }
}

// ---------- persistencia de la sesion en el navegador ----------
export function saveSessionTokens(tokens: TokenResponse): void {
  // 1. validar usuario y rol antes de guardar la sesion
  const claims = readAccessClaims(tokens.token);
  if (!claims || typeof claims.id !== "string" ||
      (claims.role !== "USER" && claims.role !== "ADMIN")) {
    throw new Error("El access token no contiene los claims de sesion esperados");
  }

  // 2. guardar los tokens y los datos basicos de acceso
  storage.setTokens(tokens);
  storage.setRole(claims.role);
  storage.setUserId(claims.id);
}

export function clearSession(): void {
  storage.clear();
}

export function getStoredTokens(): TokenResponse | null {
  const tokens = storage.getTokens();
  if (!tokens) return null;
  return { token: tokens.token as string, refreshToken: tokens.refreshToken as string };
}

export function getStoredRole(): string | null {
  return storage.getRole();
}

export function getStoredUserId(): string | null {
  return storage.getUserId();
}
