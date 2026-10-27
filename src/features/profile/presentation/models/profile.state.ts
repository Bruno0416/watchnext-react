import { ProfileVisibility } from "../../../../core/models/profile.visibility";
import type { Profile } from "../../domain/entities/profile";

// estado de la pagina de perfil (propio o de otro)
export type ProfileState = {
  profile: Profile | null;
  isMine: boolean;
  isLoading: boolean;
  notFound: boolean;
  unauthenticated: boolean;
  error: string | null;

  // key del favorito que se esta quitando
  busyKey: string | null;
  actionError: string | null;
};

export const initialProfileState: ProfileState = {
  profile: null,
  isMine: false,
  isLoading: true,
  notFound: false,
  unauthenticated: false,
  error: null,
  busyKey: null,
  actionError: null,
};

// estado del formulario de edicion
export type EditProfileState = {
  isOpen: boolean;
  displayName: string;
  bio: string;
  country: string;
  visibility: ProfileVisibility;
  isSubmitting: boolean;

  displayNameError: string | null;
  bioError: string | null;
  countryError: string | null;
  formError: string | null;
};

export const initialEditProfileState: EditProfileState = {
  isOpen: false,
  displayName: "",
  bio: "",
  country: "CL",
  visibility: ProfileVisibility.PUBLIC,
  isSubmitting: false,
  displayNameError: null,
  bioError: null,
  countryError: null,
  formError: null,
};
