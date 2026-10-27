import type { JsonObject } from "../../../../core/mock/json.types";
import { NewsArticle } from "../../domain/entities/news.article";

// paso el json del servicio a la entidad
export class NewsArticleModel {
  constructor(
    public readonly id: string,
    public readonly slug: string,
    public readonly title: string,
    public readonly summary: string,
    public readonly content: string,
    public readonly imageUrl: string | null,
    public readonly publishedAt: string,
  ) {}

  static fromJson(json: JsonObject): NewsArticleModel {
    return new NewsArticleModel(
      String(json.id),
      String(json.slug ?? ""),
      String(json.title ?? ""),
      String(json.summary ?? ""),
      String(json.content ?? ""),
      typeof json.imageUrl === "string" && json.imageUrl ? json.imageUrl : null,
      String(json.publishedAt ?? ""),
    );
  }

  toDomain(): NewsArticle {
    // armo la fecha aca para que el dominio no ande parseando strings
    const parsed = new Date(this.publishedAt);

    return new NewsArticle({
      id: this.id,
      slug: this.slug,
      title: this.title,
      summary: this.summary,
      content: this.content,
      imageUrl: this.imageUrl,
      publishedAt: Number.isNaN(parsed.getTime()) ? new Date(0) : parsed,
    });
  }
}
