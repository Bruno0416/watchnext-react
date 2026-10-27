import type { MediaType } from "../../../../core/models/media.type";
import type { ListItem } from "../../domain/entities/list.item";
import type { ListSummary } from "../../domain/entities/list.summary";
import type { MediaList } from "../../domain/entities/media.list";
import type {
  CreateListData,
  ListRepository,
} from "../../domain/repositories/list.repository";
import { ListError } from "../errors/list.errors";
import {
  ListAccessDeniedException,
  ListAuthenticationRequiredException,
  ListItemAlreadyExistsException,
  ListNotFoundException,
  ListUnavailableException,
} from "../errors/list.exceptions";
import { ListItemModel } from "../models/list.item.model";
import type { ListLocalSource } from "../source/list.local.source";

export class ListRepositoryImpl implements ListRepository {
  constructor(private readonly source: ListLocalSource) {}

  async getAll(): Promise<ListSummary[]> {
    try {
      const models = await this.source.getAll();

      // la mas tocada recientemente va primero
      return models
        .map((model) => model.toDomain())
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    } catch (e) {
      throw this.mapError(e);
    }
  }

  async getById(id: string): Promise<MediaList> {
    try {
      const model = await this.source.getById(id);
      return model.toDomain();
    } catch (e) {
      throw this.mapError(e);
    }
  }

  async create(data: CreateListData): Promise<MediaList> {
    try {
      const model = await this.source.create({
        name: data.name,
        description: data.description,
        visibility: data.visibility,
      });

      return model.toDomain();
    } catch (e) {
      throw this.mapError(e);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.source.delete(id);
    } catch (e) {
      throw this.mapError(e);
    }
  }

  async addItem(id: string, item: ListItem): Promise<MediaList> {
    try {
      // el mock no revisa repetidos, asi que lo reviso yo antes de agregar
      const current = await this.source.getById(id);

      if (current.toDomain().has(item.tmdbId, item.mediaType)) {
        throw new ListError(409);
      }

      const model = await this.source.addItem(id, ListItemModel.fromDomain(item));
      return model.toDomain();
    } catch (e) {
      throw this.mapError(e);
    }
  }

  async removeItem(
    id: string,
    tmdbId: number,
    mediaType: MediaType,
  ): Promise<MediaList> {
    try {
      // el List Service espera MOVIE / TV en mayuscula
      const model = await this.source.removeItem(
        id,
        tmdbId,
        mediaType.toUpperCase(),
      );

      return model.toDomain();
    } catch (e) {
      throw this.mapError(e);
    }
  }

  // ---- helper ----
  // paso el error pelado a una excepcion que la vista entienda
  private mapError(e: unknown): Error {
    if (e instanceof ListError) {
      switch (e.status) {
        case 401:
          return new ListAuthenticationRequiredException();
        case 403:
          return new ListAccessDeniedException();
        case 404:
          return new ListNotFoundException();
        case 409:
          return new ListItemAlreadyExistsException();
      }
    }

    console.error(e);
    return new ListUnavailableException();
  }
}
