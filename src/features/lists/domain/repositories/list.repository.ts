import type { MediaType } from "../../../../core/models/media.type";
import type { ListItem } from "../entities/list.item";
import type { ListSummary } from "../entities/list.summary";
import type { ListVisibility } from "../entities/list.visibility";
import type { MediaList } from "../entities/media.list";

export type CreateListData = {
  name: string;
  description: string;
  visibility: ListVisibility;
};

// contrato de listas, solo lo que el List Service real sabe hacer
export interface ListRepository {
  // mis listas sin los items
  getAll(): Promise<ListSummary[]>;

  // una lista con sus items, si no esta tira ListNotFoundException
  getById(id: string): Promise<MediaList>;

  create(data: CreateListData): Promise<MediaList>;

  delete(id: string): Promise<void>;

  // devuelven la lista ya actualizada para no tener que pedirla de nuevo
  addItem(id: string, item: ListItem): Promise<MediaList>;

  removeItem(id: string, tmdbId: number, mediaType: MediaType): Promise<MediaList>;
}
