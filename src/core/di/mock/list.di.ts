import { asClass, asFunction } from "awilix";

import { ListDb } from "../../mock/list/list.db";
import { ListService } from "../../mock/list/list.service";
import { ListStorage } from "../../mock/list/list.storage";
import { AuthStorage } from "../../mock/auth/auth.storage";

function createListDb({ listStorage }: { listStorage: ListStorage }) {
  return new ListDb(listStorage);
}

function createListService({ listDb, authStorage }: { listDb: ListDb; authStorage: AuthStorage }) {
  return new ListService(listDb, authStorage);
}

export const listMockDi = {
  listStorage: asClass(ListStorage).singleton(),
  listDb: asFunction(createListDb).singleton(),
  listService: asFunction(createListService).singleton(),
};
