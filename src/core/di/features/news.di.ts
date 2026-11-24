import { asFunction } from "awilix";

import type { NewsRemoteSource } from "../../../features/news/data/source/news.remote.source";
import { NewsRemoteSourceImpl } from "../../../features/news/data/source/news.remote.source.impl";
import { NewsRepositoryImpl } from "../../../features/news/data/repositories/news.repository.impl";
import type { NewsRepository } from "../../../features/news/domain/repositories/news.repository";

import { GetNews } from "../../../features/news/domain/usecases/get.news";
import { GetNewsArticle } from "../../../features/news/domain/usecases/get.news.article";

export const newsFeatureDi = {
  // ------- data source -------
  newsSource: asFunction(() => new NewsRemoteSourceImpl()).singleton(),

  // ------- repository -------
  newsRepository: asFunction(
    ({ newsSource }: { newsSource: NewsRemoteSource }) =>
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
