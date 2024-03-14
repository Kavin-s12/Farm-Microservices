import { Listener, OrderCreatedEvent, Subjects } from "@farmmicro/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Product } from "../../models/productModel";
import { ProductUpdatedPublisher } from "../publishers/product-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;

  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const { orderItems } = data;
    // Fetch all products at once
    const products = await Product.find({
      _id: { $in: orderItems.map((item) => item.productId) },
    });

    const unavailableProducts = orderItems.filter(({ productId, qty }) => {
      const product = products.find((p) => p._id.toString() === productId);
      return !product || product.countInStock < qty;
    });

    if (unavailableProducts.length > 0) {
      const unavailableProductsInfo = unavailableProducts
        .map(({ productId, qty }) => `Product ${productId} (Qty: ${qty})`)
        .join(", ");

      throw new Error(
        `Some products are not available in the required quantity: ${unavailableProductsInfo}`
      );
    }

    // Deduct quantities from stock for all products
    for (const { productId, qty } of orderItems) {
      const product = products.find((p) => p._id.toString() === productId);

      if (product) {
        product.countInStock -= qty;
        await product.save();

        await new ProductUpdatedPublisher(natsWrapper.client).publish({
          id: product.id,
          price: product.price,
          countInStock: product.countInStock,
          version: product.version,
        });
      }
    }

    msg.ack();
  }
}
