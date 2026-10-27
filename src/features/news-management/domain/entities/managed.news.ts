export type ManagedNewsProps = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string | null;
  publishedAt: Date;
};

// una noticia vista desde administracion; separada de la de consulta publica (HU 13)
export class ManagedNews {
  constructor(public readonly props: ManagedNewsProps) {}

  get id(): string {
    return this.props.id;
  }

  get slug(): string {
    return this.props.slug;
  }

  get title(): string {
    return this.props.title;
  }

  get summary(): string {
    return this.props.summary;
  }

  get content(): string {
    return this.props.content;
  }

  get imageUrl(): string | null {
    return this.props.imageUrl;
  }

  get publishedAt(): Date {
    return this.props.publishedAt;
  }
}

// lo que llena el formulario para crear o editar
export type NewsDraft = {
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
};
