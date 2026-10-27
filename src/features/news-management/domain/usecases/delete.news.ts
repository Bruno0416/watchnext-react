import type { NewsManagementRepository } from "../repositories/news.management.repository";

export class DeleteNews {
  constructor(private readonly repo: NewsManagementRepository) {}

  async call(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
