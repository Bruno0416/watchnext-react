import type { JsonArray, JsonObject } from "../json.types";
import { FeedbackStorage } from "./feedback.storage";

interface FeedbackSeed extends JsonObject {
  ratings: JsonArray;
  reviews: JsonArray;
  aggregatedReviews: Record<string, JsonObject>;
}

export class FeedbackDb {
  private storage: FeedbackStorage;

  constructor(storage: FeedbackStorage) {
    this.storage = storage;
  }

  private data: FeedbackSeed | null = null;

  // ---------- carga inicial ----------
  private async load(): Promise<FeedbackSeed> {
    if (this.data) {
      return this.data;
    }

    const stored = this.storage.get() as FeedbackSeed | null;

    if (stored) {
      this.data = structuredClone(stored);
      return this.data;
    }

    const response = await fetch("/data/feedback.json");
    this.data = (await response.json()) as FeedbackSeed;
    this.storage.set(this.data);

    return this.data;
  }

  private persist(): void {
    if (this.data) {
      this.storage.set(this.data);
    }
  }

  // ---------- consultas ----------
  async getRatings(): Promise<JsonArray> {
    return structuredClone((await this.load()).ratings);
  }

  async getReviews(): Promise<JsonArray> {
    return structuredClone((await this.load()).reviews);
  }

  async getAggregated(key: string): Promise<JsonObject | null> {
    const data = await this.load();
    const reviews = data.aggregatedReviews[key];

    return reviews ? structuredClone(reviews) : null;
  }

  async insertRating(rating: JsonObject): Promise<JsonObject> {
    const data = await this.load();
    const stored = structuredClone(rating);

    data.ratings.push(stored);
    this.persist();

    return structuredClone(stored);
  }

  async insertReview(review: JsonObject): Promise<JsonObject> {
    const data = await this.load();
    const stored = structuredClone(review);

    data.reviews.push(stored);
    this.persist();

    return structuredClone(stored);
  }

  async updateReview(
    id: string,
    changes: JsonObject,
  ): Promise<JsonObject | null> {
    const data = await this.load();
    const index = data.reviews.findIndex((item) => item.id === id);

    if (index < 0) {
      return null;
    }

    data.reviews[index] = {
      ...data.reviews[index],
      ...structuredClone(changes),
    };
    this.persist();

    return structuredClone(data.reviews[index]);
  }

  async deleteReview(id: string): Promise<null> {
    const data = await this.load();

    data.reviews = data.reviews.filter((item) => item.id !== id);
    this.persist();

    return null;
  }
}
