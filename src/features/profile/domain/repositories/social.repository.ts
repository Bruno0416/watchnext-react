import type { ProfileSummary } from "../entities/profile.summary";
import type { Relationship, RelationshipStatus } from "../entities/relationship";

// endpoints de followers, following y follow requests del User Service
export interface SocialRepository {
  getFollowers(username: string): Promise<ProfileSummary[]>;
  getFollowing(username: string): Promise<ProfileSummary[]>;
  getRelationship(username: string): Promise<Relationship>;

  // devuelve como quedo: FOLLOWING si es publico, REQUESTED si es privado
  follow(username: string): Promise<RelationshipStatus>;
  // deja de seguir o cancela la solicitud
  unfollow(username: string): Promise<void>;

  getMyFollowRequests(): Promise<ProfileSummary[]>;
  acceptFollowRequest(username: string): Promise<void>;
  rejectFollowRequest(username: string): Promise<void>;
}
