import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledEvent } from "@farmmicro/common";
import mongoose from "mongoose";
import { Product } from "../../../models/productModel";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  //create a product

  const product = Product.build({
    user: new mongoose.Types.ObjectId(),
    name: "test",
    image: "test image",
    description: "test description",
    category: "test category",
    brand: "test brand",
    price: 100,
    countInStock: 10,
  });

  await product.save();

  // create event data
  const orderItems = [
    {
      productId: product.id,
      name: product.name,
      qty: 5,
      price: product.price,
      image: product.image,
    },
  ];

  const data: OrderCancelledEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 1,
    orderItems: orderItems,
  };

  //create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, product, data, msg };
};

it("update a product and save in product collection", async () => {
  const { listener, product, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedProduct = await Product.findById(product.id);

  expect(updatedProduct?.countInStock).toEqual(
    product.countInStock + data.orderItems[0].qty
  );
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
