import type { JsonArray, JsonObject } from "../../mock/json.types";
import { FeedbackRatingError, type FeedbackRatingErrorCode } from "../../mock/feedback/feedback.rating.error";
import type { HttpClient } from "../http.client";

// ---------- feedback-service real (mismos metodos que el mock) ----------
export class FeedbackApiService {
  constructor(private readonly http: HttpClient) {}

  // ---------- consultas ----------
  async getRatings(): Promise<JsonArray> {
    const res = await this.http.get<JsonArray>("/feedback/ratings/me");

    return res.ok && res.data ? res.data : [];
  }

  async getReviews(): Promise<JsonArray> {
    const res = await this.http.get<JsonArray>("/feedback/reviews/me");

    return res.ok && res.data ? res.data : [];
  }

  async getAggregatedReviews(key: string): Promise<JsonObject | null> {
    // 1. la clave viene como "TV:1396"
    const [mediaType, tmdbId] = key.split(":");
    const res = await this.http.get<JsonObject>(`/feedback/reviews/${mediaType}/${tmdbId}`);

    return res.ok ? res.data : null;
  }

  async getMyRating(tmdbId: number): Promise<JsonObject | null> {
    const res = await this.http.get<JsonObject>("/feedback/ratings", {
      query: { tmdbId, mediaType: "MOVIE" },
    });

    // 1. sin calificacion el backend responde 404
    if (res.status === 404) {
      return null;
    }

    if (!res.ok) {
      throw new FeedbackRatingError(this.ratingError(res.status));
    }

    return res.data;
  }

  // ---------- calificaciones ----------
  async createRating(request: JsonObject): Promise<JsonObject> {
    // 1. crear calificacion
    const res = await this.http.post("/feedback/ratings/create", request);

    if (!res.ok) {
      throw new FeedbackRatingError(this.ratingError(res.status));
    }

    // 2. el backend no la devuelve, la vuelvo a pedir
    const rating = await this.getMyRating(request.tmdbId as number);

    if (!rating) {
      throw new FeedbackRatingError("RATING_NOT_FOUND");
    }

    return rating;
  }

  async deleteRating(id: string): Promise<void> {
    // 1. el backend borra por contenido, busco a cual pertenece el id
    const rating = (await this.getRatings()).find((item) => item.id === id);

    if (!rating) {
      throw new FeedbackRatingError("RATING_NOT_FOUND");
    }

    // 2. borrar calificacion
    const res = await this.http.delete("/feedback/ratings", {
      query: { tmdbId: rating.tmdbId as number, mediaType: rating.mediaType as string },
    });

    if (!res.ok) {
      throw new FeedbackRatingError(this.ratingError(res.status));
    }
  }

  // ---------- resenas ----------
  async createReview(request: JsonObject): Promise<JsonObject> {
    const res = await this.http.post("/feedback/reviews/create", request);

    if (!res.ok) {
      throw new Error(`No se pudo crear la reseña (${res.status})`);
    }

    return { ...request, success: true };
  }

  async updateReview(id: string, request: JsonObject): Promise<JsonObject | null> {
    const res = await this.http.put(`/feedback/reviews/update/${id}`, request);

    return res.ok ? { id, ...request } : null;
  }

  async deleteReview(id: string): Promise<null> {
    await this.http.delete(`/feedback/reviews/${id}`);

    return null;
  }

  // ---------- helpers ----------
  private ratingError(status: number): FeedbackRatingErrorCode {
    if (status === 401) return "UNAUTHENTICATED";
    if (status === 403) return "FORBIDDEN";
    if (status === 404) return "RATING_NOT_FOUND";
    if (status === 409) return "DUPLICATE_RATING";

    return "INVALID_RATING";
  }
}
