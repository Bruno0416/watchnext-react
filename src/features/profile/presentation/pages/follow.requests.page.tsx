import { Link } from "react-router";

import { container } from "../../../../core/di/container";
import type { AnswerFollowRequest } from "../../domain/usecases/answer.follow.request";
import type { GetFollowRequests } from "../../domain/usecases/get.follow.requests";
import { ProfileStatus } from "../components/atoms/profile.status";
import { PeopleList } from "../components/organisms/people.list";
import { useFollowRequestsViewModel } from "../viewmodels/follow.requests.viewmodel";
import "./style/profile.page.css";
import "./style/follow.page.css";

// /perfil/solicitudes: quienes quieren seguir mi perfil privado
export function FollowRequestsPage() {
  // ----- dependencias -----
  const getFollowRequests = container.resolve<GetFollowRequests>("getFollowRequests");
  const answerFollowRequest = container.resolve<AnswerFollowRequest>("answerFollowRequest");

  // ----- viewModel -----
  const { state, reload, answer } = useFollowRequestsViewModel(getFollowRequests, answerFollowRequest);

  return (
    <section className="profile page">
      <Link to="/perfil" className="profile back">
        <i className="bi bi-arrow-left" aria-hidden="true" /> Volver a mi perfil
      </Link>

      <h1 className="profile section-title">Solicitudes de seguimiento</h1>

      {state.isLoading && <ProfileStatus icon="hourglass-split" title="Cargando solicitudes..." />}

      {!state.isLoading && state.error && (
        <ProfileStatus icon="wifi-off" title="Algo salio mal" description={state.error}>
          <button type="button" className="btn btn-primary" onClick={reload}>
            Reintentar
          </button>
        </ProfileStatus>
      )}

      {state.actionError && <p className="profile form-error">{state.actionError}</p>}

      {!state.isLoading && !state.error && (
        <PeopleList
          people={state.requests}
          emptyTitle="No tienes solicitudes pendientes"
          emptyDescription="Si tu perfil es privado, aca te van a llegar."
          actions={(p) => (
            <>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                disabled={state.busyUsername === p.username}
                onClick={() => void answer(p.username, true)}
                aria-label={`Aceptar a ${p.shownName}`}
              >
                Aceptar
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                disabled={state.busyUsername === p.username}
                onClick={() => void answer(p.username, false)}
                aria-label={`Rechazar a ${p.shownName}`}
              >
                Rechazar
              </button>
            </>
          )}
        />
      )}
    </section>
  );
}
