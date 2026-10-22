import type { ManagedNews } from "../entities/managed.news";
import type { NewsManagementRepository } from "../repositories/news.management.repository";

export class GetAllNews {
  constructor(private readonly repo: NewsManagementRepository) {}

  async call(): Promise<ManagedNews[]> {
    return this.repo.getAll();
  }
}
