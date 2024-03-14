import request from "supertest";
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";

it("Create a sample order with data", async () => {
  const data = await testData();
  const response = await request(app)
    .post("/api/orders/create")
    .set("Cookie", global.signup())
    .send(data)
    .expect(201);

  expect(response.body).toMatchObject(data);
  expect(response.body.isPaid).toBeFalsy();
  expect(response.body.isDelivered).toBeFalsy();
});

it("Create a sample order - Not Authorized", async () => {
  const data = await testData();
  return request(app).post("/api/orders/create").send(data).expect(401);
});

it("Create a sample order without data", async () => {
  return request(app)
    .post("/api/orders/create")
    .set("Cookie", global.signup())
    .send({})
    .expect(400);
});

// mis match in total price
it("Create a sample order with modified total price data", async () => {
  const data = await testData();
  data.totalPrice = 100;
  await request(app)
    .post("/api/orders/create")
    .set("Cookie", global.signup())
    .send(data)
    .expect(400);
});

it("Create a sample order without oderItems", async () => {
  const data = await testData();
  data.orderItems = [];
  const response = await request(app)
    .post("/api/orders/create")
    .set("Cookie", global.signup())
    .send(data)
    .expect(400);
});

it("Create a sample order without shipping address", async () => {
  const data = await testData();
  data.shippingAddress = {
    address: "",
    postalCode: 0,
    city: "",
    country: "",
  };
  const response = await request(app)
    .post("/api/orders/create")
    .set("Cookie", global.signup())
    .send(data)
    .expect(400);
});

it("Create a sample order with product more than available stock", async () => {
  const data = await testData();
  data.orderItems[0].qty = 25;
  const response = await request(app)
    .post("/api/orders/create")
    .set("Cookie", global.signup())
    .send(data)
    .expect(400);
});

it("Create a sample order without mongoose product Id ", async () => {
  const data = await testData();
  data.orderItems[0].productId = "123sdfs";
  const response = await request(app)
    .post("/api/orders/create")
    .set("Cookie", global.signup())
    .send(data)
    .expect(400);
});

//publisher
it("publishes an order created event", async () => {
  const data = await testData();
  await request(app)
    .post("/api/orders/create")
    .set("Cookie", global.signup())
    .send(data)
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
