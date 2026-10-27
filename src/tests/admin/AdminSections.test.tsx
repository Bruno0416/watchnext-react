// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { AdminSummary } from "../../features/admin/domain/entities/admin.summary";
import { AdminSections } from "../../features/admin/presentation/components/organisms/admin.sections";

afterEach(() => cleanup());

const resumen = new AdminSummary({
  totalUsers: 3,
  admins: 1,
  pendingOnboarding: 0,
  totalNews: 2,
  lastNewsAt: new Date("2026-10-03T12:00:00Z"),
});

test("HU16: el panel tiene acceso a usuarios y a noticias", () => {
  render(
    <MemoryRouter>
      <AdminSections summary={null} />
    </MemoryRouter>,
  );

  const enlaces = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
  expect(enlaces).toEqual(["/admin/usuarios", "/admin/noticias"]);
});

test("HU16: con el resumen cargado muestra los numeros", () => {
  render(
    <MemoryRouter>
      <AdminSections summary={resumen} />
    </MemoryRouter>,
  );

  expect(screen.getByText("cuentas").previousSibling?.textContent).toBe("3");
  expect(screen.getByText("publicadas").previousSibling?.textContent).toBe("2");
});

test("HU16: las tarjetas usan las clases responsivas de Bootstrap", () => {
  // el desafio del profe: comprobar col-12 y col-md-6
  const { container } = render(
    <MemoryRouter>
      <AdminSections summary={null} />
    </MemoryRouter>,
  );

  const columnas = container.querySelectorAll(".row > div");
  expect(columnas.length).toBe(2);
  columnas.forEach((c) => {
    expect(c.classList.contains("col-12")).toBe(true);
    expect(c.classList.contains("col-md-6")).toBe(true);
  });
});
