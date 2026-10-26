import type { JsonArray, JsonObject } from "../json.types";
import type { AuthStorage } from "../auth/auth.storage";
import { FeedbackDb } from "./feedback.db";
import { FeedbackRatingError } from "./feedback.rating.error";

export class FeedbackService {
  private db: FeedbackDb;

  constructor(db: FeedbackDb, private readonly authStorage: AuthStorage) {
    this.db = db;
  }

  // --- helper privado ---
  private requireUserId(): string {
    const userId = this.authStorage.getUserId();
    if (!userId || !this.authStorage.getTokens() || !this.authStorage.getRole()) {
      throw new FeedbackRatingError("UNAUTHENTICATED");
    }
    return userId;
  }

  // ---------- endpoints (simulados) ----------
  async getRatings(): Promise<JsonArray> {
    return this.db.getRatings();
  }

  async getReviews(): Promise<JsonArray> {
    return this.db.getReviews();
  }

  async getAggregatedReviews(key: string): Promise<JsonObject | null> {
    return this.db.getAggregated(key);
  }

  async getMyRating(tmdbId: number): Promise<JsonObject | null> {
    // 1. identificar al usuario autenticado
    const userId = this.requireUserId();
    return this.db.findRating(userId, tmdbId);
  }

  async createRating(request: JsonObject): Promise<JsonObject> {
    // 1. validar la pelicula y la puntuacion
    const userId = this.requireUserId();
    const { tmdbId, score } = request;
    if (
      request.mediaType !== "MOVIE" ||
      typeof tmdbId !== "number" ||
      !Number.isSafeInteger(tmdbId) ||
      tmdbId <= 0 ||
      typeof score !== "number" ||
      !Number.isInteger(score) ||
      score < 1 ||
      score > 10
    ) {
      throw new FeedbackRatingError("INVALID_RATING");
    }

    // 2. crear la valoracion con identidad controlada por el mock
    const rating = await this.db.insertRating({
      id: crypto.randomUUID(),
      tmdbId,
      mediaType: "MOVIE",
      score,
      userId,
      createdAt: new Date().toISOString(),
    });
    if (!rating) throw new FeedbackRatingError("DUPLICATE_RATING");
    return rating;
  }

  async deleteRating(id: string): Promise<void> {
    // 1. comprobar la identidad antes de modificar datos
    const userId = this.requireUserId();
    const result = await this.db.deleteRating(id, userId);
    if (result === "missing") throw new FeedbackRatingError("RATING_NOT_FOUND");
    if (result === "forbidden") throw new FeedbackRatingError("FORBIDDEN");
  }

  async createReview(request: JsonObject): Promise<JsonObject> {
    return this.db.insertReview({
      id: crypto.randomUUID(),
      ...structuredClone(request),
    });
  }

  async updateReview(
    id: string,
    request: JsonObject,
  ): Promise<JsonObject | null> {
    return this.db.updateReview(id, request);
  }

  async deleteReview(id: string): Promise<null> {
    return this.db.deleteReview(id);
  }
}
