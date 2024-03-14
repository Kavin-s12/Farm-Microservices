import { ProductCreatedEvent } from "@farmmicro/common";
import { natsWrapper } from "../../../nats-wrapper";
import { ProductCreatedListener } from "../product-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Product } from "../../../models/productModel";

const setup = async () => {
  // create an instance of the listener
  const listener = new ProductCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: ProductCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    countInStock: 10,
    price: 10,
  };

  //create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves a product", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const product = await Product.findById(data.id);

  expect(product).toBeDefined();
  expect(product!.countInStock).toEqual(data.countInStock);
  expect(product!.price).toEqual(data.price);
  expect(product!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
