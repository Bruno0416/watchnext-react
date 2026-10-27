// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { NewsForm } from "../../features/news-management/presentation/components/organisms/news.form";
import { initialNewsFormState } from "../../features/news-management/presentation/models/news.management.state";

afterEach(() => cleanup());

test("HU14: crear y editar usan el mismo formulario con distinto boton", () => {
  // Formulario nuevo
  const { rerender } = render(
    <NewsForm form={{ ...initialNewsFormState, isOpen: true }} onField={() => {}} onBlur={() => {}} onSubmit={() => {}} onCancel={() => {}} />,
  );
  expect(screen.getByRole("button", { name: "Publicar" })).toBeTruthy();

  // Mismo formulario editando una noticia
  rerender(
    <NewsForm form={{ ...initialNewsFormState, isOpen: true, editingId: "1" }} onField={() => {}} onBlur={() => {}} onSubmit={() => {}} onCancel={() => {}} />,
  );
  expect(screen.getByRole("button", { name: "Guardar cambios" })).toBeTruthy();
});

test("HU14: escribir en el titulo avisa el campo y el valor", () => {
  const onField = vi.fn();
  render(<NewsForm form={{ ...initialNewsFormState, isOpen: true }} onField={onField} onBlur={() => {}} onSubmit={() => {}} onCancel={() => {}} />);

  // Simulamos que el usuario escribe
  fireEvent.change(screen.getByLabelText("Titulo"), { target: { value: "Nueva" } });

  expect(onField).toHaveBeenCalledWith("title", "Nueva");
});

test("HU14: muestra los errores de validacion que trae el estado", () => {
  render(
    <NewsForm
      form={{ ...initialNewsFormState, isOpen: true, titleError: "El titulo es obligatorio" }}
      onField={() => {}}
      onBlur={() => {}}
      onSubmit={() => {}}
      onCancel={() => {}}
    />,
  );

  expect(screen.getByText("El titulo es obligatorio")).toBeTruthy();
  // el input queda marcado como invalido
  expect(screen.getByLabelText("Titulo").getAttribute("aria-invalid")).toBe("true");
});

test("HU14: enviar el formulario llama a onSubmit", () => {
  const onSubmit = vi.fn();
  render(<NewsForm form={{ ...initialNewsFormState, isOpen: true }} onField={() => {}} onBlur={() => {}} onSubmit={onSubmit} onCancel={() => {}} />);

  fireEvent.click(screen.getByRole("button", { name: "Publicar" }));

  expect(onSubmit).toHaveBeenCalledTimes(1);
});
