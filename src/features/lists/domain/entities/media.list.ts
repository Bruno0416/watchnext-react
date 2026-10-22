import type { MediaType } from "../../../../core/models/media.type";
import type { ListItem } from "./list.item";
import type { ListVisibility } from "./list.visibility";

export type MediaListProps = {
  id: string;
  name: string;
  description: string;
  visibility: ListVisibility;
  items: ListItem[];
  createdAt: Date;
  updatedAt: Date;
};

// la lista completa con sus contenidos, es lo que abro en el detalle
export class MediaList {
  constructor(public readonly props: MediaListProps) {}

  get id(): string {
    return this.props.id;
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

  get items(): ListItem[] {
    return this.props.items;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // reviso si un contenido ya esta en la lista antes de agregarlo de nuevo
  has(tmdbId: number, mediaType: MediaType): boolean {
    return this.items.some(
      (item) => item.tmdbId === tmdbId && item.mediaType === mediaType,
    );
  }
}
