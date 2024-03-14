import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import {
  OrderCreatedEvent,
  OrderStatus,
  priceCalculator,
} from "@farmmicro/common";
import mongoose from "mongoose";
import { Product } from "../../../models/productModel";

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  //create a product
  const userOne = global.signin({ isAdmin: true });

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

  const { totalPrice } = priceCalculator(orderItems);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    user: new mongoose.Types.ObjectId().toHexString(),
    orderItems: orderItems,
    status: OrderStatus.Created,
    totalPrice,
    expiresAt: new Date().toISOString(),
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
    product.countInStock - data.orderItems[0].qty
  );
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
