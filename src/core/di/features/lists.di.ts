import { asFunction } from "awilix";

import type { ListLocalSource } from "../../../features/lists/data/source/list.local.source";
import { ListRemoteSourceImpl } from "../../../features/lists/data/source/list.remote.source.impl";
import type { ListContentSource } from "../../../features/lists/data/source/list.content.source";
import { ListContentRemoteSourceImpl } from "../../../features/lists/data/source/list.content.remote.source.impl";
import { ListRepositoryImpl } from "../../../features/lists/data/repositories/list.repository.impl";
import { ListContentRepositoryImpl } from "../../../features/lists/data/repositories/list.content.repository.impl";
import type { ListRepository } from "../../../features/lists/domain/repositories/list.repository";
import type { ListContentRepository } from "../../../features/lists/domain/repositories/list.content.repository";

import { GetLists } from "../../../features/lists/domain/usecases/get.lists";
import { GetList } from "../../../features/lists/domain/usecases/get.list";
import { CreateList } from "../../../features/lists/domain/usecases/create.list";
import { DeleteList } from "../../../features/lists/domain/usecases/delete.list";
import { AddListItem } from "../../../features/lists/domain/usecases/add.list.item";
import { RemoveListItem } from "../../../features/lists/domain/usecases/remove.list.item";
import { SearchListContent } from "../../../features/lists/domain/usecases/search.list.content";

export const listsFeatureDi = {
  // ------- data sources -------
  listSource: asFunction(() => new ListRemoteSourceImpl()).singleton(),

  listContentSource: asFunction(() => new ListContentRemoteSourceImpl()).singleton(),

  // ------- repositories -------
  listRepository: asFunction(
    ({ listSource }: { listSource: ListLocalSource }) =>
      new ListRepositoryImpl(listSource),
  ).singleton(),

  listContentRepository: asFunction(
    ({ listContentSource }: { listContentSource: ListContentSource }) =>
      new ListContentRepositoryImpl(listContentSource),
  ).singleton(),

  // ------- usecases -------
  getLists: asFunction(
    ({ listRepository }: { listRepository: ListRepository }) =>
      new GetLists(listRepository),
  ).singleton(),

  getList: asFunction(
    ({ listRepository }: { listRepository: ListRepository }) =>
      new GetList(listRepository),
  ).singleton(),

  createList: asFunction(
    ({ listRepository }: { listRepository: ListRepository }) =>
      new CreateList(listRepository),
  ).singleton(),

  deleteList: asFunction(
    ({ listRepository }: { listRepository: ListRepository }) =>
      new DeleteList(listRepository),
  ).singleton(),

  addListItem: asFunction(
    ({ listRepository }: { listRepository: ListRepository }) =>
      new AddListItem(listRepository),
  ).singleton(),

  removeListItem: asFunction(
    ({ listRepository }: { listRepository: ListRepository }) =>
      new RemoveListItem(listRepository),
  ).singleton(),

  searchListContent: asFunction(
    ({ listContentRepository }: { listContentRepository: ListContentRepository }) =>
      new SearchListContent(listContentRepository),
  ).singleton(),
};
