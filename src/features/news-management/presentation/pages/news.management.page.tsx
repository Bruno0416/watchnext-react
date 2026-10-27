import { Link } from "react-router";

import { container } from "../../../../core/di/container";
import type { CreateNews } from "../../domain/usecases/create.news";
import type { DeleteNews } from "../../domain/usecases/delete.news";
import type { GetAllNews } from "../../domain/usecases/get.all.news";
import type { UpdateNews } from "../../domain/usecases/update.news";
import { ManagementStatus } from "../components/atoms/management.status";
import { NewsSearchBar } from "../components/molecules/news.search.bar";
import { NewsForm } from "../components/organisms/news.form";
import { NewsTable } from "../components/organisms/news.table";
import { useNewsManagementViewModel } from "../viewmodels/news.management.viewmodel";
import "./style/news.management.page.css";

export function NewsManagementPage() {
  // ----- dependencias -----
  const getAllNews = container.resolve<GetAllNews>("getAllNews");
  const createNews = container.resolve<CreateNews>("createNews");
  const updateNews = container.resolve<UpdateNews>("updateNews");
  const deleteNews = container.resolve<DeleteNews>("deleteNews");

  // ----- viewModel -----
  const vm = useNewsManagementViewModel(getAllNews, createNews, updateNews, deleteNews);
  const { state, form } = vm;

  return (
    <div className="nm page">
      <Link to="/admin" className="nm back">
        <i className="bi bi-arrow-left" aria-hidden="true" /> Panel de administracion
      </Link>

      <header className="nm header">
        <div>
          <h1 className="nm title">Administrar noticias</h1>
          <p className="nm subtitle">Crea, edita y elimina las noticias que ven los usuarios.</p>
        </div>
        {!form.isOpen && (
          <button type="button" className="btn btn-primary" onClick={vm.openCreate}>
            <i className="bi bi-plus-lg" aria-hidden="true" /> Nueva noticia
          </button>
        )}
      </header>

      {state.okMessage && (
        <div className="alert alert-success" role="status">
          {state.okMessage}
        </div>
      )}
      {state.actionError && (
        <div className="alert alert-danger" role="alert">
          {state.actionError}
        </div>
      )}

      {form.isOpen && (
        <NewsForm
          form={form}
          onField={vm.setField}
          onBlur={vm.validateField}
          onSubmit={() => void vm.submit()}
          onCancel={vm.closeForm}
        />
      )}

      {state.isLoading && <ManagementStatus icon="hourglass-split" title="Cargando noticias..." />}

      {!state.isLoading && state.error && (
        <ManagementStatus icon="wifi-off" title="Algo salio mal" description={state.error}>
          <button type="button" className="btn btn-primary" onClick={vm.reload}>
            Reintentar
          </button>
        </ManagementStatus>
      )}

      {!state.isLoading && !state.error && (
        <>
          <NewsSearchBar
            value={state.search}
            total={state.news.length}
            visibles={vm.visibles.length}
            onChange={vm.setSearch}
          />
          <NewsTable
            news={vm.visibles}
            hayBusqueda={state.search.trim() !== ""}
            deletingId={state.deletingId}
            isDeleting={state.isDeleting}
            onEdit={vm.openEdit}
            onAskDelete={vm.askDelete}
            onCancelDelete={vm.cancelDelete}
            onConfirmDelete={() => void vm.confirmDelete()}
          />
        </>
      )}
    </div>
  );
}
