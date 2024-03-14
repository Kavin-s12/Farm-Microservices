import { Publisher, Subjects, OrderCreatedEvent } from "@farmmicro/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
