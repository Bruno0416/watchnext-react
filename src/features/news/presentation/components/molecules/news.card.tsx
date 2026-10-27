import { Link } from "react-router";

import type { NewsArticle } from "../../../domain/entities/news.article";
import { NewsDate } from "../atoms/news.date";

type NewsCardProps = {
  article: NewsArticle;
};

export function NewsCard({ article }: NewsCardProps) {
  return (
    <article className="news card">
      {/* abro el detalle por id como pide la HU */}
      <Link className="news card-link" to={`/noticias/${article.id}`}>
        {article.imageUrl ? (
          <img
            className="news card-image"
            src={article.imageUrl}
            alt=""
            loading="lazy"
          />
        ) : (
          <div className="news card-image placeholder" aria-hidden="true">
            <i className="bi bi-newspaper" />
          </div>
        )}

        <div className="news card-body">
          <NewsDate value={article.publishedAt} />
          <h2 className="news card-title">{article.title}</h2>
          <p className="news card-summary">{article.summary}</p>
        </div>
      </Link>
    </article>
  );
}
