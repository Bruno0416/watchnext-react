import type { NewsArticle } from "../../../domain/entities/news.article";
import { NewsStatus } from "../atoms/news.status";
import { NewsCard } from "../molecules/news.card";

type NewsListProps = {
  articles: NewsArticle[];
};

export function NewsList({ articles }: NewsListProps) {
  // puede quedar vacio si el admin borra todas las noticias
  if (articles.length === 0) {
    return (
      <NewsStatus
        icon="newspaper"
        title="Todavía no hay noticias"
        description="Cuando publiquemos algo nuevo va a aparecer aquí."
      />
    );
  }

  return (
    <div className="news grid">
      {articles.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}
