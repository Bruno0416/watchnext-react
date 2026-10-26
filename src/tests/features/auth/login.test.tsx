// @vitest-environment jsdom

import { afterEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter, Route, Routes } from "react-router";
import { LoginPage } from "../../../features/auth/presentation/pages/login.page";

const { loginCall } = vi.hoisted(() => ({ loginCall: vi.fn() }));

vi.mock("../../../core/di/container", () => ({
  container: {
    resolve: () => ({ call: loginCall }),
  },
}));

afterEach(() => {
  cleanup();
  loginCall.mockReset();
});

function renderLogin() {
  render(
    <MemoryRouter initialEntries={["/auth/iniciar-sesion"]}>
      <Routes>
        <Route path="/auth/iniciar-sesion" element={<LoginPage />} />
        <Route path="/" element={<p>Inicio cargado</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

test("login permite ingresar con datos validos", async () => {
  loginCall.mockResolvedValue(undefined);
  renderLogin();

  fireEvent.change(screen.getByPlaceholderText("correo@ejemplo.com"), {
    target: { value: "ana@ejemplo.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Ingresa tu contraseña"), {
    target: { value: "clave123" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));

  expect(await screen.findByText("Inicio cargado")).toBeInTheDocument();
  expect(loginCall).toHaveBeenCalledTimes(1);
  expect(loginCall).toHaveBeenCalledWith("ana@ejemplo.com", "clave123");
});

test("login muestra errores para correo y contrasena invalidos", async () => {
  renderLogin();

  fireEvent.change(screen.getByPlaceholderText("correo@ejemplo.com"), {
    target: { value: "correo-invalido" },
  });
  fireEvent.change(screen.getByPlaceholderText("Ingresa tu contraseña"), {
    target: { value: "123" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Iniciar sesión" }));

  expect(
    await screen.findByText("El correo no tiene un formato valido"),
  ).toBeInTheDocument();
  expect(
    screen.getByText("La contraseña debe tener al menos 6 caracteres y como máximo 10"),
  ).toBeInTheDocument();
  expect(loginCall).not.toHaveBeenCalled();
});
