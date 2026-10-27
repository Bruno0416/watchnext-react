import type { JsonObject } from "../../../../core/mock/json.types";
import type { ManagedNewsModel } from "../models/managed.news.model";

// SIMULADO: hoy es el mock NewsService; no existe todavia un servicio de noticias real
export interface NewsManagementLocalSource {
  getAll(): Promise<ManagedNewsModel[]>;
  create(request: JsonObject): Promise<ManagedNewsModel>;
  update(id: string, request: JsonObject): Promise<ManagedNewsModel>;
  delete(id: string): Promise<void>;
}
