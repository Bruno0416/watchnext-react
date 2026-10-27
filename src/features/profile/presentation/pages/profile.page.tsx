import { Link, useParams } from "react-router";

import { container } from "../../../../core/di/container";
import { useGuestAccess } from "../../../../core/router/protected.route";
import { AuthRequiredPrompt } from "../../../../core/ui/components/molecules/auth.required.prompt";
import { RelationshipStatus } from "../../domain/entities/relationship";
import type { GetMyProfile } from "../../domain/usecases/get.my.profile";
import type { GetProfile } from "../../domain/usecases/get.profile";
import type { RemoveFavorite } from "../../domain/usecases/remove.favorite";
import type { UpdateProfile } from "../../domain/usecases/update.profile";
import type { FollowUser } from "../../domain/usecases/follow.user";
import type { GetRelationship } from "../../domain/usecases/get.relationship";
import type { UnfollowUser } from "../../domain/usecases/unfollow.user";
import { FollowButton } from "../components/molecules/follow.button";
import { useRelationshipViewModel } from "../viewmodels/relationship.viewmodel";
import { ProfileStatus } from "../components/atoms/profile.status";
import { ProfileHeader } from "../components/molecules/profile.header";
import { EditProfileForm } from "../components/organisms/edit.profile.form";
import { FavoritesGrid } from "../components/organisms/favorites.grid";
import { useProfileViewModel } from "../viewmodels/profile.viewmodel";
import "./style/profile.page.css";
import "./style/follow.page.css";

/** /perfil es el mio, /perfil/:username el de otro (o el mio si pongo mi username) */
export function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const isGuest = useGuestAccess();

  if (isGuest && !username) {
    return (
      <section id="profile-view" className="profile-view guest-feature-view">
        <div className="container-fluid app-container">
          <AuthRequiredPrompt
            id="profile-guest"
            icon="bi-person-circle"
            title="Tu perfil te espera"
            description="Inicia sesión para ver y personalizar tu perfil de WatchNext."
          />
        </div>
      </section>
    );
  }

  return <ProfileContent username={username} />;
}

function ProfileContent({ username }: { username: string | undefined }) {
  // ----- dependencias -----
  const getMyProfile = container.resolve<GetMyProfile>("getMyProfile");
  const getProfile = container.resolve<GetProfile>("getProfile");
  const updateProfile = container.resolve<UpdateProfile>("updateProfile");
  const removeFavorite = container.resolve<RemoveFavorite>("removeFavorite");
  const getRelationship = container.resolve<GetRelationship>("getRelationship");
  const followUser = container.resolve<FollowUser>("followUser");
  const unfollowUser = container.resolve<UnfollowUser>("unfollowUser");

  // ----- viewModel -----
  const vm = useProfileViewModel(getMyProfile, getProfile, updateProfile, removeFavorite, username);
  const { state, form } = vm;
  const profile = state.profile;

  // seguir: solo si es de otro
  const otro = profile && !state.isMine ? profile.username : null;
  const rel = useRelationshipViewModel(getRelationship, followUser, unfollowUser, otro, vm.refresh);

  // un perfil privado ajeno se ve recortado: solo quien es y que es privado
  // si ya lo sigo, lo veo completo aunque sea privado
  const loSigo = rel.state.relationship.status === RelationshipStatus.FOLLOWING;
  const recortado = !!profile && profile.isPrivate && !state.isMine && !loSigo;

  return (
    <section id="profile-content" className="profile page">
      {state.isLoading && <ProfileStatus icon="hourglass-split" title="Cargando perfil..." />}

      {!state.isLoading && state.notFound && (
        <ProfileStatus
          icon="person-x"
          title="Ese perfil no existe"
          description="Revisa el nombre de usuario en el enlace."
        >
          <Link className="btn btn-primary" to="/inicio">
            Volver al inicio
          </Link>
        </ProfileStatus>
      )}

      {!state.isLoading && state.unauthenticated && (
        <ProfileStatus
          icon="person-lock"
          title="Inicia sesion para ver tu perfil"
          description="Tu perfil se arma con los datos del onboarding."
        >
          <Link className="btn btn-primary" to="/auth/iniciar-sesion">
            Iniciar sesion
          </Link>
        </ProfileStatus>
      )}

      {!state.isLoading && state.error && (
        <ProfileStatus icon="wifi-off" title="Algo salio mal" description={state.error}>
          <button type="button" className="btn btn-primary" onClick={vm.reload}>
            Reintentar
          </button>
        </ProfileStatus>
      )}

      {profile && (
        <>
          <ProfileHeader
            profile={profile}
            isMine={state.isMine}
            onEdit={vm.openEdit}
            followSlot={<FollowButton state={rel.state} onToggle={() => void rel.toggle()} />}
          />

          {form.isOpen && (
            <EditProfileForm
              form={form}
              username={profile.username}
              setDisplayName={vm.setDisplayName}
              setBio={vm.setBio}
              setCountry={vm.setCountry}
              setVisibility={vm.setVisibility}
              validateDisplayNameField={vm.validateDisplayNameField}
              validateBioField={vm.validateBioField}
              validateCountryField={vm.validateCountryField}
              submit={vm.submit}
              cancel={vm.closeEdit}
            />
          )}

          {state.actionError && <p className="profile form-error">{state.actionError}</p>}

          {recortado ? (
            <ProfileStatus
              icon="lock-fill"
              title="Este perfil es privado"
              description="Solo quienes lo siguen pueden ver sus favoritos y sus listas."
            />
          ) : (
            <FavoritesGrid
              favorites={profile.favorites}
              isMine={state.isMine}
              busyKey={state.busyKey}
              onRemove={(f) => void vm.removeFav(f)}
            />
          )}
        </>
      )}
    </section>
  );
}
