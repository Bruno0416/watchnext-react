import { vi } from "vitest";
import { saveSessionTokens } from "../../core/http/auth.session";

// sesion falsa con id y rol, el token vence en mucho tiempo
export function fakeSession(id = "u1", role: "ADMIN" | "USER" = "ADMIN") {
  const payload = btoa(JSON.stringify({ id, role, exp: 9999999999 }));
  saveSessionTokens({ token: `x.${payload}.y`, refreshToken: "r" });
}

type Handler = (method: string, path: string, body: unknown) => { status: number; body?: unknown };

// gateway falso: responde segun metodo y ruta, asi pruebo el source remoto sin backend
export function fakeBackend(handler: Handler) {
  const fetchMock = vi.fn(async (url: string | URL, init?: RequestInit) => {
    const { pathname, search } = new URL(String(url));
    const body = typeof init?.body === "string" ? JSON.parse(init.body) : undefined;
    const result = handler(init?.method ?? "GET", pathname + search, body);
    return new Response(result.body === undefined ? null : JSON.stringify(result.body), {
      status: result.status,
      headers: { "Content-Type": "application/json" },
    });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}
