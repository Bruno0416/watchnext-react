import { asClass, asFunction } from "awilix";

import { ListsDb } from "../../mock/lists/lists.db";
import { ListsService } from "../../mock/lists/lists.service";
import { ListsStorage } from "../../mock/lists/lists.storage";

function createListsDb({ listsStorage }: { listsStorage: ListsStorage }) {
  return new ListsDb(listsStorage);
}

function createListsService({ listsDb }: { listsDb: ListsDb }) {
  return new ListsService(listsDb);
}

export const listsMockDi = {
  listsStorage: asClass(ListsStorage).singleton(),
  listsDb: asFunction(createListsDb).singleton(),
  listsService: asFunction(createListsService).singleton(),
};
