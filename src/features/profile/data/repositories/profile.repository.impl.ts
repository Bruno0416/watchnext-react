import type { JsonObject } from "../../../../core/mock/json.types";
import type { Profile } from "../../domain/entities/profile";
import type { ProfileFavorite } from "../../domain/entities/profile.favorite";
import type {
  ProfileRepository,
  UpdateProfileData,
} from "../../domain/repositories/profile.repository";
import { ProfileError } from "../errors/profile.errors";
import {
  ProfileNotFoundException,
  ProfileUnauthenticatedException,
  ProfileUnavailableException,
} from "../errors/profile.exceptions";
import { ProfileFavoriteModel } from "../models/profile.favorite.model";
import type { ProfileLocalSource } from "../source/profile.local.source";

export class ProfileRepositoryImpl implements ProfileRepository {
  constructor(private readonly source: ProfileLocalSource) {}

  async getMine(): Promise<Profile> {
    try {
      return (await this.source.getMine()).toDomain();
    } catch (e) {
      throw this.mapError(e);
    }
  }

  async getByUsername(username: string): Promise<Profile> {
    try {
      return (await this.source.getByUsername(username)).toDomain();
    } catch (e) {
      throw this.mapError(e);
    }
  }

  async update(data: UpdateProfileData): Promise<Profile> {
    try {
      // solo mando los campos que vienen, el servicio hace merge
      const request: JsonObject = {};
      if (data.displayName !== undefined) request.displayName = data.displayName;
      if (data.bio !== undefined) request.bio = data.bio;
      if (data.country !== undefined) request.country = data.country;
      if (data.visibility !== undefined) request.visibility = data.visibility;
      if (data.avatarUrl !== undefined) request.avatarUrl = data.avatarUrl;

      return (await this.source.update(request)).toDomain();
    } catch (e) {
      throw this.mapError(e);
    }
  }

  async setFavorites(favorites: ProfileFavorite[]): Promise<Profile> {
    try {
      const request: JsonObject = {
        favorites: favorites.map((f, i) => ProfileFavoriteModel.fromDomain(f).toJson(i)),
      };

      return (await this.source.update(request)).toDomain();
    } catch (e) {
      throw this.mapError(e);
    }
  }

  // ---- helper ----
  // paso el error pelado a una excepcion que la vista entienda
  private mapError(e: unknown): Error {
    if (e instanceof ProfileError) {
      switch (e.status) {
        case 401:
          return new ProfileUnauthenticatedException();
        case 404:
          return new ProfileNotFoundException();
      }
    }

    console.error(e);
    return new ProfileUnavailableException();
  }
}
