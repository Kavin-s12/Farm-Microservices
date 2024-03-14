import { Publisher, Subjects, ProductUpdatedEvent } from "@farmmicro/common";

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
  readonly subject = Subjects.ProductUpdated;
}
