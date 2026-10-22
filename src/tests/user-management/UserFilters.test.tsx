// @vitest-environment jsdom
import { afterEach, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { AdminUser, AdminUserRole } from "../../features/user-management/domain/entities/admin.user";
import { UserFilters } from "../../features/user-management/presentation/components/molecules/user.filters";
import { filtrarPorRol } from "../../features/user-management/presentation/viewmodels/user.list.viewmodel";

afterEach(() => cleanup());

function usuario(id: string, role: AdminUserRole): AdminUser {
  return new AdminUser({
    userId: id,
    email: `${id}@example.com`,
    role,
    emailVerified: true,
    username: id,
    displayName: null,
    country: "CL",
    isPrivate: false,
    onboardingCompleted: true,
    followersCount: 0,
    followingCount: 0,
    favoritesCount: 0,
    createdAt: null,
  });
}

test("HU15: escribir en el buscador avisa el texto", () => {
  const onQuery = vi.fn();
  render(<UserFilters query="" role="ALL" total={3} onQuery={onQuery} onRole={() => {}} />);

  fireEvent.change(screen.getByLabelText("Buscar usuarios"), { target: { value: "bru" } });

  expect(onQuery).toHaveBeenCalledWith("bru");
});

test("HU15: cambiar el rol avisa el filtro elegido", () => {
  const onRole = vi.fn();
  render(<UserFilters query="" role="ALL" total={3} onQuery={() => {}} onRole={onRole} />);

  fireEvent.change(screen.getByLabelText("Filtrar por rol"), { target: { value: "ADMIN" } });

  expect(onRole).toHaveBeenCalledWith("ADMIN");
});

test("HU15 filtro: por rol deja solo los que corresponden", () => {
  const lista = [usuario("a", AdminUserRole.ADMIN), usuario("b", AdminUserRole.USER), usuario("c", AdminUserRole.USER)];

  expect(filtrarPorRol(lista, "ALL").length).toBe(3);
  expect(filtrarPorRol(lista, "ADMIN").map((u) => u.userId)).toEqual(["a"]);
  expect(filtrarPorRol(lista, "USER").length).toBe(2);
});
