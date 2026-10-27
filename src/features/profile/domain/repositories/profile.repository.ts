import type { ProfileVisibility } from "../../../../core/models/profile.visibility";
import type { Profile } from "../entities/profile";
import type { ProfileFavorite } from "../entities/profile.favorite";

// lo que se puede cambiar del perfil, segun el contrato del User Service
export type UpdateProfileData = {
  displayName?: string | null;
  bio?: string | null;
  country?: string | null;
  visibility?: ProfileVisibility;
  avatarUrl?: string | null;
};

export interface ProfileRepository {
  // mi perfil, tira ProfileUnauthenticatedException si no hay sesion
  getMine(): Promise<Profile>;

  // el de otro por username, tira ProfileNotFoundException si no existe
  getByUsername(username: string): Promise<Profile>;

  // devuelve el perfil ya actualizado
  update(data: UpdateProfileData): Promise<Profile>;

  // reemplaza la lista de favoritos (quitar, reordenar); agregar viene de otras features
  setFavorites(favorites: ProfileFavorite[]): Promise<Profile>;
}
