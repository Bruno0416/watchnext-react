import { apiJson, ApiHttpError } from "../../../../core/http/api.client";
import type { JsonObject } from "../../../../core/mock/json.types";
import { MediaType } from "../../../../core/models/media.type";
import { MediaNotFoundError } from "../errors/media.errors";
import { MediaDetailModel } from "../models/media.detail.model";
import type { MediaLocalSource } from "./media.local.source";

export class MediaRemoteSourceImpl implements MediaLocalSource {
  async getMediaDetail(mediaType: MediaType, tmdbId: number): Promise<MediaDetailModel> {
    const section = mediaType === MediaType.MOVIE ? "movies" : "tv";
    const path = `/api/v1/content/${section}/${tmdbId}`;

    try {
      // 1. consultar los detalles y proveedores en paralelo
      const [details, watchProviders] = await Promise.all([
        apiJson<JsonObject>(path, { auth: "optional" }),
        apiJson<JsonObject[]>(`${path}/watch-providers`, { auth: "optional" }),
      ]);

      // 2. reunir los datos en el modelo de detalle
      return MediaDetailModel.fromJson({
        mediaType: mediaType.toUpperCase(),
        details,
        watchProviders,
      });
    } catch (error) {
      // 3. convertir la ausencia de contenido en un error de dominio
      if (error instanceof ApiHttpError && error.status === 404) {
        throw new MediaNotFoundError();
      }
      throw error;
    }
  }
}
