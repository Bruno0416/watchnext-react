import type { ListVisibility } from "./list.visibility";

export type ListSummaryProps = {
  id: string;
  userId: string;
  name: string;
  description: string;
  visibility: ListVisibility;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
};

// lo que muestro en "mis listas", sin los items adentro
export class ListSummary {
  constructor(public readonly props: ListSummaryProps) {}

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get visibility(): ListVisibility {
    return this.props.visibility;
  }

  get itemCount(): number {
    return this.props.itemCount;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
