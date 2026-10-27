import type { NewsService } from "../../../../core/mock/news/news.service";
import { NewsError } from "../errors/news.errors";
import { NewsArticleModel } from "../models/news.article.model";
import type { NewsLocalSource } from "./news.local.source";

export class NewsLocalSourceImpl implements NewsLocalSource {
  constructor(private readonly service: NewsService) {}

  async getAll(): Promise<NewsArticleModel[]> {
    // pido el listado al mock
    const json = await this.service.getAll();

    // y paso cada uno a modelo
    return json.map((item) => NewsArticleModel.fromJson(item));
  }

  async getById(id: string): Promise<NewsArticleModel> {
    // pido la noticia al mock
    const json = await this.service.getById(id);

    // si no esta tiro 404 igual que lo haria el backend
    if (!json) {
      throw new NewsError(404);
    }

    // y la paso a modelo
    return NewsArticleModel.fromJson(json);
  }
}
