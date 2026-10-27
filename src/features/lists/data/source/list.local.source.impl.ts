import type { JsonArray, JsonObject } from "../../../../core/mock/json.types";
import type { ListService } from "../../../../core/mock/list/list.service";
import { ListServiceError } from "../../../../core/mock/list/list.service.error";
import { ListError } from "../errors/list.errors";
import type { ListItemModel } from "../models/list.item.model";
import { ListSummaryModel } from "../models/list.summary.model";
import { MediaListModel } from "../models/media.list.model";
import type { ListLocalSource } from "./list.local.source";

export class ListLocalSourceImpl implements ListLocalSource {
  constructor(private readonly service: ListService) {}

  private async call<T>(operation: Promise<T>): Promise<T> {
    try {
      return await operation;
    } catch (error) {
      if (error instanceof ListServiceError) throw new ListError(error.status);
      throw error;
    }
  }

  async getAll(): Promise<ListSummaryModel[]> {
    // el mock devuelve { lists: [...] } igual que el endpoint real
    const json = await this.call(this.service.getAll());
    const lists = Array.isArray(json.lists) ? (json.lists as JsonArray) : [];

    return lists.map((item) => ListSummaryModel.fromJson(item));
  }

  async getById(id: string): Promise<MediaListModel> {
    const json = await this.call(this.service.getById(id));

    // si no esta tiro 404 igual que lo haria el backend
    if (!json) {
      throw new ListError(404);
    }

    return MediaListModel.fromJson(json);
  }

  async create(request: JsonObject): Promise<MediaListModel> {
    const json = await this.call(this.service.create(request));
    return MediaListModel.fromJson(json);
  }

  async delete(id: string): Promise<void> {
    await this.call(this.service.delete(id));
  }

  async addItem(id: string, item: ListItemModel): Promise<MediaListModel> {
    const json = await this.call(this.service.addItem(id, item.toJson()));

    if (!json) {
      throw new ListError(404);
    }

    return MediaListModel.fromJson(json);
  }

  async removeItem(
    id: string,
    tmdbId: number,
    mediaType: string,
  ): Promise<MediaListModel> {
    const json = await this.call(this.service.removeItem(id, tmdbId, mediaType));

    if (!json) {
      throw new ListError(404);
    }

    return MediaListModel.fromJson(json);
  }
}
