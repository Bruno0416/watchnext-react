import type { JsonObject } from "../../../../core/mock/json.types";
import type { SocialService } from "../../../../core/mock/user/social.service";
import { ProfileError } from "../errors/profile.errors";
import { ProfileSummaryModel } from "../models/profile.summary.model";

// fuente de relaciones; hoy el mock SocialService, despues los endpoints reales
export interface SocialSource {
  getFollowers(username: string): Promise<ProfileSummaryModel[]>;
  getFollowing(username: string): Promise<ProfileSummaryModel[]>;
  getRelationship(username: string): Promise<JsonObject>;
  follow(username: string): Promise<string>;
  unfollow(username: string): Promise<void>;
  getMyFollowRequests(): Promise<ProfileSummaryModel[]>;
  acceptFollowRequest(username: string): Promise<void>;
  rejectFollowRequest(username: string): Promise<void>;
}

export class SocialSourceImpl implements SocialSource {
  constructor(private readonly service: SocialService) {}

  async getFollowers(username: string): Promise<ProfileSummaryModel[]> {
    const json = await this.service.getFollowers(username);
    if (!json) throw new ProfileError(404);
    return json.map((j) => ProfileSummaryModel.fromJson(j));
  }

  async getFollowing(username: string): Promise<ProfileSummaryModel[]> {
    const json = await this.service.getFollowing(username);
    if (!json) throw new ProfileError(404);
    return json.map((j) => ProfileSummaryModel.fromJson(j));
  }

  async getRelationship(username: string): Promise<JsonObject> {
    const json = await this.service.getRelationship(username);
    // sin sesion o perfil inexistente
    if (!json) throw new ProfileError(401);
    return json;
  }

  async follow(username: string): Promise<string> {
    const json = await this.service.follow(username);
    if (!json) throw new ProfileError(400);
    return String(json.status ?? "FOLLOWING");
  }

  async unfollow(username: string): Promise<void> {
    const json = await this.service.unfollow(username);
    if (!json) throw new ProfileError(400);
  }

  async getMyFollowRequests(): Promise<ProfileSummaryModel[]> {
    const json = await this.service.getMyFollowRequests();
    if (!json) throw new ProfileError(401);
    return json.map((j) => ProfileSummaryModel.fromJson(j));
  }

  async acceptFollowRequest(username: string): Promise<void> {
    const json = await this.service.acceptFollowRequest(username);
    if (!json) throw new ProfileError(404);
  }

  async rejectFollowRequest(username: string): Promise<void> {
    const json = await this.service.rejectFollowRequest(username);
    if (!json) throw new ProfileError(404);
  }
}
