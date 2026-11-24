import type { AuthStorage } from "../mock/auth/auth.storage";
import type { JsonObject } from "../mock/json.types";
import { API_URL } from "./api.config";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type HttpOptions = {
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  auth?: boolean;
};

export type HttpResponse<T = unknown> = {
  ok: boolean;
  status: number;
  data: T | null;
};

// ---------- cliente http hacia el gateway ----------
export class HttpClient {
  private refreshing: Promise<boolean> | null = null;

  constructor(
    private readonly storage: AuthStorage,
    private readonly baseUrl: string = API_URL,
  ) {}

  async request<T = unknown>(
    method: HttpMethod,
    path: string,
    options: HttpOptions = {},
  ): Promise<HttpResponse<T>> {
    // 1. enviar peticion
    let response = await this.send(method, path, options);

    // 2. renovar token una vez si vencio
    if (response.status === 401 && options.auth !== false && this.storage.getTokens()) {
      const renewed = await this.renewTokens();

      if (renewed) {
        response = await this.send(method, path, options);
      }
    }

    // 3. leer cuerpo si viene
    return {
      ok: response.ok,
      status: response.status,
      data: (await this.readBody(response)) as T | null,
    };
  }

  get<T = unknown>(path: string, options?: HttpOptions) {
    return this.request<T>("GET", path, options);
  }

  post<T = unknown>(path: string, body?: unknown, options?: HttpOptions) {
    return this.request<T>("POST", path, { ...options, body });
  }

  put<T = unknown>(path: string, body?: unknown, options?: HttpOptions) {
    return this.request<T>("PUT", path, { ...options, body });
  }

  delete<T = unknown>(path: string, options?: HttpOptions) {
    return this.request<T>("DELETE", path, options);
  }

  // ---------- helpers ----------
  private async send(method: HttpMethod, path: string, options: HttpOptions): Promise<Response> {
    const headers: Record<string, string> = { Accept: "application/json" };
    const tokens = this.storage.getTokens();

    // 1. adjuntar token si hay sesion
    if (options.auth !== false && tokens) {
      headers.Authorization = `Bearer ${tokens.token as string}`;
    }

    // 2. preparar cuerpo json o multipart
    let body: BodyInit | undefined;

    if (options.body instanceof FormData) {
      body = options.body;
    } else if (options.body !== undefined) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(options.body);
    }

    return fetch(this.buildUrl(path, options.query), { method, headers, body });
  }

  private buildUrl(path: string, query?: HttpOptions["query"]): string {
    const url = `${this.baseUrl}${path}`;

    if (!query) {
      return url;
    }

    // 1. armar parametros sin los vacios
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== "") {
        params.set(key, String(value));
      }
    }

    const text = params.toString();

    return text ? `${url}?${text}` : url;
  }

  private async readBody(response: Response): Promise<unknown> {
    const text = await response.text();

    if (!text) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  private renewTokens(): Promise<boolean> {
    // 1. compartir una sola renovacion entre peticiones paralelas
    if (!this.refreshing) {
      this.refreshing = this.doRenew().finally(() => {
        this.refreshing = null;
      });
    }

    return this.refreshing;
  }

  private async doRenew(): Promise<boolean> {
    const tokens = this.storage.getTokens();

    if (!tokens) {
      return false;
    }

    // 1. pedir tokens nuevos
    const response = await this.send("POST", "/auth/refresh", {
      auth: false,
      body: { refreshToken: tokens.refreshToken },
    });

    if (!response.ok) {
      this.storage.clear();
      return false;
    }

    // 2. guardar tokens nuevos
    const json = (await this.readBody(response)) as JsonObject | null;

    if (!json) {
      return false;
    }

    this.storage.setTokens(json);

    return true;
  }
}

// ---------- leer datos del token ----------
export function readTokenClaims(token: string): JsonObject | null {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    );

    return JSON.parse(json) as JsonObject;
  } catch {
    return null;
  }
}
