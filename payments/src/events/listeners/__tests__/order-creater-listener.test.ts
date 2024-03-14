import { OrderCreatedEvent, OrderStatus } from "@farmmicro/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../model/orderModel";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    user: new mongoose.Types.ObjectId().toHexString(),
    orderItems: [
      {
        name: "test name",
        qty: 10,
        price: 100,
        image: "image",
        productId: new mongoose.Types.ObjectId().toHexString(),
      },
    ],
    status: OrderStatus.Created,
    totalPrice: 1080,
    expiresAt: new Date().toISOString(),
  };

  //@ts-ignore

  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("Replicates the order info", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.totalPrice).toEqual(data.totalPrice);
  expect(order!.user).toEqual(data.user);
  expect(order!.id).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
