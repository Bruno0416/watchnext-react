// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { clearSession } from "../../core/http/auth.session";
import { AdminUserNotFoundException } from "../../features/user-management/data/errors/user.management.exceptions";
import { UserManagementRepositoryImpl } from "../../features/user-management/data/repositories/user.management.repository.impl";
import { UserManagementRemoteSourceImpl } from "../../features/user-management/data/source/user.management.remote.source.impl";
import { SearchUsers } from "../../features/user-management/domain/usecases/search.users";
import { fakeBackend, fakeSession } from "../remote/fake.backend";

let repo: UserManagementRepositoryImpl;

// cuentas como las devuelve GET /api/v1/auth/admin/users
const cuentas = [
  { userId: "u2", email: "ana@mail.com", role: "USER", username: "ana", displayName: "Ana", onboardingCompleted: true },
  { userId: "u1", email: "admin@mail.com", role: "ADMIN", username: "admin", displayName: "Admin", onboardingCompleted: true },
  { userId: "u3", email: "beto@mail.com", role: "USER", username: "beto", displayName: null, onboardingCompleted: false },
];

beforeEach(() => {
  fakeSession();
  fakeBackend((_method, path) => {
    const id = path.split("?")[0].split("/")[6];
    if (!id) return { status: 200, body: cuentas };
    const cuenta = cuentas.find((c) => c.userId === id);
    return cuenta ? { status: 200, body: cuenta } : { status: 404 };
  });
  repo = new UserManagementRepositoryImpl(new UserManagementRemoteSourceImpl());
});

afterEach(() => {
  vi.unstubAllGlobals();
  clearSession();
});

test("HU15: la lista pone a los admin primero", async () => {
  const usuarios = await new SearchUsers(repo).call("  ");

  expect(usuarios[0].isAdmin).toBe(true);
  expect(usuarios.length).toBe(3);
});

test("HU15: el detalle junta la cuenta con el perfil", async () => {
  const detalle = await repo.getById("u2");

  expect(detalle.email).toBe("ana@mail.com");
  expect(detalle.username).toBe("ana");
});

test("HU15: un usuario que no existe tira la excepcion de no encontrado", async () => {
  await expect(repo.getById("no-existe")).rejects.toBeInstanceOf(AdminUserNotFoundException);
});
