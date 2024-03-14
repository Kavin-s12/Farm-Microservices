import {
  ExpirationCompletedEvent,
  Publisher,
  Subjects,
} from "@farmmicro/common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
  readonly subject = Subjects.ExpirationCompleted;
}
