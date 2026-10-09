import { asClass, asFunction } from "awilix";

import { NewsDb } from "../../mock/news/news.db";
import { NewsService } from "../../mock/news/news.service";
import { NewsStorage } from "../../mock/news/news.storage";

function createNewsDb({ newsStorage }: { newsStorage: NewsStorage }) {
  return new NewsDb(newsStorage);
}

function createNewsService({ newsDb }: { newsDb: NewsDb }) {
  return new NewsService(newsDb);
}

export const newsMockDi = {
  newsStorage: asClass(NewsStorage).singleton(),
  newsDb: asFunction(createNewsDb).singleton(),
  newsService: asFunction(createNewsService).singleton(),
};
