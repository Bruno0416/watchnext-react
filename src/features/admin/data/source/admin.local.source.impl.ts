import type { AdminUsersService } from "../../../../core/mock/admin/admin.users.service";
import type { NewsService } from "../../../../core/mock/news/news.service";
import { AdminError } from "../errors/admin.errors";
import { AdminSummaryModel } from "../models/admin.summary.model";
import type { AdminLocalSource } from "./admin.local.source";

export class AdminLocalSourceImpl implements AdminLocalSource {
  constructor(
    private readonly usersService: AdminUsersService,
    private readonly newsService: NewsService,
  ) {}

  async getSummary(): Promise<AdminSummaryModel> {
    try {
      // pido las dos cosas a la vez
      const [users, news] = await Promise.all([this.usersService.list(""), this.newsService.getAll()]);
      return new AdminSummaryModel(users, news);
    } catch {
      throw new AdminError(503);
    }
  }
}
