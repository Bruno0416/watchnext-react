// @vitest-environment jsdom
import { beforeEach, expect, test, vi } from "vitest";

import { AuthStorage } from "../../core/mock/auth/auth.storage";
import { ProfileDb } from "../../core/mock/user/profile.db";
import { ProfileStorage } from "../../core/mock/user/profile.storage";
import { SocialService } from "../../core/mock/user/social.service";
import seed from "../../../public/data/profiles.json";

const ADONYS = "39bbdb0b-a3f1-5bf2-9ef0-aa40bbc44cf6";
const ADMIN = "fd925a45-0eae-58d4-9355-08d87db6bdb1";

let storage: AuthStorage;
let service: SocialService;

beforeEach(() => {
  // el mock lee /data/profiles.json con fetch: le devuelvo el fixture
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify(seed))));
  localStorage.clear();
  storage = new AuthStorage();
  service = new SocialService(new ProfileDb(new ProfileStorage()), storage);
});

test("HU11: seguir un perfil privado queda como solicitud", async () => {
  // Adonys tiene la sesion
  localStorage.setItem("user-id", ADONYS);

  const r = await service.follow("watchnext_admin");

  expect(r?.status).toBe("REQUESTED");
});

test("HU11: al aceptar la solicitud pasa a ser seguidor", async () => {
  // 1. Adonys pide seguir al admin
  localStorage.setItem("user-id", ADONYS);
  await service.follow("watchnext_admin");

  // 2. el admin ve la solicitud y la acepta
  localStorage.setItem("user-id", ADMIN);
  const pendientes = await service.getMyFollowRequests();
  expect(pendientes?.map((p) => p.username)).toEqual(["adonys"]);
  await service.acceptFollowRequest("adonys");

  // 3. ahora Adonys aparece en sus seguidores y ya no hay solicitudes
  const seguidores = await service.getFollowers("watchnext_admin");
  expect(seguidores?.map((p) => p.username)).toEqual(["adonys"]);
  expect((await service.getMyFollowRequests())?.length).toBe(0);
});

test("HU11: dejar de seguir baja el contador de seguidores", async () => {
  localStorage.setItem("user-id", ADONYS);

  await service.unfollow("bru_vall");

  const seguidores = await service.getFollowers("bru_vall");
  expect(seguidores?.length).toBe(0);
});
