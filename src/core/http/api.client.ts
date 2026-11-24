import {
  clearSession,
  getStoredTokens,
  readAccessClaims,
  saveSessionTokens,
  type TokenResponse,
} from "./auth.session";

export class ApiHttpError extends Error {
  constructor(public readonly status: number) {
    super(`HTTP ${status}`);
    this.name = "ApiHttpError";
  }
}

type AuthMode = "none" | "optional" | "required";
export type ApiRequestOptions = RequestInit & { auth?: AuthMode };

// gateway configurable por .env (VITE_GATEWAY_URL); por defecto el puerto 8080
const baseUrl = import.meta.env.VITE_GATEWAY_URL ?? "http://localhost:8080";

// --- compartir la renovacion entre peticiones simultaneas ---
let pendingRefresh: Promise<string> | null = null;

// --- detectar vencimiento proximo del token ---
function accessTokenExpiresSoon(token: string): boolean {
  const expires = readAccessClaims(token)?.exp;
  return typeof expires === "number" && expires * 1000 <= Date.now() + 15_000;
}

// ---------- renovacion de sesion ----------
async function renewAccessToken(staleToken: string): Promise<string | null> {
  // 1. recuperar la sesion actual
  const stored = getStoredTokens();
  if (!stored) return null;

  // 2. reutilizar un token actualizado por otra peticion
  if (stored.token !== staleToken) return stored.token;

  // 3. iniciar la renovacion solo si no existe otra en curso
  if (!pendingRefresh) {
    const previousRefreshToken = stored.refreshToken;
    pendingRefresh = (async () => {
      try {
        // 4. solicitar nuevos tokens sin provocar una renovacion recursiva
        const response = await fetch(`${baseUrl}/api/v1/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: previousRefreshToken }),
        });

        // 5. limpiar la sesion si el servidor rechaza el token de renovacion
        if (!response.ok) {
          if (
            [400, 401, 403].includes(response.status) &&
            getStoredTokens()?.refreshToken === previousRefreshToken
          ) {
            clearSession();
          }
          throw new ApiHttpError(response.status);
        }

        // 6. validar el formato de los tokens recibidos
        let tokens: TokenResponse;
        try {
          tokens = (await response.json()) as TokenResponse;
          if (
            typeof tokens.token !== "string" ||
            typeof tokens.refreshToken !== "string" ||
            !readAccessClaims(tokens.token)
          ) {
            throw new Error("Respuesta de refresh invalida");
          }
        } catch (error) {
          if (getStoredTokens()?.refreshToken === previousRefreshToken) {
            clearSession();
          }
          throw error;
        }

        // 7. evitar sobrescribir una sesion modificada durante la renovacion
        if (getStoredTokens()?.refreshToken !== previousRefreshToken) {
          return getStoredTokens()?.token ?? "";
        }
        // 8. guardar los nuevos tokens de la misma sesion
        saveSessionTokens(tokens);
        return tokens.token;
      } finally {
        // 9. liberar la renovacion compartida al finalizar
        pendingRefresh = null;
      }
    })();
  }
  return pendingRefresh;
}

// ---------- cliente http ----------
export async function apiFetch(
  path: string,
  options: ApiRequestOptions = {},
): Promise<Response> {
  // 1. determinar el token segun el modo de autenticacion
  const { auth = "none", headers: customHeaders, ...init } = options;
  const originalToken =
    auth === "none" ? null : (getStoredTokens()?.token ?? null);

  if (auth === "required" && !originalToken) throw new ApiHttpError(401);

  // 2. renovar el token antes de que venza
  let token = originalToken;
  if (token && accessTokenExpiresSoon(token)) {
    try {
      token = await renewAccessToken(token);
    } catch (error) {
      if (auth === "required") throw error;
      token = null;
    }
  }

  // --- ejecutar la solicitud con los encabezados adecuados ---
  async function execute(accessToken: string | null): Promise<Response> {
    const headers = new Headers(customHeaders);
    if (typeof init.body === "string" && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
    else headers.delete("Authorization");

    return fetch(`${baseUrl}${path}`, { ...init, headers });
  }

  // 3. enviar la solicitud al gateway
  let response = await execute(token);

  // 4. reintentar una sola vez si el servidor rechaza el token
  if (response.status === 401 && auth !== "none" && token) {
    try {
      const renewed = await renewAccessToken(token);
      if (renewed) response = await execute(renewed);
      else if (auth === "optional") response = await execute(null);
    } catch (error) {
      if (auth === "required") throw error;
      if (!getStoredTokens()) response = await execute(null);
      else throw error;
    }
  }

  // 5. propagar el error si la respuesta final no fue exitosa
  if (!response.ok) throw new ApiHttpError(response.status);
  return response;
}

export async function apiJson<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const response = await apiFetch(path, options);
  if (response.status === 204) throw new Error("Respuesta JSON vacia");
  return (await response.json()) as T;
}

export async function apiVoid(
  path: string,
  options: ApiRequestOptions = {},
): Promise<void> {
  await apiFetch(path, options);
}
