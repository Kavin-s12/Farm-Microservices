import request from "supertest";
import { app } from "../../../app";
import { ExpirationCompletedEvent, OrderStatus } from "@farmmicro/common";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompletedListener } from "../expiration-completed-listener";
import { OrderTest } from "../../../test/setup";
import { Order } from "../../../models/orderModel";

const createOrder = async (cookie: string[], inputData: OrderTest) => {
  return request(app)
    .post("/api/orders/create")
    .set("Cookie", cookie)
    .send(inputData);
};

const setup = async () => {
  // create an instance of the listener
  const listener = new ExpirationCompletedListener(natsWrapper.client);

  //Create a order
  const cookie = global.signup();
  const inputData = await testData();
  const { body: order } = await createOrder(cookie, inputData);

  // create a fake data event
  const data: ExpirationCompletedEvent["data"] = {
    orderId: order.id,
  };

  //create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, data, msg };
};

it("Create a expiration listener and cancel the order, ack the listener", async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updateOrder = await Order.findById(order.id);

  expect(updateOrder?.status).toEqual(OrderStatus.Cancelled);

  expect(msg.ack).toHaveBeenCalled();
});

it("emit an OrderCancelled event", async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});
