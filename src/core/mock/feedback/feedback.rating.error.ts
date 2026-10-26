export type FeedbackRatingErrorCode =
  | "UNAUTHENTICATED"
  | "INVALID_RATING"
  | "DUPLICATE_RATING"
  | "RATING_NOT_FOUND"
  | "FORBIDDEN";

export class FeedbackRatingError extends Error {
  constructor(public readonly code: FeedbackRatingErrorCode) {
    super(code);
    this.name = "FeedbackRatingError";
  }
}
