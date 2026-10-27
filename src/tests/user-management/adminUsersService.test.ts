// @vitest-environment jsdom
import { beforeEach, expect, test, vi } from "vitest";

import { AdminUsersService } from "../../core/mock/admin/admin.users.service";
import { AuthDb } from "../../core/mock/auth/auth.db";
import { ProfileDb } from "../../core/mock/user/profile.db";
import { ProfileStorage } from "../../core/mock/user/profile.storage";
import authSeed from "../../../public/data/auth.json";
import profilesSeed from "../../../public/data/profiles.json";

let service: AdminUsersService;

beforeEach(() => {
  // cada db pide su json; devuelvo el fixture que corresponda
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => new Response(JSON.stringify(url.includes("auth") ? authSeed : profilesSeed))),
  );
  localStorage.clear();
  service = new AdminUsersService(new AuthDb(), new ProfileDb(new ProfileStorage()));
});

test("HU15: nunca devuelve la contraseña", async () => {
  const usuarios = await service.list("");

  expect(usuarios.length).toBe(3);
  expect(usuarios.every((u) => !("password" in u))).toBe(true);
});

test("HU15: busca por correo, username o nombre", async () => {
  expect((await service.list("bru")).map((u) => u.username)).toEqual(["bru_vall"]);
  expect((await service.list("ADONYS@")).length).toBe(1);
  expect((await service.list("nadie")).length).toBe(0);
});

test("HU15: un id que no existe devuelve null (404)", async () => {
  expect(await service.get("no-existe")).toBe(null);
});
