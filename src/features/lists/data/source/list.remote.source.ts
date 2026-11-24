import type { JsonObject } from "../../../../core/http/json.types";
import type { ListItemModel } from "../models/list.item.model";
import type { ListSummaryModel } from "../models/list.summary.model";
import type { MediaListModel } from "../models/media.list.model";

// contrato con el list-service
export interface ListRemoteSource {
  getAll(): Promise<ListSummaryModel[]>;
  getById(id: string): Promise<MediaListModel>;
  create(request: JsonObject): Promise<MediaListModel>;
  delete(id: string): Promise<void>;
  addItem(id: string, item: ListItemModel): Promise<MediaListModel>;
  removeItem(id: string, tmdbId: number, mediaType: string): Promise<MediaListModel>;
}
