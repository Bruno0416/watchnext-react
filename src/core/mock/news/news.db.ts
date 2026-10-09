import type { JsonArray, JsonObject } from "../json.types";
import { NewsStorage } from "./news.storage";

interface NewsSeed extends JsonObject {
  articles: JsonArray;
}

export class NewsDb {
  private storage: NewsStorage;

  constructor(storage: NewsStorage) {
    this.storage = storage;
  }

  private data: NewsSeed | null = null;

  // ---------- carga inicial ----------
  private async load(): Promise<NewsSeed> {
    if (this.data) {
      return this.data;
    }

    const stored = this.storage.get() as NewsSeed | null;

    if (stored) {
      this.data = structuredClone(stored);
      return this.data;
    }

    const response = await fetch("/data/news.json");
    this.data = (await response.json()) as NewsSeed;
    this.storage.set(this.data);

    return this.data;
  }

  private persist(): void {
    if (this.data) {
      this.storage.set(this.data);
    }
  }

  // ---------- consultas ----------
  async getAll(): Promise<JsonArray> {
    return structuredClone((await this.load()).articles);
  }

  async findById(id: string): Promise<JsonObject | null> {
    const data = await this.load();
    const article = data.articles.find((item) => item.id === id);

    return article ? structuredClone(article) : null;
  }

  async findBySlug(slug: string): Promise<JsonObject | null> {
    const data = await this.load();
    const article = data.articles.find((item) => item.slug === slug);

    return article ? structuredClone(article) : null;
  }

  async insert(article: JsonObject): Promise<JsonObject> {
    const data = await this.load();
    const stored = structuredClone(article);

    data.articles.push(stored);
    this.persist();

    return structuredClone(stored);
  }

  async update(id: string, changes: JsonObject): Promise<JsonObject | null> {
    const data = await this.load();
    const index = data.articles.findIndex((item) => item.id === id);

    if (index < 0) {
      return null;
    }

    data.articles[index] = {
      ...data.articles[index],
      ...structuredClone(changes),
    };
    this.persist();

    return structuredClone(data.articles[index]);
  }

  async delete(id: string): Promise<null> {
    const data = await this.load();

    data.articles = data.articles.filter((item) => item.id !== id);
    this.persist();

    return null;
  }
}
