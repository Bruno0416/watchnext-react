import type { JsonArray, JsonObject } from "../json.types";
import { FeedbackDb } from "./feedback.db";

export class FeedbackService {
  private db: FeedbackDb;

  constructor(db: FeedbackDb) {
    this.db = db;
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

  async createRating(request: JsonObject): Promise<JsonObject> {
    return this.db.insertRating({
      id: crypto.randomUUID(),
      ...structuredClone(request),
    });
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
