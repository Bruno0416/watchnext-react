import type { JsonObject } from "../../../../core/mock/json.types";
import { ManagedNews, type NewsDraft } from "../../domain/entities/managed.news";

// paso el json del NewsService a la entidad y el borrador a json
export class ManagedNewsModel {
  constructor(
    public readonly id: string,
    public readonly slug: string,
    public readonly title: string,
    public readonly summary: string,
    public readonly content: string,
    public readonly imageUrl: string | null,
    public readonly publishedAt: string,
  ) {}

  static fromJson(json: JsonObject): ManagedNewsModel {
    return new ManagedNewsModel(
      String(json.id),
      String(json.slug ?? ""),
      String(json.title ?? ""),
      String(json.summary ?? ""),
      String(json.content ?? ""),
      typeof json.imageUrl === "string" && json.imageUrl ? json.imageUrl : null,
      String(json.publishedAt ?? ""),
    );
  }

  // lo que mando al servicio; el slug lo saco del titulo
  static draftToJson(d: NewsDraft, publishedAt?: string): JsonObject {
    const json: JsonObject = {
      title: d.title,
      slug: slugify(d.title),
      summary: d.summary,
      content: d.content,
      imageUrl: d.imageUrl || null,
    };
    if (publishedAt) json.publishedAt = publishedAt;
    return json;
  }

  toDomain(): ManagedNews {
    const fecha = new Date(this.publishedAt);
    return new ManagedNews({
      id: this.id,
      slug: this.slug,
      title: this.title,
      summary: this.summary,
      content: this.content,
      imageUrl: this.imageUrl,
      publishedAt: Number.isNaN(fecha.getTime()) ? new Date(0) : fecha,
    });
  }
}

// "Cuatro titulos para ti" -> "cuatro-titulos-para-ti"
export function slugify(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
