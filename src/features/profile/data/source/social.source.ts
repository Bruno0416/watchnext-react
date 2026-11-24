import type { JsonObject } from "../../../../core/http/json.types";
import type { ProfileSummaryModel } from "../models/profile.summary.model";

// fuente de relaciones, la implementa SocialRemoteSourceImpl con el user-service
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
