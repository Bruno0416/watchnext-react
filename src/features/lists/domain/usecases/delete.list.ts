import type { ListRepository } from "../repositories/list.repository";

export class DeleteList {
  constructor(private readonly repo: ListRepository) {}

  async call(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
