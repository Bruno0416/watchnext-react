import { asClass, asFunction } from "awilix";

import { CatalogDb } from "../../mock/content/catalog.db";
import { ContentService } from "../../mock/content/content.service";

function createContentService({ catalogDb }: { catalogDb: CatalogDb }) {
  return new ContentService(catalogDb);
}

export const contentMockDi = {
  catalogDb: asClass(CatalogDb).singleton(),
  contentService: asFunction(createContentService).singleton(),
};
