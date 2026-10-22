import { Link, useParams } from "react-router";

import { container } from "../../../../core/di/container";
import type { GetUserDetail } from "../../domain/usecases/get.user.detail";
import { UserStatus } from "../components/atoms/user.status";
import { UserDetailCard } from "../components/organisms/user.detail.card";
import { useUserDetailViewModel } from "../viewmodels/user.detail.viewmodel";
import "./style/user.management.page.css";

// /admin/usuarios/:id
export function UserDetailPage() {
  const { id = "" } = useParams<{ id: string }>();

  // ----- dependencias -----
  const getUserDetail = container.resolve<GetUserDetail>("getUserDetail");

  // ----- viewModel -----
  const { state, reload } = useUserDetailViewModel(getUserDetail, id);

  return (
    <main className="um page">
      <Link to="/admin/usuarios" className="um back">
        <i className="bi bi-arrow-left" aria-hidden="true" /> Volver a usuarios
      </Link>

      {state.isLoading && <UserStatus icon="hourglass-split" title="Cargando usuario..." />}

      {!state.isLoading && state.notFound && (
        <UserStatus icon="person-x" title="No encontramos ese usuario" description="Puede que el enlace este mal." />
      )}

      {!state.isLoading && state.error && (
        <UserStatus icon="wifi-off" title="Algo salio mal" description={state.error}>
          <button type="button" className="btn btn-primary" onClick={reload}>
            Reintentar
          </button>
        </UserStatus>
      )}

      {state.user && <UserDetailCard user={state.user} />}
    </main>
  );
}
