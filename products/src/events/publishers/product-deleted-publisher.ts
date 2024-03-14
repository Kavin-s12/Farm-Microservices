import { Publisher, Subjects, ProductDeleteEvent } from "@farmmicro/common";

export class ProductDeletedPublisher extends Publisher<ProductDeleteEvent> {
  readonly subject = Subjects.ProductDeleted;
}
