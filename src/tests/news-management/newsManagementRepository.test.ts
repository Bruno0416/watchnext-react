// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { clearSession } from "../../core/http/auth.session";
import { NewsNotFoundForEditException } from "../../features/news-management/data/errors/news.management.exceptions";
import { NewsManagementRepositoryImpl } from "../../features/news-management/data/repositories/news.management.repository.impl";
import { NewsManagementRemoteSourceImpl } from "../../features/news-management/data/source/news.management.remote.source.impl";
import { fakeBackend, fakeSession } from "../remote/fake.backend";

type Noticia = Record<string, unknown>;

let repo: NewsManagementRepositoryImpl;
let noticias: Noticia[];

const borrador = {
  title: "Cuatro títulos nuevos",
  summary: "Lo que llega este mes al catalogo.",
  content: "Este mes sumamos varios titulos nuevos para tus listas.",
  imageUrl: "",
};

beforeEach(() => {
  // 1. news-service falso en memoria con dos noticias
  noticias = [
    { id: "n1", slug: "vieja", title: "Vieja", summary: "s", content: "c", imageUrl: null, publishedAt: "2026-01-01T00:00:00Z" },
    { id: "n2", slug: "nueva", title: "Nueva", summary: "s", content: "c", imageUrl: null, publishedAt: "2026-06-01T00:00:00Z" },
  ];
  fakeSession();
  fakeBackend((method, path, body) => {
    const id = path.split("/")[4];
    const index = noticias.findIndex((n) => n.id === id);
    if (method === "GET") return { status: 200, body: noticias };
    if (method === "POST") {
      const nueva = { ...(body as Noticia), id: `n${noticias.length + 1}` };
      noticias.push(nueva);
      return { status: 201, body: nueva };
    }
    if (index < 0) return { status: 404 };
    if (method === "PUT") {
      noticias[index] = { ...noticias[index], ...(body as Noticia) };
      return { status: 200, body: noticias[index] };
    }
    noticias.splice(index, 1);
    return { status: 204 };
  });
  repo = new NewsManagementRepositoryImpl(new NewsManagementRemoteSourceImpl());
});

afterEach(() => {
  vi.unstubAllGlobals();
  clearSession();
});

test("HU14 datos leer: trae las noticias de la mas nueva a la mas vieja", async () => {
  const lista = await repo.getAll();

  expect(lista.map((n) => n.id)).toEqual(["n2", "n1"]);
});

test("HU14 datos crear: manda el slug y la fecha, y queda guardada", async () => {
  const nueva = await repo.create(borrador);

  expect(nueva.slug).toBe("cuatro-titulos-nuevos");
  expect(nueva.imageUrl).toBe(null);
  expect(Number.isNaN(nueva.publishedAt.getTime())).toBe(false);
  expect((await repo.getAll())[0].id).toBe(nueva.id);
});

test("HU14 datos actualizar: cambia el texto y mantiene la fecha", async () => {
  const [primera] = await repo.getAll();

  const editada = await repo.update(primera.id, { ...borrador, title: "Titulo editado" });

  expect(editada.title).toBe("Titulo editado");
  expect(editada.publishedAt.getTime()).toBe(primera.publishedAt.getTime());
});

test("HU14 datos eliminar: la noticia ya no aparece", async () => {
  const [primera] = await repo.getAll();

  await repo.delete(primera.id);

  expect((await repo.getAll()).some((n) => n.id === primera.id)).toBe(false);
});

test("HU14 datos: editar una que no existe avisa con mensaje claro", async () => {
  await expect(repo.update("no-existe", borrador)).rejects.toBeInstanceOf(NewsNotFoundForEditException);
});
