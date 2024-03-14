import request from "supertest";
import { app } from "../../app";
import { OrderTest } from "../../test/setup";

const createOrder = async (cookie: string[], inputData: OrderTest) => {
  return request(app)
    .post("/api/orders/create")
    .set("Cookie", cookie)
    .send(inputData);
};

it("Get order by ID", async () => {
  const cookie = global.signup();
  const inputData = await testData();
  const creatOrderResponse = await createOrder(cookie, inputData);

  const response = await request(app)
    .get(`/api/orders/${creatOrderResponse.body.id}`)
    .set("Cookie", cookie)
    .send({})
    .expect(200);

  expect(response.body).toMatchObject(inputData);
  expect(response.body.isPaid).toBeFalsy();
  expect(response.body.isDelivered).toBeFalsy();
});

it("Get order by ID - Not authorized", async () => {
  const cookie = global.signup();
  const inputData = await testData();
  const creatOrderResponse = await createOrder(cookie, inputData);

  await request(app)
    .get(`/api/orders/${creatOrderResponse.body.id}`)
    .send({})
    .expect(401);
});

it("Get my orders", async () => {
  const cookie = global.signup();
  const inputData = await testData();
  await createOrder(cookie, inputData);

  const response = await request(app)
    .get(`/api/orders/myorder`)
    .set("Cookie", cookie)
    .send({})
    .expect(200);

  expect(response.body[0]).toMatchObject(inputData);
});

it("Get my orders - Not authorized", async () => {
  const cookie = global.signup();
  const inputData = await testData();
  await createOrder(cookie, inputData);

  await request(app).get(`/api/orders/myorder`).send({}).expect(401);
});
