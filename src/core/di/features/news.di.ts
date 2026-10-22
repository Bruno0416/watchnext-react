import { asFunction } from "awilix";

import type { NewsService } from "../../mock/news/news.service";
import type { NewsLocalSource } from "../../../features/news/data/source/news.local.source";
import { NewsLocalSourceImpl } from "../../../features/news/data/source/news.local.source.impl";
import { NewsRepositoryImpl } from "../../../features/news/data/repositories/news.repository.impl";
import type { NewsRepository } from "../../../features/news/domain/repositories/news.repository";

import { GetNews } from "../../../features/news/domain/usecases/get.news";
import { GetNewsArticle } from "../../../features/news/domain/usecases/get.news.article";

export const newsFeatureDi = {
  // ------- data source -------
  newsSource: asFunction(
    ({ newsService }: { newsService: NewsService }) =>
      new NewsLocalSourceImpl(newsService),
  ).singleton(),

  // ------- repository -------
  newsRepository: asFunction(
    ({ newsSource }: { newsSource: NewsLocalSource }) =>
      new NewsRepositoryImpl(newsSource),
  ).singleton(),

  // ------- usecases -------
  getNews: asFunction(
    ({ newsRepository }: { newsRepository: NewsRepository }) =>
      new GetNews(newsRepository),
  ).singleton(),

  getNewsArticle: asFunction(
    ({ newsRepository }: { newsRepository: NewsRepository }) =>
      new GetNewsArticle(newsRepository),
  ).singleton(),
};
