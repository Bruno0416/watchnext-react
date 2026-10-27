export type NewsArticleProps = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string | null;
  publishedAt: Date;
};

// la noticia como la usa la app, sin nada del mock ni del json
export class NewsArticle {
  constructor(public readonly props: NewsArticleProps) {}

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
