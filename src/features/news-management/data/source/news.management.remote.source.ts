import type { JsonObject } from "../../../../core/http/json.types";
import type { ManagedNewsModel } from "../models/managed.news.model";

// contrato con el news-service (crear, editar y borrar solo ADMIN)
export interface NewsManagementRemoteSource {
  getAll(): Promise<ManagedNewsModel[]>;
  create(request: JsonObject): Promise<ManagedNewsModel>;
  update(id: string, request: JsonObject): Promise<ManagedNewsModel>;
  delete(id: string): Promise<void>;
}
