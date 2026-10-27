// @vitest-environment jsdom
import { beforeEach, expect, test, vi } from "vitest";

import { NewsDb } from "../../core/mock/news/news.db";
import { NewsService } from "../../core/mock/news/news.service";
import { NewsStorage } from "../../core/mock/news/news.storage";
import { NewsNotFoundForEditException } from "../../features/news-management/data/errors/news.management.exceptions";
import { NewsManagementRepositoryImpl } from "../../features/news-management/data/repositories/news.management.repository.impl";
import { NewsManagementLocalSourceImpl } from "../../features/news-management/data/source/news.management.local.source.impl";
import seed from "../../../public/data/news.json";

let repo: NewsManagementRepositoryImpl;

const borrador = {
  title: "Cuatro títulos nuevos",
  summary: "Lo que llega este mes al catalogo.",
  content: "Este mes sumamos varios titulos nuevos para tus listas.",
  imageUrl: "",
};

beforeEach(() => {
  // el mock de noticias lee /data/news.json y guarda en localStorage
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify(seed))));
  localStorage.clear();
  const service = new NewsService(new NewsDb(new NewsStorage()));
  repo = new NewsManagementRepositoryImpl(new NewsManagementLocalSourceImpl(service));
});

test("HU14 datos leer: trae las noticias de la mas nueva a la mas vieja", async () => {
  const noticias = await repo.getAll();

  expect(noticias.length).toBe(seed.articles.length);
  for (let i = 1; i < noticias.length; i++) {
    expect(noticias[i - 1].publishedAt.getTime()).toBeGreaterThanOrEqual(noticias[i].publishedAt.getTime());
  }
});

test("HU14 datos crear: genera id, slug y fecha, y queda guardada", async () => {
  const nueva = await repo.create(borrador);

  expect(nueva.id.length).toBeGreaterThan(0);
  expect(nueva.slug).toBe("cuatro-titulos-nuevos");
  expect(nueva.imageUrl).toBe(null);
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
