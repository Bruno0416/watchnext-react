import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { container } from "../../../../core/di/container";
import type { AddListItem } from "../../domain/usecases/add.list.item";
import type { DeleteList } from "../../domain/usecases/delete.list";
import type { GetList } from "../../domain/usecases/get.list";
import type { RemoveListItem } from "../../domain/usecases/remove.list.item";
import type { SearchListContent } from "../../domain/usecases/search.list.content";
import { ListStatus } from "../components/atoms/list.status";
import { VisibilityBadge } from "../components/atoms/visibility.badge";
import { AddContentPanel } from "../components/organisms/add.content.panel";
import { ListItems } from "../components/organisms/list.items";
import { useAddContentViewModel } from "../viewmodels/add.content.viewmodel";
import { useListDetailViewModel } from "../viewmodels/list.detail.viewmodel";
import "./style/lists.page.css";

export function ListDetailPage() {
  const navigate = useNavigate();

  // el id viene de la url /listas/:id
  const { id } = useParams<{ id: string }>();

  // ----- dependencias -----
  const getList = container.resolve<GetList>("getList");
  const deleteList = container.resolve<DeleteList>("deleteList");
  const removeListItem = container.resolve<RemoveListItem>("removeListItem");
  const addListItem = container.resolve<AddListItem>("addListItem");
  const searchListContent = container.resolve<SearchListContent>("searchListContent");

  // ----- viewModels -----
  const { state, removeItem, remove, applyList } = useListDetailViewModel(
    getList,
    deleteList,
    removeListItem,
    id,
  );

  const addContent = useAddContentViewModel(
    searchListContent,
    addListItem,
    id ?? "",
    applyList,
  );

  // ----- estado propio de la pagina (que panel esta abierto) -----
  const [isAdding, setIsAdding] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  function closeAddPanel(): void {
    setIsAdding(false);
    addContent.clear();
  }

  async function handleDelete(): Promise<void> {
    const deleted = await remove();

    // si se borro me voy a mis listas
    if (deleted) {
      navigate("/listas", { replace: true });
    }
  }

  const list = state.list;

  return (
    <main className="lists page">
      <Link className="lists back" to="/listas">
        <i className="bi bi-arrow-left" aria-hidden="true" />
        Mis listas
      </Link>

      {state.isLoading && (
        <ListStatus icon="hourglass-split" title="Cargando lista..." />
      )}

      {!state.isLoading && state.notFound && (
        <ListStatus
          icon="search"
          title="Lista no encontrada"
          description="El enlace puede estar mal escrito o la lista ya no existe."
        >
          <Link className="btn btn-primary" to="/listas">
            Ver mis listas
          </Link>
        </ListStatus>
      )}

      {!state.isLoading && state.error && (
        <ListStatus icon="wifi-off" title="Algo salio mal" description={state.error} />
      )}

      {list && (
        <>
          <header className="lists detail-header">
            <div className="lists detail-info">
              <div className="lists card-top">
                <h1 className="lists title">{list.name}</h1>
                <VisibilityBadge visibility={list.visibility} />
              </div>

              {list.description && (
                <p className="lists subtitle">{list.description}</p>
              )}

              <p className="lists card-meta">
                <span>
                  <i className="bi bi-collection-play" aria-hidden="true" />
                  {list.items.length === 1 ? "1 titulo" : `${list.items.length} titulos`}
                </span>
              </p>
            </div>

            <div className="lists detail-actions">
              {!isAdding && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsAdding(true)}
                >
                  <i className="bi bi-plus-lg" aria-hidden="true" />
                  Agregar contenido
                </button>
              )}

              {/* borrar en dos pasos para que no se vaya por un click de mas */}
              {!isConfirmingDelete ? (
                <button
                  type="button"
                  className="btn btn-link lists danger"
                  onClick={() => setIsConfirmingDelete(true)}
                >
                  <i className="bi bi-trash3" aria-hidden="true" />
                  Eliminar lista
                </button>
              ) : (
                <div className="lists confirm">
                  <span>¿Eliminar esta lista?</span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={state.isDeleting}
                    onClick={() => setIsConfirmingDelete(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary lists danger-fill"
                    disabled={state.isDeleting}
                    onClick={() => void handleDelete()}
                  >
                    {state.isDeleting ? "Eliminando..." : "Si, eliminar"}
                  </button>
                </div>
              )}
            </div>
          </header>

          {state.actionError && <p className="lists form-error">{state.actionError}</p>}

          {isAdding && (
            <AddContentPanel
              list={list}
              state={addContent.state}
              setQuery={addContent.setQuery}
              add={(item) => void addContent.add(item)}
              close={closeAddPanel}
            />
          )}

          <ListItems
            items={list.items}
            busyKey={state.busyKey}
            onRemove={(item) => void removeItem(item)}
          />
        </>
      )}
    </main>
  );
}
