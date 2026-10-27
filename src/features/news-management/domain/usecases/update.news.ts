import type { ManagedNews, NewsDraft } from "../entities/managed.news";
import type { NewsManagementRepository } from "../repositories/news.management.repository";
import { limpiar } from "./create.news";

export class UpdateNews {
  constructor(private readonly repo: NewsManagementRepository) {}

  async call(id: string, draft: NewsDraft): Promise<ManagedNews> {
    return this.repo.update(id, limpiar(draft));
  }
}
