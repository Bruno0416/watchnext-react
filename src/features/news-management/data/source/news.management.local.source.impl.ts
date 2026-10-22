import type { JsonObject } from "../../../../core/mock/json.types";
import type { NewsService } from "../../../../core/mock/news/news.service";
import { NewsManagementError } from "../errors/news.management.errors";
import { ManagedNewsModel } from "../models/managed.news.model";
import type { NewsManagementLocalSource } from "./news.management.local.source";

export class NewsManagementLocalSourceImpl implements NewsManagementLocalSource {
  constructor(private readonly service: NewsService) {}

  async getAll(): Promise<ManagedNewsModel[]> {
    // 1. pido todas al servicio
    const json = await this.service.getAll();
    // 2. las paso a modelo
    return json.map((j) => ManagedNewsModel.fromJson(j));
  }

  async create(request: JsonObject): Promise<ManagedNewsModel> {
    const json = await this.service.create(request);
    return ManagedNewsModel.fromJson(json);
  }

  async update(id: string, request: JsonObject): Promise<ManagedNewsModel> {
    const json = await this.service.update(id, request);
    // si no esta, 404 como el backend
    if (!json) throw new NewsManagementError(404);
    return ManagedNewsModel.fromJson(json);
  }

  async delete(id: string): Promise<void> {
    await this.service.delete(id);
  }
}
