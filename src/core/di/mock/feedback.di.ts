import { asClass, asFunction } from "awilix";

import { FeedbackDb } from "../../mock/feedback/feedback.db";
import { FeedbackService } from "../../mock/feedback/feedback.service";
import { FeedbackStorage } from "../../mock/feedback/feedback.storage";
import type { AuthStorage } from "../../mock/auth/auth.storage";

function createFeedbackDb({
  feedbackStorage,
}: {
  feedbackStorage: FeedbackStorage;
}) {
  return new FeedbackDb(feedbackStorage);
}

function createFeedbackService({
  feedbackDb,
  authStorage,
}: {
  feedbackDb: FeedbackDb;
  authStorage: AuthStorage;
}) {
  return new FeedbackService(feedbackDb, authStorage);
}

export const feedbackMockDi = {
  feedbackStorage: asClass(FeedbackStorage).singleton(),
  feedbackDb: asFunction(createFeedbackDb).singleton(),
  feedbackService: asFunction(createFeedbackService).singleton(),
};
