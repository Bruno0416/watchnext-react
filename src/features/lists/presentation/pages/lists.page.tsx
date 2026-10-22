import { container } from "../../../../core/di/container";
import type { CreateList } from "../../domain/usecases/create.list";
import type { GetLists } from "../../domain/usecases/get.lists";
import { ListStatus } from "../components/atoms/list.status";
import { CreateListForm } from "../components/organisms/create.list.form";
import { ListsGrid } from "../components/organisms/lists.grid";
import { useListsViewModel } from "../viewmodels/lists.viewmodel";
import "./style/lists.page.css";

export function ListsPage() {
  // ----- dependencias -----
  const getLists = container.resolve<GetLists>("getLists");
  const createList = container.resolve<CreateList>("createList");

  // ----- viewModel -----
  const {
    state,
    form,
    reload,
    toggleForm,
    setName,
    setDescription,
    setVisibility,
    validateNameField,
    validateDescriptionField,
    submit,
  } = useListsViewModel(getLists, createList);

  return (
    <main className="lists page">
      <header className="lists header">
        <div>
          <h1 className="lists title">Mis listas</h1>
          <p className="lists subtitle">
            Organiza las peliculas y series que quieres guardar.
          </p>
        </div>

        {!form.isOpen && (
          <button type="button" className="btn btn-primary" onClick={toggleForm}>
            <i className="bi bi-plus-lg" aria-hidden="true" />
            Nueva lista
          </button>
        )}
      </header>

      {form.isOpen && (
        <CreateListForm
          form={form}
          setName={setName}
          setDescription={setDescription}
          setVisibility={setVisibility}
          validateNameField={validateNameField}
          validateDescriptionField={validateDescriptionField}
          submit={submit}
          cancel={toggleForm}
        />
      )}

      {state.isLoading && (
        <ListStatus icon="hourglass-split" title="Cargando tus listas..." />
      )}

      {!state.isLoading && state.error && (
        <ListStatus icon="wifi-off" title="Algo salio mal" description={state.error}>
          <button type="button" className="btn btn-primary" onClick={reload}>
            Reintentar
          </button>
        </ListStatus>
      )}

      {!state.isLoading && !state.error && <ListsGrid lists={state.lists} />}
    </main>
  );
}
