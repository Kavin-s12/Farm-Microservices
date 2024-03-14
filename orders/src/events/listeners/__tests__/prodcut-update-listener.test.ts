import { ProductUpdatedEvent } from "@farmmicro/common";
import mongoose from "mongoose";
import { ProductUpdatedListener } from "../product-updated-listeners";
import { natsWrapper } from "../../../nats-wrapper";
import { Product } from "../../../models/productModel";

const setup = async () => {
  // create an instance of the listener
  const listener = new ProductUpdatedListener(natsWrapper.client);

  //Create a product
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    countInStock: 10,
    price: 10,
  });

  await product.save();

  // create a fake data event
  const data: ProductUpdatedEvent["data"] = {
    version: product.version + 1,
    id: product.id,
    countInStock: 15,
    price: 100,
  };

  //create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, product, data, msg };
};

it("update a product and save in product collection", async () => {
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

it("does not call acks if the event has a skipped version number", async () => {
  const { data, listener, msg } = await setup();

  data.version = 100;

  try {
    await listener.onMessage(data, msg);
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
