import type { JsonObject } from "../../../../core/mock/json.types";
import { ListSummary } from "../../domain/entities/list.summary";
import { ListVisibility } from "../../domain/entities/list.visibility";

// fecha segura, si viene rota uso la epoca 0 en vez de reventar
export function toDate(value: unknown): Date {
  const parsed = new Date(String(value ?? ""));
  return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
}

export function toVisibility(value: unknown): ListVisibility {
  return String(value ?? "").toUpperCase() === "PRIVATE"
    ? ListVisibility.PRIVATE
    : ListVisibility.PUBLIC;
}

export class ListSummaryModel {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly visibility: string,
    public readonly itemCount: number,
    public readonly createdAt: string,
    public readonly updatedAt: string,
  ) {}

  static fromJson(json: JsonObject): ListSummaryModel {
    return new ListSummaryModel(
      String(json.id),
      String(json.userId ?? ""),
      String(json.name ?? ""),
      String(json.description ?? ""),
      String(json.visibility ?? "PUBLIC"),
      typeof json.itemCount === "number" ? json.itemCount : 0,
      String(json.createdAt ?? ""),
      String(json.updatedAt ?? ""),
    );
  }

  toDomain(): ListSummary {
    return new ListSummary({
      id: this.id,
      userId: this.userId,
      name: this.name,
      description: this.description,
      visibility: toVisibility(this.visibility),
      itemCount: this.itemCount,
      createdAt: toDate(this.createdAt),
      updatedAt: toDate(this.updatedAt),
    });
  }
}
