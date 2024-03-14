import { Listener, ProductDeleteEvent, Subjects } from "@farmmicro/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Product } from "../../models/productModel";

export class ProductDeletedListener extends Listener<ProductDeleteEvent> {
  readonly subject = Subjects.ProductDeleted;

  queueGroupName = queueGroupName;

  async onMessage(data: ProductDeleteEvent["data"], msg: Message) {
    const product = await Product.findByEvent(data);

    if (!product) {
      throw new Error("Product not found");
    }

    await product.deleteOne();

    msg.ack();
  }
}
