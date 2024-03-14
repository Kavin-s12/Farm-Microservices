import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { OrderStatus } from "@farmmicro/common";
import { Order } from "../../model/orderModel";

it("order Id or token validation fails", async () => {
  return request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({ orderId: "test123" })
    .expect(400);
});

it("order not found in the database", async () => {
  const orderId = new mongoose.Types.ObjectId();
  return request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({ orderId, token: "token123" })
    .expect(404);
});

it("Order cannot be created without sigin", async () => {
  return request(app)
    .post("/api/payments")
    .send({ orderId: "test123", token: "token123" })
    .expect(401);
});

it("Order cannot be payed by different user", async () => {
  const userOne = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    user: userOne,
    totalPrice: 1080,
    status: OrderStatus.Created,
    version: 0,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({ orderId: order.id, token: "token123" })
    .expect(401);
});

it("Order failed - without a valid token", async () => {
  const userOne = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    user: userOne,
    totalPrice: 1080,
    status: OrderStatus.Created,
    version: 0,
  });

  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userOne))
    .send({ orderId: order.id, token: "test_token" })
    .expect(400);
});

it("returns a 201 with valid inputs", async () => {
  const userOne = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    user: userOne,
    totalPrice: 1080,
    status: OrderStatus.Created,
    version: 0,
  });

  await order.save();

  // await request(app)
  //   .post("/api/payments")
  //   .set("Cookie", global.signin(userOne))
  //   .send({ orderId: order.id, token: "tok_visa" })
  //   .expect(201);

  // const chargeOptions = (stripe.paymentIntents.create as jest.Mock).mock
  //   .calls[0][0];
  // expect(chargeOptions.source).toEqual("tok_visa");
  // expect(chargeOptions.amount).toEqual(order.totalPrice * 100);
  // expect(chargeOptions.currency).toEqual("inr");
});
