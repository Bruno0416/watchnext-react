import type { MediaType } from "../../../../core/models/media.type";
import type { Profile } from "../entities/profile";
import type { ProfileRepository } from "../repositories/profile.repository";

export class RemoveFavorite {
  constructor(private readonly repo: ProfileRepository) {}

  async call(tmdbId: number, mediaType: MediaType): Promise<Profile> {
    // saco el favorito de la lista actual y mando la lista completa, como pide el contrato
    const mine = await this.repo.getMine();
    const rest = mine.favorites.filter(
      (f) => !(f.tmdbId === tmdbId && f.mediaType === mediaType),
    );
    return this.repo.setFavorites(rest);
  }
}
