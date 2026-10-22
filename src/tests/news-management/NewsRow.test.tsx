// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { ManagedNews } from "../../features/news-management/domain/entities/managed.news";
import { NewsRow } from "../../features/news-management/presentation/components/molecules/news.row";

afterEach(() => cleanup());

const noticia = new ManagedNews({
  id: "7",
  slug: "estrenos",
  title: "Estrenos",
  summary: "Resumen",
  content: "Contenido",
  imageUrl: null,
  publishedAt: new Date("2026-10-01T12:00:00Z"),
});

function fila(askingDelete: boolean, extra: Partial<Parameters<typeof NewsRow>[0]> = {}) {
  return (
    <NewsRow
      news={noticia}
      askingDelete={askingDelete}
      isDeleting={false}
      onEdit={() => {}}
      onAskDelete={() => {}}
      onCancelDelete={() => {}}
      onConfirmDelete={() => {}}
      {...extra}
    />
  );
}

test("HU14: Eliminar no borra al tiro, primero pide el id para confirmar", () => {
  const onAskDelete = vi.fn();
  render(fila(false, { onAskDelete }));

  fireEvent.click(screen.getByRole("button", { name: "Eliminar Estrenos" }));

  expect(onAskDelete).toHaveBeenCalledWith("7");
});

test("HU14: en modo confirmacion muestra la pregunta y el boton de confirmar", () => {
  const onConfirmDelete = vi.fn();
  render(fila(true, { onConfirmDelete }));

  expect(screen.getByText("¿Eliminar esta noticia?")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Si, eliminar" }));
  expect(onConfirmDelete).toHaveBeenCalledTimes(1);
});
