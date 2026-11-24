import type { ListItemModel } from "../models/list.item.model";

// de donde saco el contenido para agregar a una lista (el search-service)
export interface ListContentSource {
  search(query: string): Promise<ListItemModel[]>;
}
