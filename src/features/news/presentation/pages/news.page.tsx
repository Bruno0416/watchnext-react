import { container } from "../../../../core/di/container";
import type { GetNews } from "../../domain/usecases/get.news";
import { NewsStatus } from "../components/atoms/news.status";
import { NewsList } from "../components/organisms/news.list";
import { useNewsListViewModel } from "../viewmodels/news.list.viewmodel";
import "./style/news.page.css";

export function NewsPage() {
  // ----- dependencias -----
  const getNews = container.resolve<GetNews>("getNews");

  // ----- viewModel -----
  const { state, reload } = useNewsListViewModel(getNews);

  return (
    <section className="news page">
      <header className="news header">
        <h1 className="news title">Noticias</h1>
        <p className="news subtitle">
          Novedades de WatchNext y del contenido que estamos siguiendo.
        </p>
      </header>

      {state.isLoading && (
        <NewsStatus icon="hourglass-split" title="Cargando noticias..." />
      )}

      {!state.isLoading && state.error && (
        <NewsStatus
          icon="wifi-off"
          title="Algo salió mal"
          description={state.error}
        >
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => void reload()}
          >
            Reintentar
          </button>
        </NewsStatus>
      )}

      {!state.isLoading && !state.error && (
        <NewsList articles={state.articles} />
      )}
    </section>
  );
}
