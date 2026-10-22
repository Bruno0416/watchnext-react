import type { JsonObject } from "../../../../core/mock/json.types";
import type { ProfileModel } from "../models/profile.model";

// hoy es el mock, despues sera el User Service de verdad
export interface ProfileLocalSource {
  getMine(): Promise<ProfileModel>;
  getByUsername(username: string): Promise<ProfileModel>;
  update(request: JsonObject): Promise<ProfileModel>;
}
