import { asFunction } from "awilix";

import type { NewsManagementRemoteSource } from "../../../features/news-management/data/source/news.management.remote.source";
import { NewsManagementRemoteSourceImpl } from "../../../features/news-management/data/source/news.management.remote.source.impl";
import { NewsManagementRepositoryImpl } from "../../../features/news-management/data/repositories/news.management.repository.impl";
import type { NewsManagementRepository } from "../../../features/news-management/domain/repositories/news.management.repository";

import { GetAllNews } from "../../../features/news-management/domain/usecases/get.all.news";
import { CreateNews } from "../../../features/news-management/domain/usecases/create.news";
import { UpdateNews } from "../../../features/news-management/domain/usecases/update.news";
import { DeleteNews } from "../../../features/news-management/domain/usecases/delete.news";

type R = { newsManagementRepository: NewsManagementRepository };

export const newsManagementFeatureDi = {
  // ------- data source -------
  newsManagementSource: asFunction(() => new NewsManagementRemoteSourceImpl()).singleton(),

  // ------- repository -------
  newsManagementRepository: asFunction(
    ({ newsManagementSource }: { newsManagementSource: NewsManagementRemoteSource }) =>
      new NewsManagementRepositoryImpl(newsManagementSource),
  ).singleton(),

  // ------- usecases -------
  getAllNews: asFunction(({ newsManagementRepository }: R) => new GetAllNews(newsManagementRepository)).singleton(),
  createNews: asFunction(({ newsManagementRepository }: R) => new CreateNews(newsManagementRepository)).singleton(),
  updateNews: asFunction(({ newsManagementRepository }: R) => new UpdateNews(newsManagementRepository)).singleton(),
  deleteNews: asFunction(({ newsManagementRepository }: R) => new DeleteNews(newsManagementRepository)).singleton(),
};
