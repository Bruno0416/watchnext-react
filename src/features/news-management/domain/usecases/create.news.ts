import type { ManagedNews, NewsDraft } from "../entities/managed.news";
import type { NewsManagementRepository } from "../repositories/news.management.repository";

export class CreateNews {
  constructor(private readonly repo: NewsManagementRepository) {}

  async call(draft: NewsDraft): Promise<ManagedNews> {
    // limpio espacios aca para que ninguna vista se olvide
    return this.repo.create(limpiar(draft));
  }
}

export function limpiar(d: NewsDraft): NewsDraft {
  return {
    title: d.title.trim(),
    summary: d.summary.trim(),
    content: d.content.trim(),
    imageUrl: d.imageUrl.trim(),
  };
}
