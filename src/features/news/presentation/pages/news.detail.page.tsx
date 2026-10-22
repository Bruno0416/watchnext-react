import { Link, useParams } from "react-router";

import { container } from "../../../../core/di/container";
import type { GetNewsArticle } from "../../domain/usecases/get.news.article";
import { NewsDate } from "../components/atoms/news.date";
import { NewsStatus } from "../components/atoms/news.status";
import { useNewsDetailViewModel } from "../viewmodels/news.detail.viewmodel";
import "./style/news.page.css";

export function NewsDetailPage() {
  // el id viene de la url /noticias/:id
  const { id } = useParams<{ id: string }>();

  // ----- dependencias -----
  const getNewsArticle = container.resolve<GetNewsArticle>("getNewsArticle");

  // ----- viewModel -----
  const { state } = useNewsDetailViewModel(getNewsArticle, id);

  return (
    <main className="news page">
      <Link className="news back" to="/noticias">
        <i className="bi bi-arrow-left" aria-hidden="true" />
        Volver a noticias
      </Link>

      {state.isLoading && (
        <NewsStatus icon="hourglass-split" title="Cargando noticia..." />
      )}

      {!state.isLoading && state.notFound && (
        <NewsStatus
          icon="search"
          title="Noticia no encontrada"
          description="El enlace puede estar mal escrito o la noticia ya no existe."
        >
          <Link className="btn btn-primary" to="/noticias">
            Ver todas las noticias
          </Link>
        </NewsStatus>
      )}

      {!state.isLoading && state.error && (
        <NewsStatus
          icon="wifi-off"
          title="Algo salió mal"
          description={state.error}
        />
      )}

      {!state.isLoading && state.article && (
        <article className="news article">
          {state.article.imageUrl && (
            <img
              className="news article-image"
              src={state.article.imageUrl}
              alt=""
            />
          )}

          <NewsDate value={state.article.publishedAt} />
          <h1 className="news article-title">{state.article.title}</h1>
          <p className="news article-summary">{state.article.summary}</p>
          <p className="news article-content">{state.article.content}</p>
        </article>
      )}
    </main>
  );
}
