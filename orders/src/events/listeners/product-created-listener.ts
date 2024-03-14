import { Listener, ProductCreatedEvent, Subjects } from "@farmmicro/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Product } from "../../models/productModel";

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  readonly subject = Subjects.ProductCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: ProductCreatedEvent["data"], msg: Message) {
    const { id, countInStock, price } = data;

    const product = Product.build({
      countInStock,
      price,
      id,
    });

    await product.save();

    msg.ack();
  }
}
