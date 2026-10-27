import type { JsonArray, JsonObject } from "../../../../core/mock/json.types";
import { MediaList } from "../../domain/entities/media.list";
import { ListItemModel } from "./list.item.model";
import { toDate, toVisibility } from "./list.summary.model";

export class MediaListModel {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly visibility: string,
    public readonly items: ListItemModel[],
    public readonly createdAt: string,
    public readonly updatedAt: string,
  ) {}

  static fromJson(json: JsonObject): MediaListModel {
    const items = Array.isArray(json.items) ? (json.items as JsonArray) : [];

    return new MediaListModel(
      String(json.id),
      String(json.userId ?? ""),
      String(json.name ?? ""),
      String(json.description ?? ""),
      String(json.visibility ?? "PUBLIC"),
      items.map((item) => ListItemModel.fromJson(item)),
      String(json.createdAt ?? ""),
      String(json.updatedAt ?? ""),
    );
  }

  toDomain(): MediaList {
    return new MediaList({
      id: this.id,
      userId: this.userId,
      name: this.name,
      description: this.description,
      visibility: toVisibility(this.visibility),
      items: this.items.map((item) => item.toDomain()),
      createdAt: toDate(this.createdAt),
      updatedAt: toDate(this.updatedAt),
    });
  }
}
