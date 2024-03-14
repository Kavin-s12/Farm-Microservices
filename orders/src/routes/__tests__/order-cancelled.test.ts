import request from "supertest";
import { app } from "../../app";
import { OrderStatus } from "@farmmicro/common";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { OrderTest } from "../../test/setup";

const createOrder = async (cookie: string[], inputData: OrderTest) => {
  return request(app)
    .post("/api/orders/create")
    .set("Cookie", cookie)
    .send(inputData);
};

it("Cancel the order which does not exist", async () => {
  const cookie = global.signup(true);

  await request(app)
    .delete(`/api/orders/${new mongoose.Types.ObjectId()}`)
    .set("Cookie", cookie)
    .expect(404);
});

it("Cancel the order without login", async () => {
  const cookie = global.signup(true);
  const inputData = await testData();
  const { body: order } = await createOrder(cookie, inputData);

  await request(app).delete(`/api/orders/${order.id}`).expect(401);
});

it("Cancel the order for different user", async () => {
  const userOne = global.signup();
  const userTwo = global.signup();
  const inputData = await testData();
  const { body: order } = await createOrder(userOne, inputData);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", userTwo)
    .expect(401);
});

it("Check for successfull cancellation", async () => {
  const userOne = global.signup();

  const inputData = await testData();
  const { body: order } = await createOrder(userOne, inputData);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", userOne)
    .expect(204);
  const response = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", userOne)
    .expect(200);

  expect(response.body.status).toEqual(OrderStatus.Cancelled);
});

it("publishes an order cancelled event", async () => {
  const cookie = global.signup();
  const inputData = await testData();
  const { body: order } = await createOrder(cookie, inputData);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", cookie)
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});
