import type { MediaDetail } from "../../domain/entities/media.detail";

export type MediaState =
  | { status: "loading" }
  | { status: "invalid" }
  | { status: "notFound" }
  | { status: "error"; message: string }
  | { status: "ready"; detail: MediaDetail };
