import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { container } from "../../../../core/di/container";
import type { GetUserDetail } from "../../domain/usecases/get.user.detail";
import type { UpdateUserIdentity } from "../../domain/usecases/update.user.identity";
import type { DeleteUser } from "../../domain/usecases/delete.user";
import type { AuthStorage } from "../../../../core/mock/auth/auth.storage";
import { UserStatus } from "../components/atoms/user.status";
import { UserDetailCard } from "../components/organisms/user.detail.card";
import { useUserDetailViewModel } from "../viewmodels/user.detail.viewmodel";
import "./style/user.management.page.css";

// /admin/usuarios/:id
export function UserDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const authStorage = container.resolve<AuthStorage>("authStorage");
  const getUserDetail = container.resolve<GetUserDetail>("getUserDetail");
  const updateIdentity = container.resolve<UpdateUserIdentity>("updateUserIdentity");
  const deleteUser = container.resolve<DeleteUser>("deleteUser");
  const { state, reload } = useUserDetailViewModel(getUserDetail, id);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (confirming) cancelButton.current?.focus();
  }, [confirming]);

  async function confirmDelete() {
    if (deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteUser.call(id);
      navigate("/admin/usuarios", { replace: true });
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "No se pudo eliminar el usuario.");
      setDeleting(false);
    }
  }

  async function save(input: { username: string; displayName: string }) {
    setNotice(null);
    await updateIdentity.call(id, input);
    setNotice("Identidad actualizada correctamente.");
    reload();
  }

  return (
    <div className="um page">
      <Link to="/admin/usuarios" className="um back">
        <i className="bi bi-arrow-left" aria-hidden="true" /> Volver a usuarios
      </Link>
      {notice && <p className="um notice" role="status">{notice}</p>}
      {state.isLoading && <UserStatus icon="hourglass-split" title="Cargando usuario..." />}
      {!state.isLoading && state.notFound && <UserStatus icon="person-x" title="No encontramos ese usuario" description="Puede que el enlace este mal." />}
      {!state.isLoading && state.error && (
        <UserStatus icon="wifi-off" title="Algo salio mal" description={state.error}>
          <button type="button" className="btn btn-primary" onClick={reload}>Reintentar</button>
        </UserStatus>
      )}
      {state.user && (
        <>
          <UserDetailCard key={`${state.user.userId}:${state.user.username}:${state.user.props.displayName}`} user={state.user} onSave={save} />
          {state.user.userId !== authStorage.getUserId() && (
            <button type="button" className="btn btn-outline-danger um-delete-trigger" onClick={() => { setConfirming(true); setDeleteError(null); }}>
              <i className="bi bi-trash" aria-hidden="true" /> Eliminar usuario
            </button>
          )}
        </>
      )}
      {confirming && state.user && (
        <div className="um-modal-overlay">
          <div className="um-modal" role="alertdialog" aria-modal="true" aria-labelledby="um-delete-title" aria-describedby="um-delete-description" onKeyDown={(event) => {
            if (event.key === "Escape" && !deleting) setConfirming(false);
            if (event.key === "Tab") {
              const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"));
              const first = buttons[0];
              const last = buttons[buttons.length - 1];
              if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
              else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
            }
          }}>
            <h2 id="um-delete-title">¿Eliminar usuario?</h2>
            <p id="um-delete-description">
              Se eliminará la cuenta <strong>{state.user.email}</strong> y sus datos asociados:
              perfil, listas, relaciones sociales, reseñas y valoraciones.
              Esta acción no se puede deshacer durante la sesión.
            </p>
            {deleteError && <p className="um form-error" role="alert">{deleteError}</p>}
            <div className="um-modal-actions">
              <button ref={cancelButton} type="button" className="btn btn-outline-primary" disabled={deleting} onClick={() => setConfirming(false)}>Cancelar</button>
              <button type="button" className="btn btn-danger" disabled={deleting} onClick={confirmDelete}>
                {deleting ? "Eliminando..." : "Eliminar definitivamente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
