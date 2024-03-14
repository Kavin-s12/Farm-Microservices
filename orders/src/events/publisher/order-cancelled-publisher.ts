import { Publisher, Subjects, OrderCancelledEvent } from "@farmmicro/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
