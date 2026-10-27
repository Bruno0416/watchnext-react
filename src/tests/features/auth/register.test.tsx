// @vitest-environment jsdom

import { afterEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter, Route, Routes } from "react-router";
import { RegisterPage } from "../../../features/auth/presentation/pages/register.page";

const { registerCall } = vi.hoisted(() => ({ registerCall: vi.fn() }));

vi.mock("../../../core/di/container", () => ({
  container: {
    resolve: () => ({ call: registerCall }),
  },
}));

afterEach(() => {
  cleanup();
  registerCall.mockReset();
});

function renderRegister() {
  render(
    <MemoryRouter initialEntries={["/auth/registrarse"]}>
      <Routes>
        <Route path="/auth/registrarse" element={<RegisterPage />} />
        <Route path="/auth/verificar-correo" element={<p>Verificación pendiente</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

test("register permite registrar datos validos", async () => {
  registerCall.mockResolvedValue(undefined);
  renderRegister();

  fireEvent.change(screen.getByPlaceholderText("correo@ejemplo.com"), {
    target: { value: "ana@ejemplo.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Ingresa tu contraseña"), {
    target: { value: "clave123" },
  });
  fireEvent.change(screen.getByPlaceholderText("Repite tu contraseña"), {
    target: { value: "clave123" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Registrarse" }));

  expect(await screen.findByText("Verificación pendiente")).toBeInTheDocument();
  expect(registerCall).toHaveBeenCalledTimes(1);
  expect(registerCall).toHaveBeenCalledWith("ana@ejemplo.com", "clave123");
});

test("register muestra errores para todos los campos invalidos", async () => {
  renderRegister();

  fireEvent.change(screen.getByPlaceholderText("correo@ejemplo.com"), {
    target: { value: "correo-invalido" },
  });
  fireEvent.change(screen.getByPlaceholderText("Ingresa tu contraseña"), {
    target: { value: "123" },
  });
  fireEvent.change(screen.getByPlaceholderText("Repite tu contraseña"), {
    target: { value: "321" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Registrarse" }));

  expect(
    await screen.findByText("El correo no tiene un formato valido"),
  ).toBeInTheDocument();
  expect(
    screen.getByText("La contraseña debe tener al menos 6 caracteres y como máximo 10"),
  ).toBeInTheDocument();
  expect(screen.getByText("Las contraseñas no coinciden")).toBeInTheDocument();
  expect(registerCall).not.toHaveBeenCalled();
});
