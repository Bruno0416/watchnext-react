import type { JsonArray, JsonObject } from "../json.types";
import { AuthStorage } from "../auth/auth.storage";
import { ListDb } from "./list.db";
import { ListServiceError } from "./list.service.error";

export class ListService {
  constructor(
    private readonly db: ListDb,
    private readonly authStorage: AuthStorage,
  ) {}

  // ---------- identidad y permisos ----------
  private actorId(): string {
    const userId = this.authStorage.getUserId();
    if (!this.authStorage.getTokens() || !userId) throw new ListServiceError(401);
    return userId;
  }

  private async editableList(id: string, actorId: string): Promise<JsonObject> {
    const list = await this.db.findById(id);
    if (!list) throw new ListServiceError(404);
    if (list.userId !== actorId) throw new ListServiceError(403);
    return list;
  }

  // ---------- endpoints (simulados) ----------
  async getAll(): Promise<JsonObject> {
    return this.db.getAllByUserId(this.actorId());
  }

  async getById(id: string): Promise<JsonObject> {
    const actorId = this.actorId();
    const list = await this.db.findById(id);
    if (!list) throw new ListServiceError(404);
    if (list.userId !== actorId && list.visibility !== "PUBLIC") {
      throw new ListServiceError(403);
    }
    return list;
  }

  async create(request: JsonObject): Promise<JsonObject> {
    const userId = this.actorId();
    const now = new Date().toISOString();

    // El identificador y el propietario nunca vienen de la solicitud.
    return this.db.insert({
      id: crypto.randomUUID(),
      userId,
      name: request.name,
      description: request.description,
      visibility: request.visibility,
      items: [],
      createdAt: now,
      updatedAt: now,
    });
  }

  async update(id: string, request: JsonObject): Promise<JsonObject> {
    await this.editableList(id, this.actorId());
    const changes: JsonObject = { updatedAt: new Date().toISOString() };
    for (const key of ["name", "description", "visibility"]) {
      if (Object.hasOwn(request, key)) changes[key] = request[key];
    }
    const updated = await this.db.update(id, changes);
    if (!updated) throw new ListServiceError(404);
    return updated;
  }

  async delete(id: string): Promise<null> {
    await this.editableList(id, this.actorId());
    await this.db.delete(id);
    return null;
  }

  async addItem(id: string, item: JsonObject): Promise<JsonObject> {
    const list = await this.editableList(id, this.actorId());
    const items = structuredClone(list.items as JsonArray);
    if (items.some((entry) => entry.tmdbId === item.tmdbId && entry.mediaType === item.mediaType)) {
      throw new ListServiceError(409);
    }
    items.push(structuredClone(item));

    const updated = await this.db.update(id, {
      items,
      updatedAt: new Date().toISOString(),
    });
    if (!updated) throw new ListServiceError(404);
    return updated;
  }

  async removeItem(id: string, tmdbId: number, mediaType: string): Promise<JsonObject> {
    const list = await this.editableList(id, this.actorId());
    const items = (list.items as JsonArray).filter(
      (item) => item.tmdbId !== tmdbId || item.mediaType !== mediaType,
    );

    const updated = await this.db.update(id, {
      items,
      updatedAt: new Date().toISOString(),
    });
    if (!updated) throw new ListServiceError(404);
    return updated;
  }
}
