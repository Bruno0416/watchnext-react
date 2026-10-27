// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { NewsArticle } from "../../features/news/domain/entities/news.article";
import { NewsList } from "../../features/news/presentation/components/organisms/news.list";

// limpio el dom entre pruebas porque no uso globals
afterEach(() => cleanup());

function noticia(id: string, title: string): NewsArticle {
  return new NewsArticle({
    id,
    slug: id,
    title,
    summary: `Resumen de ${title}`,
    content: "contenido",
    imageUrl: null,
    publishedAt: new Date("2026-10-01T12:00:00Z"),
  });
}

test("HU13: muestra una tarjeta por cada noticia de la lista", () => {
  // Mostramos la lista con dos noticias
  render(
    <MemoryRouter>
      <NewsList articles={[noticia("1", "Primera"), noticia("2", "Segunda")]} />
    </MemoryRouter>,
  );

  // Comprobamos que salen los dos titulos
  const titulos = screen.getAllByRole("heading", { level: 2 });
  expect(titulos.length).toBe(2);
  expect(titulos[0].textContent).toBe("Primera");
});

test("HU13: cada tarjeta lleva al detalle por id (ruta con parametro)", () => {
  render(
    <MemoryRouter>
      <NewsList articles={[noticia("abc-123", "Con enlace")]} />
    </MemoryRouter>,
  );

  // El enlace debe apuntar a /noticias/:id
  const enlace = screen.getByRole("link");
  expect(enlace.getAttribute("href")).toBe("/noticias/abc-123");
});

test("HU13: sin noticias muestra el mensaje de vacio", () => {
  render(
    <MemoryRouter>
      <NewsList articles={[]} />
    </MemoryRouter>,
  );

  // Renderizado condicional: aparece el estado vacio en vez de la grilla
  expect(screen.getByText("Todavía no hay noticias")).toBeTruthy();
  expect(screen.queryAllByRole("link").length).toBe(0);
});
