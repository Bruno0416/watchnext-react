import type { JsonArray, JsonObject } from "../json.types";
import type { AuthStorage } from "../auth/auth.storage";
import type { ProfileDb } from "./profile.db";

/**
 * Endpoints simulados de relaciones del User Service: followers, following y follow requests.
 * Lo separo de UserService para no tocar lo que ya armo Bruno. Las relaciones se guardan por userId
 * y los datos visibles (username, nombre) se resuelven al momento desde el perfil, asi no quedan viejos.
 *
 * Contratos que imito:
 *   GET    /users/{username}/followers        -> [ProfileSummary]
 *   GET    /users/{username}/following        -> [ProfileSummary]
 *   GET    /users/{username}/relationship     -> { following, requested, followsYou }
 *   POST   /users/{username}/follow           -> { status: "FOLLOWING" | "REQUESTED" }
 *   DELETE /users/{username}/follow           -> deja de seguir o cancela la solicitud
 *   GET    /users/me/follow-requests          -> [ProfileSummary]
 *   POST   /users/me/follow-requests/{username}/accept | /reject
 */
export class SocialService {
  constructor(
    private readonly db: ProfileDb,
    private readonly authStorage: AuthStorage,
  ) {}

  // ---------- consultas ----------
  async getFollowers(username: string): Promise<JsonArray | null> {
    const perfil = await this.db.findByUsername(username);
    if (!perfil) return null;
    return this.resumir(this.ids(perfil.followers));
  }

  async getFollowing(username: string): Promise<JsonArray | null> {
    const perfil = await this.db.findByUsername(username);
    if (!perfil) return null;
    return this.resumir(this.ids(perfil.following));
  }

  async getRelationship(username: string): Promise<JsonObject | null> {
    const yo = await this.yo();
    const otro = await this.db.findByUsername(username);
    if (!yo || !otro) return null;
    return {
      following: this.ids(yo.following).includes(otro.userId as string),
      requested: this.ids(otro.followRequests).includes(yo.userId as string),
      followsYou: this.ids(yo.followers).includes(otro.userId as string),
    };
  }

  async getMyFollowRequests(): Promise<JsonArray | null> {
    const yo = await this.yo();
    if (!yo) return null;
    return this.resumir(this.ids(yo.followRequests));
  }

  // ---------- acciones ----------
  async follow(username: string): Promise<JsonObject | null> {
    const yo = await this.yo();
    const otro = await this.db.findByUsername(username);
    if (!yo || !otro || yo.userId === otro.userId) return null;

    const yaSigo = this.ids(yo.following).includes(otro.userId as string);
    if (yaSigo) return { status: "FOLLOWING" };

    // perfil privado: queda como solicitud hasta que la acepte
    if (otro.visibility === "PRIVATE") {
      const pedidas = this.ids(otro.followRequests);
      if (!pedidas.includes(yo.userId as string)) pedidas.push(yo.userId as string);
      await this.db.update(otro.userId as string, { followRequests: this.ref(pedidas) });
      return { status: "REQUESTED" };
    }

    await this.enlazar(yo, otro);
    return { status: "FOLLOWING" };
  }

  async unfollow(username: string): Promise<JsonObject | null> {
    const yo = await this.yo();
    const otro = await this.db.findByUsername(username);
    if (!yo || !otro) return null;

    // si era solo solicitud, la cancelo
    const pedidas = this.ids(otro.followRequests).filter((id) => id !== yo.userId);
    const seguidores = this.ids(otro.followers).filter((id) => id !== yo.userId);
    const sigo = this.ids(yo.following).filter((id) => id !== otro.userId);

    await this.db.update(otro.userId as string, {
      followRequests: this.ref(pedidas),
      followers: this.ref(seguidores),
      followersCount: seguidores.length,
    });
    await this.db.update(yo.userId as string, { following: this.ref(sigo), followingCount: sigo.length });
    return { success: true };
  }

  async acceptFollowRequest(username: string): Promise<JsonObject | null> {
    const yo = await this.yo();
    const otro = await this.db.findByUsername(username);
    if (!yo || !otro) return null;
    const pedidas = this.ids(yo.followRequests);
    if (!pedidas.includes(otro.userId as string)) return null;

    await this.db.update(yo.userId as string, {
      followRequests: this.ref(pedidas.filter((id) => id !== otro.userId)),
    });
    // ojo: leo de nuevo porque el update cambio el perfil
    const yoNuevo = await this.yo();
    await this.enlazar(otro, yoNuevo!);
    return { success: true };
  }

  async rejectFollowRequest(username: string): Promise<JsonObject | null> {
    const yo = await this.yo();
    const otro = await this.db.findByUsername(username);
    if (!yo || !otro) return null;
    const pedidas = this.ids(yo.followRequests);
    if (!pedidas.includes(otro.userId as string)) return null;

    await this.db.update(yo.userId as string, {
      followRequests: this.ref(pedidas.filter((id) => id !== otro.userId)),
    });
    return { success: true };
  }

  // ---------- helpers ----------
  private async yo(): Promise<JsonObject | null> {
    const userId = this.authStorage.getUserId();
    return userId ? this.db.findByUserId(userId) : null;
  }

  /** seguidor empieza a seguir a seguido, en los dos lados */
  private async enlazar(seguidor: JsonObject, seguido: JsonObject): Promise<void> {
    const sigue = this.ids(seguidor.following);
    if (!sigue.includes(seguido.userId as string)) sigue.push(seguido.userId as string);
    await this.db.update(seguidor.userId as string, { following: this.ref(sigue), followingCount: sigue.length });

    const fresco = await this.db.findByUserId(seguido.userId as string);
    const seguidores = this.ids(fresco?.followers);
    if (!seguidores.includes(seguidor.userId as string)) seguidores.push(seguidor.userId as string);
    await this.db.update(seguido.userId as string, { followers: this.ref(seguidores), followersCount: seguidores.length });
  }

  /** acepto tanto [{userId}] como [id]: los fixtures guardan objetos */
  private ids(lista: unknown): string[] {
    if (!Array.isArray(lista)) return [];
    return lista
      .map((x) => (typeof x === "string" ? x : (x as JsonObject)?.userId))
      .filter((x): x is string => typeof x === "string");
  }

  private ref(ids: string[]): JsonArray {
    return ids.map((userId) => ({ userId }));
  }

  private async resumir(ids: string[]): Promise<JsonArray> {
    const out: JsonArray = [];
    for (const id of ids) {
      const p = await this.db.findByUserId(id);
      if (!p) continue;
      out.push({
        userId: p.userId,
        username: p.username,
        displayName: p.displayName ?? null,
        avatarUrl: p.avatarUrl ?? null,
        visibility: p.visibility,
      });
    }
    return out;
  }
}
