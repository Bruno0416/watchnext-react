import type { ListSummary } from "../entities/list.summary";
import type { ListRepository } from "../repositories/list.repository";

export class GetLists {
  constructor(private readonly repo: ListRepository) {}

  async call(): Promise<ListSummary[]> {
    return this.repo.getAll();
  }
}
