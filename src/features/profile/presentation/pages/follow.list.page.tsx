import { Link, useParams } from "react-router";

import { container } from "../../../../core/di/container";
import type { GetFollowers } from "../../domain/usecases/get.followers";
import type { GetFollowing } from "../../domain/usecases/get.following";
import type { GetMyProfile } from "../../domain/usecases/get.my.profile";
import type { GetProfile } from "../../domain/usecases/get.profile";
import type { GetRelationship } from "../../domain/usecases/get.relationship";
import { ProfileStatus } from "../components/atoms/profile.status";
import { PeopleList } from "../components/organisms/people.list";
import type { FollowMode } from "../models/follow.state";
import { useFollowListViewModel } from "../viewmodels/follow.list.viewmodel";
import "./style/profile.page.css";
import "./style/follow.page.css";

type FollowListPageProps = {
  mode: FollowMode;
};

// /perfil/:username/seguidores y /perfil/:username/seguidos
export function FollowListPage({ mode }: FollowListPageProps) {
  const { username = "" } = useParams<{ username: string }>();

  // ----- dependencias -----
  const getProfile = container.resolve<GetProfile>("getProfile");
  const getMyProfile = container.resolve<GetMyProfile>("getMyProfile");
  const getRelationship = container.resolve<GetRelationship>("getRelationship");
  const getFollowers = container.resolve<GetFollowers>("getFollowers");
  const getFollowing = container.resolve<GetFollowing>("getFollowing");

  // ----- viewModel -----
  const { state, reload } = useFollowListViewModel(
    getProfile,
    getMyProfile,
    getRelationship,
    getFollowers,
    getFollowing,
    username,
    mode,
  );

  const titulo = mode === "followers" ? "Seguidores" : "Seguidos";

  return (
    <section className="profile page">
      <Link to={`/perfil/${username}`} className="profile back">
        <i className="bi bi-arrow-left" aria-hidden="true" /> Volver al perfil
      </Link>

      <nav className="profile tabs" aria-label="Relaciones">
        <Link to={`/perfil/${username}/seguidores`} className={`profile tab ${mode === "followers" ? "active" : ""}`.trim()} aria-current={mode === "followers" ? "page" : undefined}>
          Seguidores
        </Link>
        <Link to={`/perfil/${username}/seguidos`} className={`profile tab ${mode === "following" ? "active" : ""}`.trim()} aria-current={mode === "following" ? "page" : undefined}>
          Seguidos
        </Link>
      </nav>

      {state.isLoading && <ProfileStatus icon="hourglass-split" title="Cargando..." />}

      {!state.isLoading && state.notFound && (
        <ProfileStatus icon="person-x" title="Ese perfil no existe" description="Revisa el nombre de usuario en el enlace." />
      )}

      {!state.isLoading && state.error && (
        <ProfileStatus icon="wifi-off" title="Algo salio mal" description={state.error}>
          <button type="button" className="btn btn-primary" onClick={reload}>
            Reintentar
          </button>
        </ProfileStatus>
      )}

      {!state.isLoading && state.owner && (
        <>
          <h1 className="profile section-title">
            {titulo} de {state.owner}
          </h1>
          {state.hidden ? (
            <ProfileStatus
              icon="lock-fill"
              title="Este perfil es privado"
              description="Siguelo para ver a quien sigue y quien lo sigue."
            />
          ) : (
            <PeopleList
              people={state.people}
              emptyTitle={mode === "followers" ? "Todavia no tiene seguidores" : "Todavia no sigue a nadie"}
            />
          )}
        </>
      )}
    </section>
  );
}
