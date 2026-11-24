import type { JsonObject } from "../../../../core/http/json.types";
import type { ProfileModel } from "../models/profile.model";

// contrato con el user-service
export interface ProfileRemoteSource {
  getMine(): Promise<ProfileModel>;
  getByUsername(username: string): Promise<ProfileModel>;
  update(request: JsonObject): Promise<ProfileModel>;
}
