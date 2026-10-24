import type { ContentSearchResult } from "./content.search.result";

export type ContentSearchResponseProps = {
  originalQuery: string;
  executedQuery: string;
  corrected: boolean;
  totalResults: number;
  results: ContentSearchResult[];
};

export class ContentSearchResponse {
  constructor(public readonly props: ContentSearchResponseProps) {}

  get originalQuery(): string {
    return this.props.originalQuery;
  }

  get executedQuery(): string {
    return this.props.executedQuery;
  }

  get corrected(): boolean {
    return this.props.corrected;
  }

  get totalResults(): number {
    return this.props.totalResults;
  }

  get results(): ContentSearchResult[] {
    return this.props.results;
  }

  static empty(): ContentSearchResponse {
    return new ContentSearchResponse({
      originalQuery: "",
      executedQuery: "",
      corrected: false,
      totalResults: 0,
      results: [],
    });
  }
}
