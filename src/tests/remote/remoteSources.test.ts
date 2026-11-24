// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { NewsRemoteSourceImpl } from "../../features/news/data/source/news.remote.source.impl";
import { NewsError } from "../../features/news/data/errors/news.errors";
import { ListContentRemoteSourceImpl } from "../../features/lists/data/source/list.content.remote.source.impl";
import { ListError } from "../../features/lists/data/errors/list.errors";
import { ProfileRemoteSourceImpl } from "../../features/profile/data/source/profile.remote.source.impl";
import { AdminRemoteSourceImpl } from "../../features/admin/data/source/admin.remote.source.impl";
import { SocialRemoteSourceImpl } from "../../features/profile/data/source/social.remote.source.impl";
import { UserManagementRemoteSourceImpl } from "../../features/user-management/data/source/user.management.remote.source.impl";
import { clearSession } from "../../core/http/auth.session";
import { fakeSession } from "./fake.backend";

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
      content: {
        results: [
          { tmdbId: 550, mediaType: "movie", title: "Fight Club" },
          { tmdbId: 287, mediaType: "person", title: "Brad Pitt" },
        ],
      },
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
      const body = url.includes("/auth/admin/users")
        ? [{ userId: "u1", role: "ADMIN", onboardingCompleted: true }, { userId: "u2", role: "USER", onboardingCompleted: false }]
        : [{ id: "n1", publishedAt: "2026-11-01T00:00:00Z" }];
      return Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
    });
    vi.stubGlobal("fetch", fetchMock);
    const summary = (await new AdminRemoteSourceImpl().getSummary()).toDomain();
    expect(summary.totalUsers).toBe(2);
    expect(summary.admins).toBe(1);
    expect(summary.pendingOnboarding).toBe(1);
    expect(summary.totalNews).toBe(1);
  });

  it("seguidores: perfil privado que no sigo devuelve lista vacia", async () => {
    fakeSession();
    const fetchMock = mockFetch(403, {});
    const followers = await new SocialRemoteSourceImpl().getFollowers("privado");
    expect(String(fetchMock.mock.calls[0][0])).toContain("/api/v1/users/privado/followers");
    expect(followers).toEqual([]);
  });

  it("seguidores: la relacion sale del endpoint del backend", async () => {
    fakeSession();
    mockFetch(200, { following: false, requested: true, followsYou: true });
    const relation = await new SocialRemoteSourceImpl().getRelationship("ana");
    expect(relation).toEqual({ following: false, requested: true, followsYou: true });
  });

  it("usuarios: crear va al endpoint de admin del auth-service", async () => {
    fakeSession();
    const fetchMock = mockFetch(201, { userId: "u9", email: "nuevo@mail.com", role: "USER" });
    const user = await new UserManagementRemoteSourceImpl().create({ email: "nuevo@mail.com", password: "clave1234", role: "USER" });
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("/api/v1/auth/admin/users");
    expect(init.method).toBe("POST");
    expect(user.toDomain().email).toBe("nuevo@mail.com");
  });

  it("usuarios: correo repetido muestra el mensaje del backend", async () => {
    fakeSession();
    mockFetch(409, {});
    await expect(new UserManagementRemoteSourceImpl().create({ email: "a@mail.com", password: "clave1234", role: "USER" }))
      .rejects.toThrow("Ya existe una cuenta con ese correo.");
  });
});
