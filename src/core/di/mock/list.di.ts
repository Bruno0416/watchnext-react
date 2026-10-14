import { asClass, asFunction } from "awilix";

import { ListDb } from "../../mock/list/list.db";
import { ListService } from "../../mock/list/list.service";
import { ListStorage } from "../../mock/list/list.storage";

function createListDb({ listStorage }: { listStorage: ListStorage }) {
  return new ListDb(listStorage);
}

function createListService({ listDb }: { listDb: ListDb }) {
  return new ListService(listDb);
}

export const listMockDi = {
  listStorage: asClass(ListStorage).singleton(),
  listDb: asFunction(createListDb).singleton(),
  listService: asFunction(createListService).singleton(),
};
