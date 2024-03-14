import { Publisher } from "./base-publisher";
import { Subjects } from "./subject";
import { OrderCreatedEvent } from "./order-created-event";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
