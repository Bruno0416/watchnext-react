import { asClass, asFunction } from "awilix";

import { CatalogDb } from "../../mock/content/catalog.db";
import { MediaDetailsDb } from "../../mock/content/media.details.db";
import { ContentService } from "../../mock/content/content.service";

function createContentService({
  catalogDb,
  mediaDetailsDb,
}: { catalogDb: CatalogDb; mediaDetailsDb: MediaDetailsDb }) {
  return new ContentService(catalogDb, mediaDetailsDb);
}

export const contentMockDi = {
  catalogDb: asClass(CatalogDb).singleton(),
  mediaDetailsDb: asClass(MediaDetailsDb).singleton(),
  contentService: asFunction(createContentService).singleton(),
};
