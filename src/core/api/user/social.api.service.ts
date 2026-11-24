import type { JsonArray, JsonObject } from "../../mock/json.types";
import type { HttpClient } from "../http.client";
import type { UserApiService } from "./user.api.service";

// ---------- seguidores con user-service real (mismos metodos que el mock) ----------
export class SocialApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly users: UserApiService,
  ) {}

  // ---------- consultas ----------
  async getFollowers(username: string): Promise<JsonArray | null> {
    // 1. el backend solo entrega los seguidores propios
    return (await this.isMe(username)) ? this.users.getMyFollowers() : [];
  }

  async getFollowing(username: string): Promise<JsonArray | null> {
    return (await this.isMe(username)) ? this.users.getMyFollowing() : [];
  }

  async getRelationship(username: string): Promise<JsonObject | null> {
    // 1. armo la relacion con mis listas de seguidos y seguidores
    const [following, followers] = await Promise.all([this.users.getMyFollowing(), this.users.getMyFollowers()]);

    if (!following || !followers) {
      return null;
    }

    return {
      following: following.some((item) => item.username === username),
      requested: false,
      followsYou: followers.some((item) => item.username === username),
    };
  }

  async getMyFollowRequests(): Promise<JsonArray | null> {
    const res = await this.http.get<JsonObject>("/users/me/follow-requests", { query: { size: 100 } });

    return res.ok && res.data ? ((res.data.content as JsonArray) ?? []) : null;
  }

  // ---------- acciones ----------
  async follow(username: string): Promise<JsonObject | null> {
    // 1. seguir
    const done = await this.users.follow(username);

    if (!done) {
      return null;
    }

    // 2. si el perfil es privado queda como solicitud
    const relation = await this.getRelationship(username);

    return { status: relation?.following ? "FOLLOWING" : "REQUESTED" };
  }

  unfollow(username: string): Promise<JsonObject | null> {
    return this.users.unfollow(username);
  }

  async acceptFollowRequest(username: string): Promise<JsonObject | null> {
    const res = await this.http.post(`/users/me/follow-requests/${encodeURIComponent(username)}`);

    return res.ok ? { success: true } : null;
  }

  async rejectFollowRequest(username: string): Promise<JsonObject | null> {
    const res = await this.http.delete(`/users/me/follow-requests/${encodeURIComponent(username)}`);

    return res.ok ? { success: true } : null;
  }

  // ---------- helpers ----------
  private async isMe(username: string): Promise<boolean> {
    const me = await this.users.getMyProfile();

    return me?.username === username;
  }
}
