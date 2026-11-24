// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { NewsRemoteSourceImpl } from "../../features/news/data/source/news.remote.source.impl";
import { NewsError } from "../../features/news/data/errors/news.errors";
import { ListContentRemoteSourceImpl } from "../../features/lists/data/source/list.content.remote.source.impl";
import { ListError } from "../../features/lists/data/errors/list.errors";
import { ProfileRemoteSourceImpl } from "../../features/profile/data/source/profile.remote.source.impl";
import { AdminRemoteSourceImpl } from "../../features/admin/data/source/admin.remote.source.impl";
import { clearSession, saveSessionTokens } from "../../core/http/auth.session";

// token falso con id y rol, vence en mucho tiempo
function fakeSession() {
  const payload = btoa(JSON.stringify({ id: "u1", role: "ADMIN", exp: 9999999999 }));
  saveSessionTokens({ token: `x.${payload}.y`, refreshToken: "r" });
}

// respuesta falsa del gateway
function mockFetch(status: number, body: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("sources remotos", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    clearSession();
  });

  it("noticias: pide /api/v1/news al gateway", async () => {
    const fetchMock = mockFetch(200, [
      { id: "1", title: "Estreno", slug: "estreno", summary: "r", content: "c", publishedAt: "2026-11-01T00:00:00Z" },
    ]);
    const news = await new NewsRemoteSourceImpl().getAll();
    expect(String(fetchMock.mock.calls[0][0])).toContain("/api/v1/news");
    expect(news).toHaveLength(1);
  });

  it("noticias: un 404 del backend sale como NewsError", async () => {
    mockFetch(404, {});
    await expect(new NewsRemoteSourceImpl().getById("x")).rejects.toBeInstanceOf(NewsError);
  });

  it("buscador de listas: lee content.results", async () => {
    const fetchMock = mockFetch(200, {
      content: { results: [{ id: 550, media_type: "movie", title: "Fight Club" }] },
    });
    const items = await new ListContentRemoteSourceImpl().search("fight");
    expect(String(fetchMock.mock.calls[0][0])).toContain("/api/v1/search?q=fight");
    expect(items).toHaveLength(1);
  });

  it("buscador de listas: sin conexion sale como ListError 0", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("failed")));
    await expect(new ListContentRemoteSourceImpl().search("x")).rejects.toMatchObject({ status: 0 });
    await expect(new ListContentRemoteSourceImpl().search("x")).rejects.toBeInstanceOf(ListError);
  });

  it("perfil: los favoritos van a /users/me/favorites", async () => {
    fakeSession();
    const fetchMock = mockFetch(200, { username: "ana", favorites: [] });
    await new ProfileRemoteSourceImpl().update({
      favorites: [{ tmdbId: 550, mediaType: "movie", position: 0 }],
    });
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("/api/v1/users/me/favorites");
    expect(JSON.parse(String(init.body))).toEqual({ items: [{ tmdbId: 550, mediaType: "MOVIE", position: 0 }] });
  });

  it("admin: el resumen sale de usuarios y noticias del backend", async () => {
    fakeSession();
    const fetchMock = vi.fn((url: string) => {
      const body = url.includes("/users/search")
        ? { content: [{ userId: "u1", username: "admin" }, { userId: "u2", username: "ana" }] }
        : [{ id: "n1", publishedAt: "2026-11-01T00:00:00Z" }];
      return Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
    });
    vi.stubGlobal("fetch", fetchMock);
    const summary = (await new AdminRemoteSourceImpl().getSummary()).toDomain();
    expect(summary.totalUsers).toBe(2);
    expect(summary.admins).toBe(1);
    expect(summary.totalNews).toBe(1);
  });
});
