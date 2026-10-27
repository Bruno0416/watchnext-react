import type { Profile } from "../entities/profile";
import type { ProfileFavorite } from "../entities/profile.favorite";
import type { ProfileRepository } from "../repositories/profile.repository";

export class AddFavorite {
  constructor(private readonly repo: ProfileRepository) {}

  async call(favorite: ProfileFavorite): Promise<Profile> {
    // 1. consultar los favoritos actuales de la sesion
    const profile = await this.repo.getMine();
    const exists = profile.favorites.some(
      (item) => item.tmdbId === favorite.tmdbId && item.mediaType === favorite.mediaType,
    );

    // 2. conservar el orden y evitar contenido repetido
    if (exists) return profile;
    return this.repo.setFavorites([...profile.favorites, favorite]);
  }
}
