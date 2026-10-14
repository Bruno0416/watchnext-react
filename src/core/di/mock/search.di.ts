import { asFunction } from "awilix";

import { CatalogDb } from "../../mock/content/catalog.db";
import { SearchService } from "../../mock/search/search.service";

function createSearchService({ catalogDb }: { catalogDb: CatalogDb }) {
  return new SearchService(catalogDb);
}

export const searchMockDi = {
  searchService: asFunction(createSearchService).singleton(),
};
