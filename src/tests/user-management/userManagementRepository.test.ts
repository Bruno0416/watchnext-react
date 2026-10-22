// @vitest-environment jsdom
import { beforeEach, expect, test, vi } from "vitest";

import { AdminUsersService } from "../../core/mock/admin/admin.users.service";
import { AuthDb } from "../../core/mock/auth/auth.db";
import { ProfileDb } from "../../core/mock/user/profile.db";
import { ProfileStorage } from "../../core/mock/user/profile.storage";
import { AdminUserNotFoundException } from "../../features/user-management/data/errors/user.management.exceptions";
import { UserManagementRepositoryImpl } from "../../features/user-management/data/repositories/user.management.repository.impl";
import { UserManagementLocalSourceImpl } from "../../features/user-management/data/source/user.management.local.source.impl";
import { SearchUsers } from "../../features/user-management/domain/usecases/search.users";
import authSeed from "../../../public/data/auth.json";
import profilesSeed from "../../../public/data/profiles.json";

let repo: UserManagementRepositoryImpl;

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => new Response(JSON.stringify(url.includes("auth") ? authSeed : profilesSeed))),
  );
  localStorage.clear();
  const service = new AdminUsersService(new AuthDb(), new ProfileDb(new ProfileStorage()));
  repo = new UserManagementRepositoryImpl(new UserManagementLocalSourceImpl(service));
});

test("HU15: la lista pone a los admin primero", async () => {
  const usuarios = await new SearchUsers(repo).call("  ");

  expect(usuarios[0].isAdmin).toBe(true);
  expect(usuarios.length).toBe(3);
});

test("HU15: el detalle junta la cuenta con el perfil", async () => {
  const [, segundo] = await repo.search("");

  const detalle = await repo.getById(segundo.userId);

  expect(detalle.email).toBe(segundo.email);
  expect(detalle.username).not.toBe(null);
});

test("HU15: un usuario que no existe tira la excepcion de no encontrado", async () => {
  await expect(repo.getById("no-existe")).rejects.toBeInstanceOf(AdminUserNotFoundException);
});
