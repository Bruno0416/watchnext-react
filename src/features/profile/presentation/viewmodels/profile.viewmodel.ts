import { useEffect, useState } from "react";

import type { ProfileVisibility } from "../../../../core/models/profile.visibility";
import {
  ProfileException,
  ProfileNotFoundException,
  ProfileUnauthenticatedException,
} from "../../data/errors/profile.exceptions";
import type { Profile } from "../../domain/entities/profile";
import type { ProfileFavorite } from "../../domain/entities/profile.favorite";
import type { GetMyProfile } from "../../domain/usecases/get.my.profile";
import type { GetProfile } from "../../domain/usecases/get.profile";
import type { RemoveFavorite } from "../../domain/usecases/remove.favorite";
import type { UpdateProfile } from "../../domain/usecases/update.profile";
import {
  type EditProfileState,
  initialEditProfileState,
  initialProfileState,
  type ProfileState,
} from "../models/profile.state";
import {
  validateBio,
  validateCountry,
  validateDisplayName,
  validateEditProfile,
} from "../validators/profile.validator";

// guardo para que username cargue, asi se si lo que tengo es de esta url
type Loaded = ProfileState & { loadedFor: string | null };

function messageOf(e: unknown): string {
  return e instanceof ProfileException ? e.message : "Ocurrio un error inesperado";
}

/**
 * username undefined = mi perfil (/perfil); con username = el de otro (/perfil/:username).
 * si el username de la url es el mio, igual lo trato como propio para poder editar.
 */
export function useProfileViewModel(
  getMyProfile: GetMyProfile,
  getProfile: GetProfile,
  updateProfile: UpdateProfile,
  removeFavorite: RemoveFavorite,
  username: string | undefined,
): {
  state: ProfileState;
  form: EditProfileState;
  openEdit: () => void;
  closeEdit: () => void;
  setDisplayName: (v: string) => void;
  setBio: (v: string) => void;
  setCountry: (v: string) => void;
  setVisibility: (v: ProfileVisibility) => void;
  validateDisplayNameField: () => void;
  validateBioField: () => void;
  validateCountryField: () => void;
  submit: () => Promise<boolean>;
  removeFav: (fav: ProfileFavorite) => Promise<void>;
  reload: () => void;
  refresh: () => void;
} {
  const clave = username ?? "@me";
  const [loaded, setLoaded] = useState<Loaded>({ ...initialProfileState, loadedFor: null });
  const [form, setForm] = useState<EditProfileState>(initialEditProfileState);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    // cargo el mio siempre (para saber si el de la url soy yo) y el pedido si hay username
    const mine = getMyProfile.call().then(
      (p) => p,
      () => null,
    );
    const pedido = username ? getProfile.call(username) : mine.then((p) => p);

    Promise.all([mine, pedido])
      .then(([mio, perfil]) => {
        if (cancelled) return;
        if (!perfil) throw new ProfileUnauthenticatedException();
        const isMine = !!mio && mio.username === perfil.username;
        setLoaded({ ...initialProfileState, profile: perfil, isMine, isLoading: false, loadedFor: clave });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        if (e instanceof ProfileNotFoundException) {
          setLoaded({ ...initialProfileState, isLoading: false, notFound: true, loadedFor: clave });
          return;
        }
        if (e instanceof ProfileUnauthenticatedException) {
          setLoaded({ ...initialProfileState, isLoading: false, unauthenticated: true, loadedFor: clave });
          return;
        }
        setLoaded({ ...initialProfileState, isLoading: false, error: messageOf(e), loadedFor: clave });
      });

    return () => {
      cancelled = true;
    };
  }, [getMyProfile, getProfile, username, clave, attempt]);

  function reload(): void {
    setLoaded({ ...initialProfileState, loadedFor: null });
    setAttempt((c) => c + 1);
  }

  // recargo sin pasar por "cargando", ej: despues de seguir para que cambien los contadores
  function refresh(): void {
    setAttempt((c) => c + 1);
  }

  // ---------- edicion ----------
  function openEdit(): void {
    const p = loaded.profile;
    if (!p) return;
    // parto el formulario con lo que tiene el perfil ahora
    setForm({
      ...initialEditProfileState,
      isOpen: true,
      displayName: p.displayName ?? "",
      bio: p.bio ?? "",
      country: p.country ?? "CL",
      visibility: p.visibility,
    });
  }

  function closeEdit(): void {
    setForm(initialEditProfileState);
  }

  function setDisplayName(v: string): void {
    setForm((c) => ({ ...c, displayName: v, displayNameError: null, formError: null }));
  }

  function setBio(v: string): void {
    setForm((c) => ({ ...c, bio: v, bioError: null, formError: null }));
  }

  function setCountry(v: string): void {
    setForm((c) => ({ ...c, country: v, countryError: null, formError: null }));
  }

  function setVisibility(v: ProfileVisibility): void {
    setForm((c) => ({ ...c, visibility: v, formError: null }));
  }

  function validateDisplayNameField(): void {
    setForm((c) => ({ ...c, displayNameError: validateDisplayName(c.displayName) }));
  }

  function validateBioField(): void {
    setForm((c) => ({ ...c, bioError: validateBio(c.bio) }));
  }

  function validateCountryField(): void {
    setForm((c) => ({ ...c, countryError: validateCountry(c.country) }));
  }

  async function submit(): Promise<boolean> {
    const errors = validateEditProfile(form.displayName, form.bio, form.country);
    if (errors.displayNameError || errors.bioError || errors.countryError) {
      setForm((c) => ({ ...c, ...errors }));
      return false;
    }

    setForm((c) => ({ ...c, isSubmitting: true }));

    try {
      const actualizado = await updateProfile.call({
        displayName: form.displayName,
        bio: form.bio,
        country: form.country,
        visibility: form.visibility,
      });
      aplicar(actualizado);
      setForm(initialEditProfileState);
      return true;
    } catch (e) {
      setForm((c) => ({ ...c, isSubmitting: false, formError: messageOf(e) }));
      return false;
    }
  }

  // ---------- favoritos ----------
  async function removeFav(fav: ProfileFavorite): Promise<void> {
    setLoaded((c) => ({ ...c, busyKey: fav.key, actionError: null }));
    try {
      const actualizado = await removeFavorite.call(fav.tmdbId, fav.mediaType);
      setLoaded((c) => ({ ...c, profile: actualizado, busyKey: null }));
    } catch (e) {
      setLoaded((c) => ({ ...c, busyKey: null, actionError: messageOf(e) }));
    }
  }

  function aplicar(p: Profile): void {
    setLoaded((c) => ({ ...c, profile: p, actionError: null }));
  }

  // lo cargado no es de esta url: sigo en cargando
  const { loadedFor, ...rest } = loaded;
  const state: ProfileState = loadedFor === clave ? rest : initialProfileState;

  return {
    state,
    form,
    openEdit,
    closeEdit,
    setDisplayName,
    setBio,
    setCountry,
    setVisibility,
    validateDisplayNameField,
    validateBioField,
    validateCountryField,
    submit,
    removeFav,
    reload,
    refresh,
  };
}
