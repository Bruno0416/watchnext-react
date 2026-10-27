import type { ListItemModel } from "../models/list.item.model";

// de donde saco el contenido para agregar a una lista (hoy el mock de search)
export interface ListContentSource {
  search(query: string): Promise<ListItemModel[]>;
}
