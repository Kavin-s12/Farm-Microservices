import { Listener, ProductUpdatedEvent, Subjects } from "@farmmicro/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Product } from "../../models/productModel";

export class ProductUpdatedListener extends Listener<ProductUpdatedEvent> {
  readonly subject = Subjects.ProductUpdated;

  queueGroupName = queueGroupName;

  async onMessage(data: ProductUpdatedEvent["data"], msg: Message) {
    const { countInStock, price } = data;

    const product = await Product.findByEvent(data);

    if (!product) {
      throw new Error("Product not found");
    }

    product.set({ countInStock, price });
    await product.save();

    msg.ack();
  }
}
