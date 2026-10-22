import type { ProfileSummary } from "../../domain/entities/profile.summary";
import { type Relationship, RelationshipStatus } from "../../domain/entities/relationship";
import type { SocialRepository } from "../../domain/repositories/social.repository";
import { ProfileError } from "../errors/profile.errors";
import {
  ProfileException,
  ProfileNotFoundException,
  ProfileUnauthenticatedException,
  ProfileUnavailableException,
} from "../errors/profile.exceptions";
import type { SocialSource } from "../source/social.source";

export class SocialRepositoryImpl implements SocialRepository {
  constructor(private readonly source: SocialSource) {}

  async getFollowers(username: string): Promise<ProfileSummary[]> {
    return this.intentar(async () => (await this.source.getFollowers(username)).map((m) => m.toDomain()));
  }

  async getFollowing(username: string): Promise<ProfileSummary[]> {
    return this.intentar(async () => (await this.source.getFollowing(username)).map((m) => m.toDomain()));
  }

  async getRelationship(username: string): Promise<Relationship> {
    return this.intentar(async () => {
      const json = await this.source.getRelationship(username);
      // paso los tres booleanos del backend a un solo estado
      const status = json.following
        ? RelationshipStatus.FOLLOWING
        : json.requested
          ? RelationshipStatus.REQUESTED
          : RelationshipStatus.NONE;
      return { status, followsYou: Boolean(json.followsYou) };
    });
  }

  async follow(username: string): Promise<RelationshipStatus> {
    return this.intentar(async () => {
      const s = await this.source.follow(username);
      return s === "REQUESTED" ? RelationshipStatus.REQUESTED : RelationshipStatus.FOLLOWING;
    });
  }

  async unfollow(username: string): Promise<void> {
    return this.intentar(() => this.source.unfollow(username));
  }

  async getMyFollowRequests(): Promise<ProfileSummary[]> {
    return this.intentar(async () => (await this.source.getMyFollowRequests()).map((m) => m.toDomain()));
  }

  async acceptFollowRequest(username: string): Promise<void> {
    return this.intentar(() => this.source.acceptFollowRequest(username));
  }

  async rejectFollowRequest(username: string): Promise<void> {
    return this.intentar(() => this.source.rejectFollowRequest(username));
  }

  // ---- helper ----
  private async intentar<T>(f: () => Promise<T>): Promise<T> {
    try {
      return await f();
    } catch (e) {
      if (e instanceof ProfileError) {
        if (e.status === 401) throw new ProfileUnauthenticatedException();
        if (e.status === 404) throw new ProfileNotFoundException();
        if (e.status === 400) throw new ProfileException("No se pudo completar la accion");
      }
      console.error(e);
      throw new ProfileUnavailableException();
    }
  }
}
