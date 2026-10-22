import type { JsonObject } from "../../../../core/mock/json.types";
import type { UserService } from "../../../../core/mock/user/user.service";
import { ProfileError } from "../errors/profile.errors";
import { ProfileModel } from "../models/profile.model";
import type { ProfileLocalSource } from "./profile.local.source";

export class ProfileLocalSourceImpl implements ProfileLocalSource {
  constructor(private readonly service: UserService) {}

  async getMine(): Promise<ProfileModel> {
    const json = await this.service.getMyProfile();

    // sin sesion o sin perfil el backend contesta 401
    if (!json) {
      throw new ProfileError(401);
    }

    return ProfileModel.fromJson(json);
  }

  async getByUsername(username: string): Promise<ProfileModel> {
    const json = await this.service.getProfile(username);

    if (!json) {
      throw new ProfileError(404);
    }

    return ProfileModel.fromJson(json);
  }

  async update(request: JsonObject): Promise<ProfileModel> {
    const json = await this.service.updateProfile(request);

    if (!json) {
      throw new ProfileError(401);
    }

    return ProfileModel.fromJson(json);
  }
}
