import { asClass, asFunction } from "awilix";

import { FeedbackDb } from "../../mock/feedback/feedback.db";
import { FeedbackService } from "../../mock/feedback/feedback.service";
import { FeedbackStorage } from "../../mock/feedback/feedback.storage";

function createFeedbackDb({
  feedbackStorage,
}: {
  feedbackStorage: FeedbackStorage;
}) {
  return new FeedbackDb(feedbackStorage);
}

function createFeedbackService({ feedbackDb }: { feedbackDb: FeedbackDb }) {
  return new FeedbackService(feedbackDb);
}

export const feedbackMockDi = {
  feedbackStorage: asClass(FeedbackStorage).singleton(),
  feedbackDb: asFunction(createFeedbackDb).singleton(),
  feedbackService: asFunction(createFeedbackService).singleton(),
};
