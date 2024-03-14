import { PaymentCreatedEvent, Publisher, Subjects } from "@farmmicro/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
