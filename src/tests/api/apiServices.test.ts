// @vitest-environment jsdom

import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { HttpClient, readTokenClaims } from "../../core/api/http.client";
import { AuthApiService } from "../../core/api/auth/auth.api.service";
import { ContentApiService } from "../../core/api/content/content.api.service";
import { FeedbackApiService } from "../../core/api/feedback/feedback.api.service";
import { ListApiService } from "../../core/api/list/list.api.service";
import { UserApiService } from "../../core/api/user/user.api.service";
import { AuthStorage } from "../../core/mock/auth/auth.storage";
import { FeedbackRatingError } from "../../core/mock/feedback/feedback.rating.error";
import { ListServiceError } from "../../core/mock/list/list.service.error";

// ---------- ayudas ----------
// token falso con los mismos datos que firma auth-service
function token(claims: Record<string, string>): string {
  const payload = btoa(JSON.stringify(claims)).replace(/=+$/, "");
  return `cabecera.${payload}.firma`;
}

function respuesta(status: number, body?: unknown): Response {
  return new Response(body === undefined ? null : JSON.stringify(body), { status });
}

const fetchMock = vi.fn();
let storage: AuthStorage;
let http: HttpClient;

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("fetch", fetchMock);
  storage = new AuthStorage();
  http = new HttpClient(storage, "/api/v1");
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
});

// ---------- cliente http ----------
test("readTokenClaims lee el rol y el id del token", () => {
  const claims = readTokenClaims(token({ id: "u-1", role: "ADMIN" }));

  expect(claims?.id).toBe("u-1");
  expect(claims?.role).toBe("ADMIN");
});

test("el cliente manda el token y renueva la sesion cuando responde 401", async () => {
  storage.setTokens({ token: "viejo", refreshToken: "r-1" });
  fetchMock
    .mockResolvedValueOnce(respuesta(401))
    .mockResolvedValueOnce(respuesta(200, { token: "nuevo", refreshToken: "r-2" }))
    .mockResolvedValueOnce(respuesta(200, { ok: true }));

  const res = await http.get("/users/me");

  expect(res.ok).toBe(true);
  expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer viejo");
  expect(fetchMock.mock.calls[1][0]).toBe("/api/v1/auth/refresh");
  expect(fetchMock.mock.calls[2][1].headers.Authorization).toBe("Bearer nuevo");
});

// ---------- auth ----------
test("login guarda tokens, rol e id sacados del token", async () => {
  const access = token({ id: "u-7", role: "USER", email: "ana@ejemplo.com" });
  fetchMock.mockResolvedValueOnce(respuesta(200, { token: access, refreshToken: "r" }));

  const json = await new AuthApiService(http, storage).login({ email: "ana@ejemplo.com", password: "x" });

  expect(json?.token).toBe(access);
  expect(storage.getRole()).toBe("USER");
  expect(storage.getUserId()).toBe("u-7");
  expect(fetchMock.mock.calls[0][0]).toBe("/api/v1/auth/login");
});

test("login con clave mala devuelve null igual que el mock", async () => {
  fetchMock.mockResolvedValueOnce(respuesta(401, { message: "Credenciales inválidas" }));

  const json = await new AuthApiService(http, storage).login({ email: "a@b.cl", password: "mala" });

  expect(json).toBeNull();
  expect(storage.getTokens()).toBeNull();
});

// ---------- contenido ----------
test("contenido pide la lista en español y la devuelve tal cual", async () => {
  fetchMock.mockResolvedValueOnce(respuesta(200, { page: 1, results: [{ id: 1 }], total_pages: 1, total_results: 1 }));

  const json = await new ContentApiService(http).getPopularMovies();

  expect(fetchMock.mock.calls[0][0]).toBe("/api/v1/content/movies/popular?language=es-MX");
  expect(json.results).toEqual([{ id: 1 }]);
});

// ---------- calificaciones ----------
test("sin calificacion el 404 se vuelve null", async () => {
  fetchMock.mockResolvedValueOnce(respuesta(404));

  expect(await new FeedbackApiService(http).getMyRating(550)).toBeNull();
});

test("calificar dos veces da DUPLICATE_RATING", async () => {
  fetchMock.mockResolvedValueOnce(respuesta(409));

  await expect(
    new FeedbackApiService(http).createRating({ tmdbId: 550, mediaType: "MOVIE", score: 8 }),
  ).rejects.toEqual(new FeedbackRatingError("DUPLICATE_RATING"));
});

// ---------- listas ----------
test("una lista que no existe da el mismo error 404 que el mock", async () => {
  fetchMock.mockResolvedValueOnce(respuesta(404));

  await expect(new ListApiService(http, storage).getById("x")).rejects.toEqual(new ListServiceError(404));
});

test("agregar a la lista manda tmdbId y mediaType y devuelve la lista nueva", async () => {
  storage.setUserId("u-1");
  fetchMock
    .mockResolvedValueOnce(respuesta(200))
    .mockResolvedValueOnce(respuesta(200, { id: "l-1", name: "Pendientes", items: [{ tmdbId: 550 }] }))
    .mockResolvedValueOnce(respuesta(200, { lists: [{ id: "l-1" }] }));

  const json = await new ListApiService(http, storage).addItem("l-1", { tmdbId: 550, mediaType: "MOVIE", title: "x" });

  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ items: [{ tmdbId: 550, mediaType: "MOVIE" }] });
  expect(json.userId).toBe("u-1");
});

// ---------- perfil ----------
test("el onboarding va como multipart con los datos en la parte data", async () => {
  fetchMock.mockResolvedValueOnce(respuesta(204));

  const json = await new UserApiService(http).completeOnboarding({ username: "ana", country: "CL" });
  const body = fetchMock.mock.calls[0][1].body as FormData;

  expect(json).toEqual({ success: true });
  expect(body.get("data")).toBeInstanceOf(Blob);
});

// ---------- noticias ----------
test("las noticias se leen sin token desde news-service", async () => {
  storage.setTokens({ token: "t", refreshToken: "r" });
  fetchMock.mockResolvedValueOnce(respuesta(200, [{ id: "n-1", slug: "hola", title: "Hola" }]));

  const { NewsApiService } = await import("../../core/api/news/news.api.service");
  const json = await new NewsApiService(http).getAll();

  expect(fetchMock.mock.calls[0][0]).toBe("/api/v1/news");
  expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
  expect(json).toHaveLength(1);
});
